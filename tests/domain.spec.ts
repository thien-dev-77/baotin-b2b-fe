import { expect, test } from "@playwright/test";
import { catalog } from "../lib/catalog";
import { adminApprovals, adminCustomers, adminOrders, branches as previewBranches, orderBlocker as previewOrderBlocker, orderStages as previewStages } from "../lib/admin-preview";
import { branches, orderStages, type AdminApproval, type AdminOrder } from "../lib/types";
import { priceFor } from "../lib/pricing";
import { orderBlocker } from "../lib/order-rules";
import { applyApprovedPrice, buildApprovalRequest } from "../lib/admin-approval";
import { readSalesData, validateSalesDraft, type SalesDraft } from "../lib/admin-sales";
import { warehouseBlocker } from "../lib/admin-warehouse";
import { reconciliationBlocker, validateReceipt, type Receipt } from "../lib/admin-accounting";

test("Preview uses canonical types and order rules without changing fixtures", () => {
  expect(previewBranches).toBe(branches);
  expect(previewStages).toBe(orderStages);
  expect(previewOrderBlocker).toBe(orderBlocker);
  expect(catalog).toHaveLength(63);
  expect(adminCustomers).toHaveLength(7);
  expect(adminOrders).toHaveLength(18);
  expect(adminApprovals).toHaveLength(3);
});

test("Preview pricing preserves retail and customer prices", () => {
  const product = catalog[0];
  const customer = { id: "KH001", name: "Demo", company: "Demo", phone: "0901234567", email: "", role: "b2b" as const };
  expect(priceFor(product, null)).toBe(product.price);
  expect(priceFor(product, customer)).toBe(Math.max(1000, Math.round(product.price * 0.9 / 500) * 500));
  expect(priceFor({ ...product, customerPrice: 12345 }, customer)).toBe(12345);
});

test("Sales validates items and rehydrates trusted price snapshots", () => {
  const customer = adminCustomers[0];
  const draft: SalesDraft = {
    customerId: customer.id, source: "Zalo", items: [{ productId: catalog[0].id, quantity: 2 }],
    details: { recipient: customer.contact, phone: customer.phone, address: "", delivery: "Nhận tại cửa hàng", payment: "Chuyển khoản", note: "" }
  };
  const result = validateSalesDraft(draft, customer.branch, adminCustomers, catalog);
  expect(result.error).toBeUndefined();
  const data = result.data!;
  expect(readSalesData({ ...data, total: 1 }, customer, catalog)?.total).toBe(data.total);
  expect(readSalesData({ ...data, items: data.items.map(item => ({ ...item, unitPrice: 1 })) }, customer, catalog)).toBeNull();
  expect(validateSalesDraft({ ...draft, items: [...draft.items, ...draft.items] }, customer.branch, adminCustomers, catalog).error).toBeTruthy();
});

test("Approved prices apply only to the matching order snapshot", () => {
  const order = adminOrders[0];
  const customer = adminCustomers[0];
  const prices = Object.fromEntries(order.items.map(item => [item.productId, item.unitPrice - 1000]));
  const request = buildApprovalRequest(order, customer, { type: "Giá đặc biệt", reason: "Project quote", prices }, []);
  expect(request.error).toBeUndefined();
  if (request.snapshot?.kind !== "price") throw new Error("Missing price snapshot");
  const approval: AdminApproval = { ...adminApprovals[0], status: "Đã duyệt", snapshot: request.snapshot };
  expect(applyApprovedPrice(order, [approval]).total).toBe(request.snapshot.requestedTotal);
  const changed = { ...order, items: order.items.map(item => ({ ...item, quantity: item.quantity + 1 })) };
  expect(applyApprovedPrice(changed, [approval])).toBe(changed);
  expect(orderBlocker(changed, adminCustomers, [approval], catalog)).toBeTruthy();
});

test("Credit approval stays scoped to the approved order amount", () => {
  const order = adminOrders[1];
  const customer = adminCustomers[1];
  expect(orderBlocker(order, adminCustomers, [], catalog)).toBeTruthy();
  const request = buildApprovalRequest(order, customer, { type: "Công nợ", reason: "Credit review", prices: {} }, []);
  expect(request.error).toBeUndefined();
  const approval: AdminApproval = { ...adminApprovals[1], status: "Đã duyệt", snapshot: request.snapshot };
  expect(orderBlocker(order, adminCustomers, [approval], catalog)).toBe("");
  expect(orderBlocker({ ...order, total: order.total + 1 }, adminCustomers, [approval], catalog)).toBeTruthy();
});

test("Warehouse requires checked items and resolved shortages", () => {
  const order: AdminOrder = { ...adminOrders[0], status: "Đang soạn" };
  expect(warehouseBlocker(order, { checks: {}, history: [] })).toBeTruthy();
  const record = { checks: Object.fromEntries(order.items.map(item => [item.productId, true])), history: [] };
  expect(warehouseBlocker(order, record)).toBe("");
  expect(warehouseBlocker(order, { ...record, issue: { productId: order.items[0].productId, quantity: 1, note: "Missing item", reportedAt: "2026-10-04T00:00:00Z" } })).toBeTruthy();
});

test("Accounting rejects overpayment and mismatched reconciliation", () => {
  const order: AdminOrder = { ...adminOrders[0], status: "Chờ soạn hàng" };
  const draft = { orderId: order.id, amount: order.total + 1, date: order.date, method: "Chuyển khoản" as const, reference: "TEST", note: "" };
  expect(validateReceipt(draft, order, [], order.date)).toBeTruthy();
  const receipt: Receipt = { ...draft, amount: 50000, id: "TEST", branch: order.branch, status: "Chờ đối chiếu", createdAt: "2026-10-04T00:00:00Z" };
  expect(reconciliationBlocker(receipt, 40000, "TEST", "Checked", [])).toBeTruthy();
  expect(reconciliationBlocker(receipt, 50000, "TEST", "Checked", [])).toBe("");
});

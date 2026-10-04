"use client";

import { CartLine, Customer, Order, Product, findProduct } from "@/lib/catalog";
import { CheckCircle2, X } from "lucide-react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

type Store = { cart: CartLine[]; favorites: string[]; orders: Order[]; coupon: string };
type Commerce = Store & {
  customer: Customer | null; ready: boolean; notice: (message: string) => void;
  add: (product: Product, quantity?: number) => void; setQuantity: (id: string, quantity: number) => void;
  remove: (id: string) => void; toggleFavorite: (id: string) => void;
  login: (customer: Customer, remember: boolean) => void; logout: () => void;
  placeOrder: (order: Order) => void;
  setCoupon: (coupon: string) => void;
};
const Context = createContext<Commerce | null>(null);
const initial: Store = { cart: [], favorites: [], orders: [], coupon: "" };

const profileKey = (identity: string) => `baotin-profile-${identity.trim().toLowerCase().replace(/\s+/g, "")}`;
export function readPreviewCustomer(identity: string): Customer | null {
  try {
    const value = JSON.parse(localStorage.getItem(profileKey(identity)) || "null");
    return value?.role === "b2b" && typeof value.id === "string" && typeof value.name === "string" && typeof value.email === "string" && typeof value.phone === "string" ? value : null;
  } catch { return null; }
}

export function CommerceProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store>(initial);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [ready, setReady] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("baotin-commerce-v1");
      if (raw) {
        const parsed = JSON.parse(raw) as Store;
        setStore({
          coupon: parsed.coupon === "BAOTIN10" ? parsed.coupon : "",
          cart: Array.isArray(parsed.cart) ? parsed.cart.filter((line) => findProduct(line.productId) && Number.isInteger(line.quantity) && line.quantity > 0).map((line) => ({ ...line, quantity: Math.min(line.quantity, findProduct(line.productId)!.stock) })).filter((line) => line.quantity > 0) : [],
          favorites: Array.isArray(parsed.favorites) ? parsed.favorites.filter((id) => findProduct(id)) : [],
          orders: Array.isArray(parsed.orders) ? parsed.orders.filter((order) => order.id && Array.isArray(order.items)) : []
        });
      }
      const session = sessionStorage.getItem("baotin-customer") || localStorage.getItem("baotin-customer");
      if (session) { const parsed = JSON.parse(session); if (parsed.role === "b2b" && typeof parsed.id === "string") setCustomer(parsed); }
    } catch { /* Storage is optional; the shopping flow remains available without it. */ }
    setReady(true);
  }, []);

  useEffect(() => { if (ready) { try { localStorage.setItem("baotin-commerce-v1", JSON.stringify(store)); } catch {} } }, [store, ready]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(""), 3500); return () => clearTimeout(timer); }, [toast]);
  const notice = useCallback((message: string) => setToast(message), []);
  const add = (product: Product, quantity = 1) => {
    if (product.stock < 1) { notice("Sản phẩm hiện hết hàng."); return; }
    const amount = Number.isFinite(quantity) ? Math.max(1, Math.floor(quantity)) : 1;
    setStore((state) => {
      const existing = state.cart.find((line) => line.productId === product.id);
      const nextQuantity = Math.min(product.stock, (existing?.quantity || 0) + amount);
      return { ...state, cart: existing ? state.cart.map((line) => line.productId === product.id ? { ...line, quantity: nextQuantity } : line) : [...state.cart, { productId: product.id, quantity: nextQuantity }] };
    });
    notice(`Đã thêm ${product.name} vào giỏ hàng.`);
  };
  const setQuantity = (id: string, quantity: number) => {
    const product = findProduct(id); if (!product) return;
    setStore((state) => ({ ...state, cart: state.cart.map((line) => line.productId === id ? { ...line, quantity: Math.max(1, Math.min(product.stock, Math.floor(quantity) || 1)) } : line) }));
  };
  const remove = (id: string) => setStore((state) => ({ ...state, cart: state.cart.filter((line) => line.productId !== id) }));
  const toggleFavorite = (id: string) => setStore((state) => ({ ...state, favorites: state.favorites.includes(id) ? state.favorites.filter((item) => item !== id) : [...state.favorites, id] }));
  const login = (value: Customer, remember: boolean) => {
    setCustomer(value);
    try {
      localStorage.removeItem("baotin-customer"); sessionStorage.removeItem("baotin-customer");
      (remember ? localStorage : sessionStorage).setItem("baotin-customer", JSON.stringify(value));
      [value.id, value.email, value.phone].filter(Boolean).forEach((identity) => localStorage.setItem(profileKey(identity), JSON.stringify(value)));
    } catch {}
  };
  const logout = () => { setCustomer(null); try { localStorage.removeItem("baotin-customer"); sessionStorage.removeItem("baotin-customer"); } catch {} };
  const setCoupon = (coupon: string) => setStore((state) => ({ ...state, coupon }));
  const placeOrder = (order: Order) => setStore((state) => ({ ...state, orders: [order, ...state.orders], cart: [], coupon: "" }));

  return <Context.Provider value={{ ...store, customer, ready, notice, add, setQuantity, remove, toggleFavorite, login, logout, placeOrder, setCoupon }}>
    {children}
    {toast && <div role="status" className="fixed bottom-6 left-3 right-3 z-[100] mx-auto flex max-w-md items-center gap-3 rounded-lg border border-border bg-white p-4 text-sm shadow-card-hover sm:left-auto sm:right-6"><CheckCircle2 className="shrink-0 text-success" size={20} /><span className="flex-1">{toast}</span><button aria-label="Đóng thông báo" className="bt-icon-button" onClick={() => setToast("")}><X size={16} /></button></div>}
  </Context.Provider>;
}
export function useCommerce() { const value = useContext(Context); if (!value) throw new Error("CommerceProvider is required"); return value; }

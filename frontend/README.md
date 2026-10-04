# Bao Tin Frontend

Next.js App Router + TypeScript + Tailwind CSS + Lucide + Inter.
Storefront B2B/B2C va dashboard noi bo dung du lieu mock hien co.
Chua co API, auth/RBAC server, thanh toan that hay dong bo KiotViet.

Tu thu muc nay:

```sh
npm ci
npm run dev -- --port 3010
npm run lint
npm run build
npm run typecheck
```

Kiem thu browser voi server dang chay:

```sh
QA_BASE_URL=http://localhost:3010 npm run test:accounting
QA_BASE_URL=http://localhost:3010 npm run test:admin
QA_BASE_URL=http://localhost:3010 npm run test:sales
QA_BASE_URL=http://localhost:3010 npm run test:approvals
QA_BASE_URL=http://localhost:3010 npm run test:warehouse
QA_BASE_URL=http://localhost:3010 npm run test:ui
```

Lan dau can cai Chromium: `npx playwright install chromium`.
Khong chay build va dev tren cung distDir. Preview rieng:
`NEXT_DIST_DIR=.next-preview npm run dev -- --port 3010`.
Chay typecheck sau build, khong dong thoi khi Next sinh/xoa types.

Routes: `/`, `/search`, `/products/:slug`, `/account`, `/admin`,
`/admin/orders`, `/admin/warehouse`, `/admin/accounting`, `/admin/approvals`.
Inventory day du va rule API: [api-handoff.md](../docs/api-handoff.md).
Style: [design-system.md](../docs/design-system.md).
Du lieu mock: `lib/catalog.ts`, `lib/admin-preview.ts`; khong tao catalog moi.

Deploy Next.js: chon **Root Directory = frontend**, install `npm ci`,
build `npm run build`, start `npm run start` neu tu host Node.
Dashboard demo cong khai khong duoc chua du lieu kinh doanh that.

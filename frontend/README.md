# Bao Tin Frontend

Next.js App Router + TypeScript + Tailwind CSS + Lucide + Inter.
Storefront B2B/B2C va dashboard noi bo dung du lieu mock hien co.
API mode da noi NestJS, JWT va PostgreSQL seed mock. Chua co thanh toan
ngan hang/KiotViet that. Xem [backend-integration.md](../docs/backend-integration.md).
frontend/.env.local theo .env.example; backend phai chay cho API va images.
Source backend khong nam trong repo nay; chay rieng tu
[baotin-b2b-be](https://github.com/thien-dev-77/baotin-b2b-be).
Giu shared/ canh frontend/ khi build. Khong dua DB/JWT credentials vao FE env.

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
# Backend repo cloned ben canh FE repo, local test DB + dev:local API
# KHONG chay voi API tro den Supabase
QA_BACKEND_DIR=../../baotin-b2b-be/backend npm run test:connected
# Cac QA ben duoi chi cho API_MODE=false
QA_BASE_URL=http://localhost:3010 npm run test:accounting
QA_BASE_URL=http://localhost:3010 npm run test:admin
QA_BASE_URL=http://localhost:3010 npm run test:sales
QA_BASE_URL=http://localhost:3010 npm run test:approvals
QA_BASE_URL=http://localhost:3010 npm run test:warehouse
QA_BASE_URL=http://localhost:3010 npm run test:ui
```

Lan dau can cai Chromium: `npx playwright install chromium`.
QA_BACKEND_DIR la duong dan toi backend/ co dependencies va .env.local.
Co the bo bien nay trong workspace cu co backend/ canh frontend/.
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
Production can backend host, persistent media volume va HTTPS cookies.
Next.js 14 hien co npm audit high/critical, can upgrade truoc production.
Khong deploy tai khoan seed/du lieu mock ra cong khai.

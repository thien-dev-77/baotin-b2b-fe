# Bao Tin B2B & B2C

Frontend tuong tac de duyet UI truoc khi ket noi backend.

```txt
frontend/  Next.js, components, mock, assets, QA scripts va package-lock
backend/   Khung tai lieu cho NestJS, chua co API
docs/      Nghiep vu, design system, quy tac UI, ban giao API
design/    Anh thiet ke tham chieu
```

## Chay Frontend

```sh
npm --prefix frontend ci
npm run dev -- --port 3010
```

Website: http://localhost:3010. Quan tri: http://localhost:3010/admin.
Thu tien va doi chieu: http://localhost:3010/admin/accounting.
Neu server cu dang chay tu root, dung va khoi dong lai bang lenh tren.
Deploy: dat root directory la `frontend`; chi frontend co dependencies/build.

## Kiem Thu

```sh
npm run lint
npm run build
npm run typecheck
QA_BASE_URL=http://localhost:3010 npm run test:accounting
QA_BASE_URL=http://localhost:3010 npm run test:admin
QA_BASE_URL=http://localhost:3010 npm run test:ui
```

Cac lenh root chuyen tiep den `frontend/package.json`.
QA browser can server dang chay va Chromium Playwright.
Doc [frontend/README.md](frontend/README.md) de xem cac test nghiep vu.

## Tai Lieu

- [Project](docs/project.md)
- [Bat dau cong viec](docs/start-work.md)
- [Design system](docs/design-system.md)
- [Frontend platform](docs/frontend-platform.md)
- [Dashboard preview](docs/admin-preview.md)
- [Ban giao UI va ke hoach API](docs/api-handoff.md)
- [Thu tien va doi chieu](docs/accounting-preview.md)

**Gioi han:** tat ca du lieu la mock; localStorage khong phai auth, phan quyen,
gia/ton/no tin cay, thanh toan that hay dong bo KiotViet. Storefront va admin
chua chung order service. Khong cong bo du lieu kinh doanh that trong demo.
Tai lieu media ghi ro anh minh hoa va dieu kien xac minh truoc production.

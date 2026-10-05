# Bao Tin Frontend B2B & B2C

Repo nay chi chua Next.js frontend, TypeScript, Tailwind, Inter va Lucide.
Backend NestJS/TypeORM/JWT va media duoc quan ly rieng tai
[baotin-b2b-be](https://github.com/thien-dev-77/baotin-b2b-be).
Xem [Backend Integration](docs/backend-integration.md) cho contract API.

```txt
frontend/  Next.js, components, frontend adapters va Playwright
shared/    Types va rules dung chung
docs/      Nghiep vu, design system, quy tac UI, ban giao API
design/    Anh thiet ke tham chieu
```

## Chay Frontend

```sh
npm --prefix frontend ci
# frontend/.env.local theo frontend/.env.example
npm run dev -- --port 3010
```

Website: http://localhost:3010. Quan tri: http://localhost:3010/admin.
Thu tien va doi chieu: http://localhost:3010/admin/accounting.
Frontend env: NEXT_PUBLIC_API_MODE=true, BACKEND_URL=http://127.0.0.1:4000.
Chay API tu repo backend theo
[backend README](https://github.com/thien-dev-77/baotin-b2b-be/blob/main/backend/README.md).
Backend can chay cho API va anh: Next proxy /api/backend/* -> /api/*,
/images/* -> /media/images/* va /media/* -> /media/*.
DATABASE_URL, JWT_SECRET va SEED_PASSWORD chi o backend, khong o frontend env.

`shared/` can cho frontend build, khong phai source NestJS. Types/rules duoc
version trong ca hai repo; khi doi contract can cap nhat ca FE va BE.
Thu muc backend/ local trong workspace hien tai duoc giu nguyen nhung ignored,
khong duoc commit/push vao repo nay.

## Kiem Thu

```sh
npm run lint
npm run build
npm run typecheck
```

Connected browser QA can repo backend rieng. Chay tu frontend/:

```sh
# Chi local DB + dev:local API; KHONG chay voi API Supabase
QA_BACKEND_DIR=../../baotin-b2b-be/backend npm run test:connected
```

QA_BACKEND_DIR tro toi folder backend co package.json, dependencies va
.env.local cua DB test. Script van ho tro workspace cu co backend/ canh
frontend/, nhung backend khong la mot phan cua repo FE.
API/unit tests backend chay trong repo BE, khong co script backend o root FE.
QA preview cu chi dung API_MODE=false. Anh van can backend/media server.
Build voi NEXT_DIST_DIR=.next-build neu dev server dang chay.
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

**Gioi han:** du lieu mock persisted, auth/orders/admin da noi API; chua dong bo
KiotViet, bang gia thuc, stock ledger, credit ledger hay bank payment.
Khong cong bo du lieu seed/secrets. Tai lieu media ghi ro anh minh hoa va
dieu kien xac minh truoc production. Next.js 14 hien co audit high/critical,
can upgrade va regression-test truoc deploy production.

# Cau Truc Code

Cap nhat 05/10/2026: FE va BE la hai repo doc lap, khong co folder shared
hay import source tu repo ben canh. Lenh npm chay tai goc tung repo.

## Frontend

- app/: routes, layouts va global styles cua Next.js.
- components/: UI tai su dung; admin/ va product-detail/ theo man hinh.
- lib/types.ts: models va enums duy nhat cua FE.
- lib/api-types.ts: response va payload types cho API adapters.
- lib/api-client.ts, lib/server-api.ts: browser va server fetch adapters.
- lib/admin-sales.ts, admin-approval.ts, admin-warehouse.ts, admin-accounting.ts:
  validation, projection va preview helpers; khong phai file re-export trung gian.
- lib/order-rules.ts: order guard cho UI/preview; lib/pricing.ts: preview pricing.
- lib/catalog.ts, admin-preview.ts, home-data.ts, lock-catalog.ts: mock va noi dung.
  admin-preview re-export types/guards de giu cac import cu, khong dinh nghia lap.
- scripts/: browser QA; tests/domain.spec.ts: unit tests khong can server/database.

Them UI moi bang component hien co, giu API calls trong adapters/provider.
Khong dua entity NestJS, DB connection, JWT secret hay server authorization vao FE.
Gia va phan quyen hien thi tren browser khong thay the validation cua BE.

## Backend

- src/types/domain.types.ts, api.types.ts: models va read-model types cua BE.
- src/admin/rules/: sales, approval, warehouse, accounting va order guards.
- src/catalog/pricing.ts: seed pricing cua server.
- src/auth/, catalog/, orders/, admin/, account/, media/, contact/: NestJS modules.
- src/database/: entities, DataSource va seed service.
- seed/, media/, scripts/, test/: fixture, anh, dev tools va tests.

Toan bo runtime source o trong src/; TypeScript build ra dist/main.js.
Build/start khong can source FE. Export fixtures la tool development tuy chon,
doc mock hien co qua FRONTEND_DIR va khong ket noi database.
Server phai validate gia, role, ownership, branch va revision moi request.

## Khi Doi API

1. Doi DTO/service va types BE tai module so huu; giu response tuong thich.
2. Doi types/adapter FE theo HTTP contract, khong import file BE vao FE.
3. Chay FE: npm run test:domain, npm run lint, npm run build, npm run typecheck.
4. Chay BE: npm test, npm run build, npm run typecheck.
5. Chay test:api va test:connected chi voi PostgreSQL/API local rieng;
   khong chay cac test ghi/xoa du lieu tren Supabase.

Khong doi ten SKU, fixture hay nghiep vu chi de sap xep folder.
Khi can thay rule UI va rule server, test ca hai ben; BE la nguon quyet dinh
cho thao tac that. Backend-integration.md ghi ro gioi han production hien tai.

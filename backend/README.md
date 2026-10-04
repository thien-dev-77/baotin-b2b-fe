# Bao Tin Backend (Chua Khoi Tao)

Thu muc danh rieng cho backend theo yeu cau quan ly du an.
Hien khong co server, package hay endpoint; khong gia lap API da hoat dong.

Stack du kien: NestJS + TypeScript + TypeORM + Supabase PostgreSQL.
KiotViet tiep tuc la nguon van hanh goc. Auth/Storage can chot khi lap ke hoach.

Truoc khi cai dat:

1. Doc [project.md](../docs/project.md) va [api-handoff.md](../docs/api-handoff.md).
2. Doi chieu UI va mock trong `../frontend/lib/`, provider/component hien co.
3. Chot pham vi MVP, role/branch, pricing/credit/receipt/fulfillment va dong bo.
4. Lap ke hoach schema, DTO/OpenAPI, transaction, idempotency va migration.
5. Tai su dung fixture hien co cho seed development va contract tests.

Khong dung browser storage lam seed, khong tin total/gia/debt/role tu client.
Khong seed production voi du lieu mau, khong luu secrets vao Git.
Chi khoi tao NestJS sau khi UI va hop dong nghiep vu duoc duyet.

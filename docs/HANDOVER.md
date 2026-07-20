# Tài liệu Bàn giao Vận hành (Handover Document)

Tài liệu này dành cho đội ngũ DevOps hoặc IT Admin tiếp quản việc duy trì hệ thống EduConnect.

## 1. Thành phần hệ thống

- **Next.js Web**: Chạy ở port `3000`. Cần Node.js v20+.
- **NestJS API**: Chạy ở port `3001`. Cần Node.js v20+.
- **PostgreSQL**: Port `5432`.
- **Redis**: Port `6379`.

## 2. Biến môi trường (Environment Variables)

Không commit file `.env.production`. Bạn phải tạo thủ công trên Server dựa theo mẫu `.env.production.example`.

- `DATABASE_URL`: Connection string kết nối tới DB. Chú ý đổi mật khẩu thật.
- `JWT_SECRET`: Chuỗi ký tự bí mật để ký JWT. BẮT BUỘC đổi thành random string độ dài trên 32 ký tự.
- `REDIS_URL`: Link kết nối Redis.
- `NEXT_PUBLIC_API_URL`: Domain trỏ về Backend API (VD: `https://api.educonnect.local`).

## 3. Quy trình Triển khai (Deploy)

Dùng Docker Compose là cách tốt nhất:

```bash
docker compose -f docker-compose.production.yml pull
docker compose -f docker-compose.production.yml up -d
```

## 4. Quản lý Migration Database

Nếu có bản cập nhật mới liên quan đến DB, trước khi chạy App mới, phải chạy:

```bash
npx prisma migrate deploy
```

_(Nếu dùng Docker, có thể cho vào script entrypoint hoặc chạy `docker exec -it api_container npx prisma migrate deploy`)_

## 5. Backup & Restore

- **Backup**:
  ```bash
  docker exec -t postgres_container pg_dump -U myuser mydb > backup_$(date +%Y%m%d).sql
  ```
- **Restore**:
  ```bash
  cat backup_file.sql | docker exec -i postgres_container psql -U myuser -d mydb
  ```
- Lên lịch chạy Backup hàng ngày lúc 2h sáng bằng `crontab`.

## 6. Monitoring (Giám sát)

- Endpoint Healthcheck có sẵn ở: `/api/health`. Trả về `200 OK` kèm status của DB và Redis. Có thể cấu hình UptimeRobot hoặc Prometheus/Grafana móc vào đường dẫn này.
- Docker logs: `docker compose logs -f api` để xem lỗi realtime.

## 7. Xử lý sự cố (Troubleshooting)

- **Quên mật khẩu Admin**: Vào DB (DBeaver), dùng Bcrypt generator tạo mã hash mới của `Password@123` và đè vào trường `passwordHash` của `admin@school.local`.
- **Server sập vì kẹt RAM**: Check log Redis xem có bị tràn dữ liệu không. Check logs Docker xem memory limit có quá thấp không.
- **Rollback Code**:
  Kéo (Pull) image hoặc checkout nhánh của commit trước đó. Khởi động lại Docker. Tuy nhiên nếu có Database Migration đi kèm, hãy tham khảo `MIGRATION_HISTORY.md` để biết cách lùi DB.

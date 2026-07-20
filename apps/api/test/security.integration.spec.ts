import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Security & Production Controls (Integration)', () => {
  let app: INestApplication;

  const allowedOrigin = 'https://educonnect.example.com';

  const rateLimitIp = '198.51.100.10';
  const missingEmailIp = '198.51.100.11';
  const missingPasswordIp = '198.51.100.12';

  beforeAll(async () => {
    process.env.NODE_ENV = 'production';
    process.env.JWT_ACCESS_SECRET = 'random-access-secret-for-integration-test-32-chars-long';
    process.env.JWT_REFRESH_SECRET = 'random-refresh-secret-for-integration-test-32-chars-long';
    process.env.CORS_ORIGIN = allowedOrigin;

    if (!process.env.TEST_DATABASE_URL) {
      throw new Error('TEST_DATABASE_URL is required for security integration tests');
    }

    process.env.DATABASE_URL = process.env.TEST_DATABASE_URL;

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    /*
     * Cho phép Express đọc X-Forwarded-For.
     * Chỉ dùng trong integration test để tách bộ đếm rate limit
     * giữa các trường hợp kiểm thử.
     */
    app.getHttpAdapter().getInstance().set('trust proxy', 1);

    app.setGlobalPrefix('api');

    app.enableCors({
      origin: (origin, callback) => {
        const isAllowed = !origin || origin === allowedOrigin;

        callback(null, isAllowed);
      },
      credentials: true,
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('CORS bị từ chối với origin lạ', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/health')
      .set('Origin', 'http://malicious-origin.com');

    expect(response.status).toBe(200);
    expect(response.headers['access-control-allow-origin']).toBeUndefined();
  });

  it('CORS được chấp nhận với origin hợp lệ', async () => {
    const response = await request(app.getHttpServer())
      .get('/api/health')
      .set('Origin', allowedOrigin);

    expect(response.status).toBe(200);

    expect(response.headers['access-control-allow-origin']).toBe(allowedOrigin);

    expect(response.headers['access-control-allow-credentials']).toBe('true');
  });

  it('Login thiếu email trả về 400 thay vì 500', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('X-Forwarded-For', missingEmailIp)
      .send({
        password: 'Password@123',
      });

    expect(response.status).toBe(400);
    expect(response.status).not.toBe(500);
  });

  it('Login thiếu mật khẩu trả về 400 thay vì 500', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('X-Forwarded-For', missingPasswordIp)
      .send({
        email: 'test@example.com',
      });

    expect(response.status).toBe(400);
    expect(response.status).not.toBe(500);
  });

  it('Rate limit login trả về 429 sau khi vượt giới hạn', async () => {
    const credentials = {
      email: `rate-limit-${Date.now()}@example.com`,
      password: 'Password@123',
    };

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .set('X-Forwarded-For', rateLimitIp)
        .send(credentials);

      expect(response.status).toBe(401);
      expect(response.status).not.toBe(429);
      expect(response.status).not.toBe(500);
    }

    const blockedResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .set('X-Forwarded-For', rateLimitIp)
      .send(credentials);

    expect(blockedResponse.status).toBe(429);
  });

  it('Health readiness trả về trạng thái sẵn sàng', async () => {
    const response = await request(app.getHttpServer()).get('/api/health/ready');

    expect(response.status).toBe(200);
  });
});

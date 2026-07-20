import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // error rate < 1%
    http_req_duration: ['p(95)<1000'], // authenticated GET p95 < 1s
  },
};

const BASE_URL = __ENV.API_URL || 'http://host.docker.internal:4000/api';

export function setup() {
  // Obtain cookie/token during setup
  const loginPayload = JSON.stringify({
    email: 'admin@school.local',
    password: 'Password@123',
  });
  const res = http.post(`${BASE_URL}/auth/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });
  const cookies = res.headers['Set-Cookie'];
  return { cookies };
}

export default function (data) {
  const params = {
    headers: {
      Cookie: data.cookies,
    },
  };

  // 1. Dashboard summary
  const res1 = http.get(`${BASE_URL}/dashboard/admin/summary`, params);
  check(res1, { 'dashboard status 200': (r) => r.status === 200 });

  // 2. Announcements
  const res2 = http.get(`${BASE_URL}/announcements`, params);
  check(res2, { 'announcements status 200': (r) => r.status === 200 });

  // 3. Service Request Categories
  const res3 = http.get(`${BASE_URL}/service-request-categories`, params);
  check(res3, { 'categories status 200': (r) => r.status === 200 });

  sleep(1);
}

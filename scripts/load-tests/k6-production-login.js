import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 5 },
    { duration: '1m', target: 5 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_failed: ['rate<0.01'], // error rate < 1%
    http_req_duration: ['p(95)<5000'], // login p95 < 5s
  },
};

const BASE_URL = __ENV.API_URL || 'http://host.docker.internal:4000/api';

export default function () {
  const loginPayload = JSON.stringify({
    email: 'admin@school.local',
    password: 'Password@123',
  });

  const headers = { 'Content-Type': 'application/json' };
  const res = http.post(`${BASE_URL}/auth/login`, loginPayload, { headers });

  check(res, {
    'login status is 200': (r) => r.status === 200,
  });

  sleep(1);
}

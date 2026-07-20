import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Ramp up to 20 users
    { duration: '1m', target: 20 }, // Stay at 20 users
    { duration: '30s', target: 0 }, // Ramp down to 0 users
  ],
};

const BASE_URL = 'http://host.docker.internal:4000/api'; // Or your API url

export default function () {
  // 1. Login
  const loginPayload = JSON.stringify({
    email: 'admin@school.local',
    password: 'Password@123',
  });

  const headers = { 'Content-Type': 'application/json' };

  let res = http.post(`${BASE_URL}/auth/login`, loginPayload, { headers });

  check(res, {
    'login status is 200': (r) => r.status === 200 || r.status === 201,
  });

  let token = '';
  if (res.status === 200 || res.status === 201) {
    const body = JSON.parse(res.body);
    token = body.accessToken; // Assuming response has accessToken
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  sleep(1);

  // 2. Lấy announcements
  if (token) {
    res = http.get(`${BASE_URL}/announcements`, { headers: authHeaders });
    check(res, {
      'get announcements status is 200': (r) => r.status === 200,
    });
  }

  sleep(1);

  // 3. Nộp bài thi
  if (token) {
    const examId = 'exam_123'; // Replace with real ID if available
    const attemptId = 'attempt_123'; // Replace with real ID if available
    const submitPayload = JSON.stringify({
      answers: [{ questionId: 'q1', selectedOptionIds: ['opt1'] }],
    });

    // Starting an attempt might be needed before submitting
    res = http.post(`${BASE_URL}/exams/${examId}/submit`, submitPayload, { headers: authHeaders });

    // Optional check as the ID is fake
    // check(res, {
    //  'submit exam status is 200 or 201': (r) => r.status === 200 || r.status === 201,
    // });
  }

  sleep(1);
}

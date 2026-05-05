import http from 'k6/http';
import { check } from 'k6';

export let options = {
  vus: 10,          // jumlah user virtual
  duration: '10s',  // durasi test
};

export default function () {
  const url = 'https://cbi-api.suitdev.com/v2/auth/check_existing_email_phone';

  const payload = JSON.stringify({
    email: 'qazz@yopmail.com',
    phone: '62812451362',
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = http.post(url, payload, params);

  check(res, {
    'status is 200': (r) => r.status === 200,
  });
}
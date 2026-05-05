import http from 'k6/http';
import { check } from 'k6';

const randomEmail = `test${Math.random()}@mail.com`;
const randomPhone = `62812${Math.floor(Math.random()*10000000)}`;

export let options = {
  vus: 10,          // jumlah user virtual
  duration: '10s',  // durasi test
};

export default function () {
  const url = 'https://cbi-api.suitdev.com/v2/auth/check_existing_email_phone';

  const payload = JSON.stringify({
    email: randomEmail,
    phone: randomPhone,
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

import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 10,
  duration: '1m',
};

const BASE_URL = 'https://h-naga-mobile-api.cbi.id';

const headers = {
  Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImRlMWZmZmRkLTgzM2QtNGFkMS05MmIyLWI5MGJiYzkzN2RjZCIsImVtYWlsIjoibWp5QHlvcG1haWwuY29tIiwibGFzdF9sb2dpbl90aW1lIjoiMjAyNi0wNS0wN1QwNjo1OTowOC40NjhaIiwiaWF0IjoxNzc4MTM3MTQ4LCJleHAiOjE3NzgyMjM1NDh9.OrRinoTzaMVRp_71gZKIVtECagoi5s29WSj4Qh9e3NE',
  'Content-Type': 'application/json',
  'accept': 'application/json',
  'User-Agent': 'Skorku/1.0',
};

export default function () {

  // trigger generate
  const generateRes = http.post(
    `${BASE_URL}/product/credit_report_comprehensive`,
    JSON.stringify({
      id_user : "de1fffdd-833d-4ad1-92b2-b90bbc937dcd"
    }),
    { headers }
  );

  check(generateRes, {
    'generate triggered': (r) => r.status === 200,
  });

  let completed = false;

  // polling max 30 detik
  for (let i = 0; i < 15; i++) {

    const historyRes = http.get(
      `${BASE_URL}/report/comprehensive/history/latest`,
      { headers }
    );

    console.log('HISTORY STATUS:', historyRes.status);
    console.log('HISTORY BODY:', historyRes.body);

    const body = historyRes.json();

    const status = body.data.sts_report;

    console.log(`report status = ${status}`);

    if (status === 2) {
      completed = true;
      break;
    }

    sleep(2);
  }

  check(null, {
    'report completed': () => completed,
  });

  sleep(1);
}
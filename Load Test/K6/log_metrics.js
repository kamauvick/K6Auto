import http from 'k6/http';
import { Trend, Counter, Rate } from 'k6/metrics';

const myTrend = new Trend('waiting_time');
const myCounter = new Counter('my_counter');
const myRate = new Rate('my_rate')

export default function () {
  const r = http.get('https://httpbin.org');
  myTrend.add(r.timings.waiting);

  myRate.add(r.timings.waiting)
  myRate.add(r.timings.connecting)
  myCounter.add(1);
  myCounter.add(2);
  console.log(myTrend.name, myRate.name); // waiting_time
}

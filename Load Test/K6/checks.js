import http from "k6/http";
import { check } from "k6";
import { Counter, Trend, Rate } from "k6/metrics";

const URL  = "http://test.k6.io/";
let myRate = new Rate("my_rate")
let myTrend = new Trend("my_trend")

export default function(){
    const response = http.get(URL);
    myRate.add(response.status)
    myTrend.add(response.timings.sending + response.timings.waiting + response.timings.receiving)

    check ( 
        response,
        {
            'is status 200': (r) => r.status === 200,
            'response body returned': (r) => r.body.includes('Collection of simple'),
            'Response body is greater' : (r) => r.body.length > 300,
        }
    );
}
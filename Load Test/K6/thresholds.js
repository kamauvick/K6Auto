import http from "k6/http";

const URL  = "https://test-api.k6.io/public/crocodiles/1/";

export const options = {
    thresholds : {
        http_req_failed : ['rate<0.01'],
        http_req_duration : ['p(95)<300']
    },
};

export default function(){
     http.get(URL);

}
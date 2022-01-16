import http from "k6/http";
import { Counter, Rate } from "k6/metrics";
import { check, group, sleep } from "k6";


const BASE_URLS = {
    STAGING : "https://erp.staging.kyosk.dev/agent-pwa/#/",
    QA : "https://qa.staging.kyosk.dev/agent-pwa/#/",
    UAT : "https://uat.kyosk.dev/agent-pwa/#/",
}

const URLS = {
    STAGING_URLS  : {
        home : `${BASE_URLS.STAGING}home`,
        create_duka : `${BASE_URLS.STAGING}kiosks/duka/new`,
        catalog : `${BASE_URLS.STAGING}catalog`,
        order_history : `${BASE_URLS.STAGING}orders`,
        duka_list : `${BASE_URLS.STAGING}kiosks`,
    },
    QA_URLS : {
        home : `${BASE_URLS.QA}home`,
        create_duka : `${BASE_URLS.QA}kiosks/duka/new`,
        catalog : `${BASE_URLS.QA}catalog`,
        order_history : `${BASE_URLS.QA}orders`,
        duka_list : `${BASE_URLS.QA}kiosks`,
    },
    UAT_URLS : {
        home : `${BASE_URLS.UAT}home`,
        create_duka : `${BASE_URLS.UAT}kiosks/duka/new`,
        catalog : `${BASE_URLS.UAT}catalog`,
        order_history : `${BASE_URLS.UAT}orders`,
        duka_list : `${BASE_URLS.UAT}kiosks`,
    }
}

export const options = {
    max_vus : 20,
    vus : 20,

    stages : [
        {duration : '30s', target : 10},
        {duration: '4s', target: 20},
        {duration: '30s', target: 0},
    ],

    threshold : {
        http_req_failed : ['rate<0.01'],
        http_req_duration : ['p(95)<300'],
    },
};

export default function (){
    group('Agent Web App', function (){

        group('Home heartbeat:', function() {
            let res = http.get(URLS.QA_URLS.home);
            check(res, { "status is 200": (r) => r.status === 200 });
            check(res, {'Response time was:': (r) => r.timings.duration})
          });

        group('Create duka:', function(){
            let payload = {
                //test code
            };

            const params = {
                headers: {
                  'Content-Type': 'application/json',
                },
              };

            let res = http.post(URLS.QA_URLS.create_duka, payload, params)
            check(res, {'status code is 201: ': (r) => r.status === 201});
            sleep(3);

        });
        
        group('Catalog items:', function (){
            let res = http.get(URLS.QA_URLS.catalog);
            check(res, {
                "status is 200: ": (r) => r.status === 200,
                "length > 0 :" : (r) => r.body.length > 1, 
                "page contains test Zesta:" :  (r) => r.body.includes('Zesta')},
            ) 
        });

        group('Order history: ', function(){
            let res = http.get(URLS.QA_URLS.order_history)
            check(res, {
                "status is 200: ": (r) => r.status === 200,
                "length > 0 :" : (r) => r.body.length > 1, 
                "page contains text Jkuat:" :  (r) => r.body.includes('Jkuat')},
            ) 
        });

        group('Duka list: ', function(){
            let res = http.get(URLS.QA_URLS.duka_list)
            check(res, {
                "status is 200: ": (r) => r.status === 200,
                "length > 0 :" : (r) => r.body.length > 1, 
                "page contains text Jkuat:" :  (r) => r.body.includes('Jkuat')},
            ) 
        });
    }
)
};


let islocalhost = true;
let serverurl = islocalhost?'http://localhost:12004':'http://yunqi.com28.cn:12004';
export default {
    restserverurl:serverurl +'/adminapi',
    serverurl:serverurl
};

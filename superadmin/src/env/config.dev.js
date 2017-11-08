let islocalhost = true;
let serverurl = islocalhost?'http://localhost:5011':'http://bms.com28.cn';
export default {
    restserverurl:serverurl +'/adminapi',
    serverurl:serverurl
};

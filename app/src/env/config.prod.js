let islocalhost = false;
const serverurl = islocalhost?'http://localhost:5011':'http://bms.com28.cn';
const serverurlrestful = islocalhost?`${serverurl}/api`:`${serverurl}/apisrv/api`;
const wspath = islocalhost?'/socket.io':'/apisrv/socket.io';
const organizationid = '599af5dc5f943819f10509e6';
let config = {
    serverurlrestful,
    serverurl:`${serverurl}`,
    wspath:`${wspath}`,
    requesttimeout:5000,
    appversion:'1.1.5',
    sendlocationinterval:20000,
    softmode:'app'
};


export default config;

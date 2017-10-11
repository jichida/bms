let localhost = true;
let config = {
    serverurl:localhost?'http://localhost:5011':'http://bms.com28.cn',
    requesttimeout:5000,
    appversion:'1.0.0',
    sendlocationinterval:20000,
    softmode:'app'
};

export default config;

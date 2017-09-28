let localhost = true;
let config = {
    serverurl:localhost?'http://localhost:12004':'http://yunqi.com28.cn:12004',
    requesttimeout:5000,
    appversion:'1.0.0',
    sendlocationinterval:20000,
    softmode:'app'
};

export default config;

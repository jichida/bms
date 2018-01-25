let islocalhost = true;
let serverurl = islocalhost?'http://localhost:5011':'http://101.89.141.109:81/apisrv';
const organizationid = '599af5dc5f943819f10509e6';
export default {
    restserverurl:`${serverurl}/adminapi/v1/${organizationid}`,
    adminauthserverurl:`${serverurl}/adminauth/v1/${organizationid}`,
    admincustomapi:`${serverurl}/admincustomapi/v1/${organizationid}`,
    serverurl:`${serverurl}`,
    appversion:'1.2.5'
};

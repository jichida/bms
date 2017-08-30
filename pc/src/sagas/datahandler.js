import {
    common_err,

    loginwithtoken_request,
    login_request,
    md_login_result,//这个result特殊，需要判断是否登录

    logout_request,
    logout_result,

    getsystemconfig_request,
    getsystemconfig_result,

    getnotifymessage_request,
    getnotifymessage_result,

    getnotifymessageone_request,
    getnotifymessageone_result,

    querydevicegroup_request,
    querydevicegroup_result,

    querydevice_request,
    querydevice_result,

    querydeviceinfo_request,
    md_querydeviceinfo_result,
    querydeviceinfo_result,

    queryrealtimealarm_request,
    queryrealtimealarm_result,

    queryhistorytrack_request,
    queryhistorytrack_result,

    searchbattery_request,
    searchbattery_result,

  } from '../actions';


//接收的对应关系
let recvmessagetoresultpair = {
  'getnotifymessage_result':getnotifymessage_result,
  'getnotifymessageone_result':getnotifymessageone_result,

  'getsystemconfig_result':getsystemconfig_result,

  'common_err':common_err,

  'login_result':md_login_result,
  'logout_result':logout_result,
  'querydevicegroup_result':querydevicegroup_result,
  'querydevice_result':querydevice_result,
  'querydeviceinfo_result':md_querydeviceinfo_result,
  'queryrealtimealarm_result':queryrealtimealarm_result,
  'queryhistorytrack_result':queryhistorytrack_result,
  'searchbattery_result':searchbattery_result,
};

//非验证发送接口
let sendmessagefnsz = {
  'logout':`${logout_request}`,
  'loginwithtoken':`${loginwithtoken_request}`,
  'login':`${login_request}`,

  'getsystemconfig':`${getsystemconfig_request}`,
  'getnotifymessage':`${getnotifymessage_request}`,
  'getnotifymessageone':`${getnotifymessageone_request}`,

};

//验证发送接口
let sendmessageauthfnsz = {
  'querydevicegroup':`${querydevicegroup_request}`,
  'searchbattery':`${searchbattery_request}`,
  'querydevice':`${querydevice_request}`,
  'querydeviceinfo':`${querydeviceinfo_request}`,
  'queryrealtimealarm':`${queryrealtimealarm_request}`,
  'queryhistorytrack':`${queryhistorytrack_request}`,

};

export default {recvmessagetoresultpair,sendmessagefnsz,sendmessageauthfnsz};

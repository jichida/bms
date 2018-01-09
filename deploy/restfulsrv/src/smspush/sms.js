const request = require('request');

let sendsms= (tel,smstext,callbackfn)=> {
    const baseUrl = 'http://sms.1xinxi.cn/asmx/smsservice.aspx?';
    const params = {
        'name': '18620108862', //必填参数。用户账号
        'pwd': 'B179FF6914482FDD2F123478720C', //必填参数。（web平台：基本资料中的接口密码）
        'content': smstext, //必填参数。发送内容（1-500 个汉字）UTF-8编码
        'mobile': tel, //必填参数。手机号码。多个以英文逗号隔开
        'stime': '', //可选参数。发送时间，填写时已填写的时间发送，不填时为当前时间发送
        'sign': '水盒子', //必填参数。用户签名。
        'type': 'pt', //必填参数。固定值 pt
        'extno': '' //可选参数，扩展码，用户定义扩展码，只能为数字
    }
    request.post({
        url: baseUrl,
        form: params
    }, (err, resp, body)=> {
         let result = body.split(',');
         if (result[0] !== '0') {
            let error = new Error(result[1]);
            error.status = parseInt(result[0], 10);
            error.raw = body;
            callbackfn(error,null);
          }
          else{
            callbackfn(null,true);
          }
    });
};


let sendsmstouser = (tel,reason,authcode,callbackfn)=>{
    const textobj = {
        'register':`您正在注册水盒子账号，验证码是：${authcode}，请勿告诉他人！`,
        'findpwd':`您正在找回密码，验证码是：${authcode}，请勿泄漏。`,
        'withdraw':`您正在申请提现，验证码是：${authcode}，请勿泄漏。`,
        'binduser':`您正在绑定用户，验证码是：${authcode}，请勿泄漏。`
    }

    if(!!textobj[reason]){
      // callbackfn(null,{result:true,msg:textobj[reason]});
      // return;
      sendsms(tel,textobj[reason],(err,result)=>{
        if(!err){
          callbackfn(err,{result,msg:'验证码发送成功'});
        }
        else{
          callbackfn(error,null);
        }
      });
    }
    else{
      let error = new Error('请发送验证短信原因');
      callbackfn(error,null);
    }
}

exports.sendsmstouser = sendsmstouser;

// sendsmstouser('15961125167','register','3456',(err,result)=>{
//     //console.log(`err=====>${JSON.stringify(err)}`);
//     //console.log(`result=====>${JSON.stringify(result)}`);
// });

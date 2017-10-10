const systemconfig = require('../common/systemconfig');


//司机端
const actiondatahandler = {
  'getsystemconfig':systemconfig.getsystemconfig,
};

const authhandler = {

};

module.exports = (socket,actiondata,ctx)=>{
  console.log("app端获取数据--->" + JSON.stringify(actiondata));
  console.log("app端获取上下文--->" + JSON.stringify(ctx));
  try{
      if(ctx.usertype !== 'app'){
        console.log("不是正确的客户端--->" + actiondata.cmd);
        socket.emit('common_err',{errmsg:'无效的app客户端'});
        return;
      }
      if(!!actiondatahandler[actiondata.cmd]){
        actiondatahandler[actiondata.cmd](actiondata.data,ctx,(result)=>{
          console.log("服务端回复--->" + JSON.stringify(result));
          socket.emit(result.cmd,result.payload);
        });
      }
      else{
        if(!authhandler[actiondata.cmd]){
          if(!ctx['userid']){
            console.log("需要登录--->" + actiondata.cmd);
            socket.emit('common_err',{errmsg:'请先重新登录'});
          }
          else{
            authhandler[actiondata.cmd](actiondata.data,ctx,(result)=>{
              console.log("服务端回复--->" + JSON.stringify(result));
              socket.emit(result.cmd,result.payload);
            });
          }
        }
        else{
          console.log("未找到处理函数--->" + actiondata.cmd);
          socket.emit('common_err',{errmsg:`未找到处理函数${actiondata.cmd}`});
        }
      }
    }
    catch(e){
      console.log("服务端内部错误--->" + e);
      socket.emit('common_err',{errmsg:`服务端内部错误:${JSON.stringify(e)}`});
    }
}

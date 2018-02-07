// const dbhandler = require('./dbhandler.js');

// const topichandler = {
//   'BMS.Data':dbhandler.logdata,
//   'log.bms':dbhandler.logbms,
// };
//
// module.exports = (msg,cb)=>{
//   try{
//     if(!!topichandler[msg.topic]){
//       let payload = msg.value;
//       if(typeof payload === 'string'){
//         try{
//           payload = JSON.parse(payload);
//         }
//         catch(e){
//           console.log(`parse json eror ${JSON.stringify(e)}`);
//         }
//       }
//       topichandler[msg.topic](payload,(err,result)=>{
//         // console.log("服务端回复--->" + JSON.stringify(result));
//         if(!!cb){
//           cb(err,result);
//         }
//       });
//     }
//   }
//   catch(e){
//     console.log("服务端内部错误--->" + e);
//   }
// }
let nbms = 0;
module.exports = (msg,cb)=>{
  let payload = msg.value;
  if(typeof payload === 'string'){
    try{
      payload = JSON.parse(payload);
    }
    catch(e){
      console.log(`parse json eror ${JSON.stringify(e)}`);
    }
  }
  nbms++;
  console.log(`SN64:${payload.SN64},DeviceId:${payload.DeviceId},nbms:${nbms}`);
}

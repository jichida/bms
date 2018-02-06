const config = require('../config.js');
const sendtokafka = require('../kafka/sendtokafka');

//接受BMS.data=>原样广播成bms.index

const kafka_maintopic = (data,callback)=>{
  console.log(`kafka_maintopic,${config.NodeID}】接收成功${data.SN64},${data.DeviceId}`);

  const sendto = sendtokafka.getsendtokafka();
  if(!!sendto){
    sendto(data,config.kafka_dbtopic_index,(err,data)=>{
      if(!!err){
        console.log(`kafka_dbtopic_index:${JSON.stringify(data)}`);
        console.log(err);
      }
    });
  }
};


module.exports = kafka_maintopic;

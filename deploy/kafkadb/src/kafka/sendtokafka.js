const pushalarmproducer = require('../kafka/produceralarmpush');
let sendtokafka;

pushalarmproducer((fn)=>{
  sendtokafka = fn;
});

exports.getsendtokafka = ()=>{
  return sendtokafka;
}

const pushalarmproducer = require('../kafka/kp');
let sendtokafka;

pushalarmproducer((fn)=>{
  sendtokafka = fn;
});

exports.getsendtokafka = ()=>{
  return sendtokafka;
}

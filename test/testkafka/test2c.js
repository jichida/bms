const getConsumer = require('./rkafka/c.js');
const globalconfig = {
    'group.id': 'kafkagrouptest',
    'metadata.broker.list': '192.168.1.20:9092,192.168.1.114:9092,192.168.1.136:9092',
    'client.id':'c1',
    'partition.assignment.strategy':'roundrobin',
    'enable.auto.commit': false
};
const cconfig = {
  'auto.offset.reset':'smallest'
};
let counter = 0;
const numMessages = 10;
getConsumer(globalconfig,cconfig,['bms.index2'],
(m,consumer)=> {
  // console.log(`get data====>${JSON.stringify(m)}`);
  const value = m.value.toString();
  let jsondata;
  try{
    jsondata = JSON.parse(value);
  }
  catch(e){

  }
  console.log(`partition:${m.partition},offset:${m.offset},value:${jsondata.SN64}`);
  if (counter % numMessages === 0) {
    console.log(`${counter}calling commit>>>>>>>>>>>>`);
    consumer.commit(m);
  }
},
(err,consumer)=> {
  console.error(`Consumer${process.pid} ---uncaughtException err`);
  console.error(err);
  console.error(err.stack);
  console.error(`uncaughtException err---`);
  consumer.disconnect();
  throw err;
}).then((consumer)=>{
   process.on('SIGINT', () => {
      consumer.disconnect();
    });
});

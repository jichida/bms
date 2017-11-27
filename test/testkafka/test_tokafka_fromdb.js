const kafka = require('kafka-node');
const Producer = kafka.Producer;
const KeyedMessage = kafka.KeyedMessage;
const Client = kafka.Client;
const client = new Client(process.env.KAFKA_HOST ||'118.31.41.232:2181');
// const argv = require('optimist').argv;
const _ = require('lodash');
const producer = new Producer(client, { requireAcks: 1 });
// const moment = require('moment');
const mongodburl = process.env.MONGO_URL || 'mongodb://localhost/bms';
const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;

const sendtokafka = (payload,callbackfn)=>{
  const payloads = [
      { topic: 'BMS.Data', messages: JSON.stringify(payload) },
  ];
  producer.send(payloads, (err, data)=> {
    if(!!callbackfn){
      callbackfn(err,data);
    }
  });
}

//连接数据库
mongoose.Promise = global.Promise;
mongoose.connect(mongodburl,{
    useMongoClient: true,
    // This options is 1 second by default, its possible the ha
    // takes longer than 30 seconds to recover.
    reconnectInterval: 5000,
    // This options is 30 by default, why not make it 60
    reconnectTries: Number.MAX_VALUE
  });

  //设备
  let DeviceSchema = new Schema({
  }, { strict: false });
  // DeviceSchema.plugin(mongoosePaginate);
  let DeviceModel =mongoose.model('device',  DeviceSchema);


// let rate = 2000;
producer.on('ready',  ()=> {
  console.log(`kafka producer get ready!!`);
  producer.createTopics(['BMS.Data'],true,(err)=>{
    console.log(`==>createTopics err:${JSON.stringify(err)}`);

    const dbModel =  DeviceModel;
    dbModel.find({},(err,result)=>{
      if(!err){
        let list = JSON.parse(JSON.stringify(result));
        _.map(list,(data)=>{

          // const LastRealtimeAlarm = _.clone(data.BMSData);
          // const LastHistoryTrack = _.clone(data.Position);
          // const devicedata = _.omit(data,['BMSData','Position']);
          let datav = _.clone(data);
          console.log(`datav==>${JSON.stringify(datav)}`);

          const BMSData = _.clone(datav.LastRealtimeAlarm);
          console.log(`BMSData==>${JSON.stringify(BMSData)}`);

          const Position  = _.clone(datav.LastHistoryTrack);
          console.log(`Position==>${JSON.stringify(Position)}`);

          let devicedata = _.omit(datav,['LastRealtimeAlarm','LastHistoryTrack','_id','__v']);
          console.log(`devicedata==>${JSON.stringify(devicedata)}`);

          if(!!BMSData){
            devicedata.BMSData = BMSData;
            console.log(`devicedata BMSData==>${JSON.stringify(devicedata)}`);
          }

          if(!!Position){
            devicedata.Position = Position;
            console.log(`devicedata Position==>${JSON.stringify(devicedata)}`);
          }

          console.log(`devicedata==>${JSON.stringify(devicedata)}`);
          sendtokafka(devicedata,(err,result)=>{
            console.log(`==>err:${JSON.stringify(err)}`);
            console.log(`==>result:${JSON.stringify(result)}`);
          });
        });
      }
    });
  });

});

producer.on('error',  (err)=> {
  console.log('error', err);
});

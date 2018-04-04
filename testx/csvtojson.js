'use strict';
const csvFilePath='./1602010036.csv';
const csv=require('csvtojson');
const mongodburl = process.env.MONGO_URL || 'mongodb://localhost/bms';
const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const moment = require('moment');

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

//设备轨迹
const HistoryTrackSchema = new Schema({
}, { strict: false });
const HistoryTrackModel =mongoose.model('historytrack',  HistoryTrackSchema);

const timedifferday = moment().diff(moment('2017-10-15 00:05:49.000'),'days');
console.log(`当前时间比例子时间多${timedifferday}天`);
const dbHistoryTrackModel =  HistoryTrackModel;

console.log(`开始删除数据:1602010036`);
dbHistoryTrackModel.remove({"DeviceId":'1602010036'},(err,result)=>{
  console.log(`已经删除数据`);
  csv()
  .fromFile(csvFilePath)
  .on('json',(jsonObj)=>{
  	// combine csv header row and csv line to a json object
  	// jsonObj.a ==> 1 or 4
    //DeviceId,GPSStatus,Longitude,Latitude,Speed,Course,CommunicationTime
  	console.log(`jsonObj==>${JSON.stringify(jsonObj)}`);
    let momentGPSTime = moment(jsonObj.CommunicationTime).add(timedifferday-2,'days');
    const LastHistoryTrack = {
         "GPSTime" : momentGPSTime.format("YYYY-MM-DD HH:mm:ss"),
         "Longitude" :parseFloat(jsonObj.Longitude),
         "Latitude" : parseFloat(jsonObj.Latitude),
         "DeviceId" : jsonObj.DeviceId,
    };
    if(!!LastHistoryTrack){
      const entity = new dbHistoryTrackModel(LastHistoryTrack);
      entity.save((err,result)=>{
        console.log(`LastHistoryTrack error:${JSON.stringify(err)}`);
      });
    }


  })
  .on('done',(error)=>{
  	console.log('end')
  })
});

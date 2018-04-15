'use strict';
const _ = require('lodash');
const csvFilePath='./devicepack.csv';
const csv = require('csvtojson');
const mongodburl = process.env.MONGO_URL || 'mongodb://192.168.2.17:27007,192.168.2.18:27007/bmscatl';
const mongosstring = process.env.mongos || 'true';
const mongos = mongosstring==='true'?true:false;

const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const moment = require('moment');

//连接数据库
mongoose.Promise = global.Promise;
mongoose.connect(mongodburl,{
    mongos,

    useMongoClient: true,
    // This options is 1 second by default, its possible the ha
    // takes longer than 30 seconds to recover.
    reconnectInterval: 5000,
    // This options is 30 by default, why not make it 60
    reconnectTries: Number.MAX_VALUE
  });

//设备
//设备
const DeviceSchema = new Schema({
}, { strict: false });
const DeviceModel =mongoose.model('device',  DeviceSchema);

csv()
  .fromFile(csvFilePath)
  .on('json',(jsonObj)=>{
  	// combine csv header row and csv line to a json object
  	// jsonObj.a ==> 1 or 4
    //DeviceId,GPSStatus,Longitude,Latitude,Speed,Course,CommunicationTime
  	// console.log(`jsonObj==>${JSON.stringify(jsonObj)}`);
    let omitfields = [];
    _.map(jsonObj,(v,k)=>{
      if(v === 'NULL'){
        omitfields.push(k);
      }
    });

    // console.log(`omitfields==>${JSON.stringify(omitfields)}`);
    let DeviceObj = _.omit(jsonObj,omitfields);
    // console.log(`DeviceObj==>${JSON.stringify(DeviceObj)}`);
    const dbModel = DeviceModel;
    dbModel.findOneAndUpdate({
        DeviceId:DeviceObj.DeviceId,
     },{$set:DeviceObj},{upsert:true,new:true}).lean().exec((err,result)=>{
       console.log(`result-->${JSON.stringify(result)}`)
     });

  })
  .on('done',(error)=>{
  	console.log('end')
  })

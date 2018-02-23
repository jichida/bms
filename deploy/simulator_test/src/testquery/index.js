const DBModels = require('../db/models.js');
const mongoose     = require('mongoose');
const moment = require('moment');
const _ = require('lodash');
const schmodel = {
  urlname:'/historydevice',
  schema:DBModels.HistoryDeviceSchema,
  collectionname:'historydevice',
};

const do_test_query_paginate = ()=>{
  const organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
  const dbModel = mongoose.model(schmodel.collectionname, schmodel.schema);
  let query = {};
  query['organizationid'] = organizationid;

  const options = {"sort":{"SN64":-1},"page":1,"limit":100};
  const querynew = query;
  console.log(`do_test_query_paginate1==>[${schmodel.collectionname}]query start==>${JSON.stringify(querynew)}--->\n \
  optionst==>${JSON.stringify(options)}\n-->${moment().format('HH:mm:ss')}`);
  dbModel.paginate(querynew, options,(err,result)=>{
    console.log(`do_test_query_paginate1==>[${schmodel.collectionname}]query end--->${moment().format('HH:mm:ss')}`);
  });
  console.log(`do_test_query_paginate2==>[${schmodel.collectionname}]query start==>${JSON.stringify(querynew)}--->\n \
  optionst==>${JSON.stringify(options)}\n-->${moment().format('HH:mm:ss')}`);
  dbModel.paginate({}, options,(err,result)=>{
    console.log(`do_test_query_paginate2==>[${schmodel.collectionname}]query end--->${moment().format('HH:mm:ss')}`);
  });
};

const do_test_query_skip = ()=>{
  const organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
  const dbModel = mongoose.model(schmodel.collectionname, schmodel.schema);
  let query = {};
  query['organizationid'] = organizationid;

  const options = {"sort":{"SN64":-1},"page":1,"limit":100};
  const querynew = query;
  console.log(`[do_test_query_skip==>${schmodel.collectionname}]query start==>${JSON.stringify(querynew)}--->\n \
  optionst==>${JSON.stringify(options)}\n-->${moment().format('HH:mm:ss')}`);
  const queryexec = dbModel.find(querynew).select().limit(100).skip(0);
  queryexec.exec((err,list)=>{
     console.log(`[do_test_query_skip==>${schmodel.collectionname}]query end--->${moment().format('HH:mm:ss')}`);
  });
  console.log(`[do_test_query_skip1] start getcount==>`);
  dbModel.count(querynew,(err, list)=> {
      console.log(`[do_test_query_skip1==>${schmodel.collectionname}],COUNT:${list},query end--->${moment().format('HH:mm:ss')}`);
  });
  console.log(`[do_test_query_skip2] start getcount==>`);
  dbModel.count({},(err, list)=> {
      console.log(`[do_test_query_skip2==>${schmodel.collectionname}],COUNT:${list},query end--->${moment().format('HH:mm:ss')}`);
  });
};

const dbh_alarm =(datas,callbackfn)=>{
  const dbModel = DBModels.RealtimeAlarmModel;
  const bulk = dbModel.collection.initializeOrderedBulkOp();
  _.map(datas,(devicedata)=>{
    console.log(`5dbh_alarm==>${JSON.stringify(devicedata)}`);
    const AlarmKey = `${devicedata.DeviceId}_${devicedata.CurDay}`;
    bulk.find({
    		AlarmKey,
    	})
      .upsert()
      .updateOne(devicedata);
  });
  bulk.execute((err,result)=>{
    callbackfn(err,result);
  });
};

const do_test_insert_alarm = ()=>{
  const dbModel = mongoose.model(schmodel.collectionname, schmodel.schema);
  const bulk = dbModel.collection.initializeOrderedBulkOp();

  console.log(`bulk===>${!!bulk}`);
  const  datas = [
  {
    	"$inc": {
    		"AL_Over_SOC": 1,
    		"AL_Err_Mea_Isolation": 1,
    		"F[107]": 1
    	},
      "$set":{
        "CurDay": "2018-02-23",
      	"DeviceId": "1501101156",
      	"DataTime": "2018-02-23 01:25:39",
      	"warninglevel": "低",
      	"NodeID": "999",
      	"SN64": 137754001,
      	"UpdateTime": "2018-02-23 18:09:55",
      	"organizationid": "599af5dc5f943819f10509e6",
      	"Provice": "江苏省",
      	"City": "南通市",
      	"Area": "海门市",
      	"Longitude": 121.123456,
      	"Latitude": 31.987654
      }
    }];

    dbh_alarm(datas,(err,result)=>{
      console.log(err);
      console.log(result);
    });
};
// dbh_alarm==>{"$inc":{"AL_Over_SOC":1,"AL_Err_Mea_Isolation":1,"F[107]":1},"CurDay":"2018-02-23","DeviceId":"1501101156","DataTime":"2018-02-23 01:25:39","warninglevel":"低","NodeID":"999","SN64":137754001,"UpdateTime":"2018-02-23 18:09:55","organizationid":"599af5dc5f943819f10509e6","Provice":"江苏省","City":"南通市","Area":"海门市","Longitude":121.123456,"Latitude":31.987654}

exports.do_test_query_paginate = do_test_query_paginate;
exports.do_test_query_skip = do_test_query_skip;
exports.do_test_insert_alarm = do_test_insert_alarm;

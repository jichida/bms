const DBModels = require('./models.js');
const async = require('async');
const _ = require('lodash');
const config = require('../config.js');

const dbh_device =(datas,callbackfn)=>{
  const dbModel = DBModels.DeviceModel;
  const bulk = dbModel.collection.initializeOrderedBulkOp();
  _.map(datas,(devicedata)=>{
    bulk.find({
    		DeviceId:devicedata.DeviceId
    	})
      .upsert()
      .updateOne({
    		{$set:devicedata}
    	});
  });
  bulk.execute((err,result)=>{
    callbackfn(err,result);
  });
};

const dbh_historydevice =(datas,callbackfn)=>{
  const dbModel = DBModels.HistoryDeviceModel;
  dbModel.insertMany(datas, (err, result)=>{
    callbackfn(err,result);
  });
};

const dbh_historytrack =(datas,callbackfn)=>{
  const dbModel = DBModels.HistoryTrackModel;
  dbModel.insertMany(datas, (err, result)=>{
    callbackfn(err,result);
  });
};

const dbh_alarmraw =(datas,callbackfn)=>{
  const dbModel = DBModels.RealtimeAlarmRawModel;
  dbModel.insertMany(datas, (err, result)=>{
    callbackfn(err,result);
  });
};

const dbh_alarm =(datas,callbackfn)=>{
  const dbModel = DBModels.RealtimeAlarmModel;
  const bulk = dbModel.collection.initializeOrderedBulkOp();
  _.map(datas,(devicedata)=>{
    bulk.find({
    		DeviceId:devicedata.DeviceId,
        CurDay:devicedata.CurDay,
    	})
      .upsert()
      .updateOne({
    		{$set:devicedata}
    	});
  });
  bulk.execute((err,result)=>{
    callbackfn(err,result);
  });
};

const onHandleToDB = (allresult,(callbackfn)=>{
  let fnsz = [];
  fnsz.push((callbackfn)=>{
    dbh_device(allresult['device'],callbackfn);
  });
  fnsz.push((callbackfn)=>{
    dbh_historydevice(allresult['historydevice'],callbackfn);
  });
  fnsz.push((callbackfn)=>{
    dbh_historytrack(allresult['historytrack'],callbackfn);
  });
  fnsz.push((callbackfn)=>{
    dbh_alarm(allresult['alarm'],callbackfn);
  });
  fnsz.push((callbackfn)=>{
    dbh_alarmraw(allresult['alarmraw'],callbackfn);
  });
  async.parallel(fnsz,(err,result)=>{
    callbackfn(err,result);
  });
});

module.exports = onHandleToDB;

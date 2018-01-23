const mongoose     = require('mongoose');
const _ = require('lodash');
const DBModels = require('../../db/models.js');
const xlsx = require('node-xlsx');
const async = require('async');

const importexcel = (excelfilepath,callbackfn)=>{
  console.log(`开始导入excel:${excelfilepath}`);
  const obj = xlsx.parse(excelfilepath);
  console.log(JSON.stringify(obj));
  let listdeviceextra = [];
  let resultkey = [];
  _.map(obj,(v)=>{
    _.map(v.data,(dataarray)=>{
      if(resultkey.length === 0){
        resultkey = dataarray;
      }
      else{
        let recorddevice = {};
        _.map(dataarray,(v,index)=>{
          recorddevice[resultkey[index]] = v;
        });
        listdeviceextra.push(recorddevice);
      }
    });
  });

  console.log(listdeviceextra);

  let asyncfnsz = [];
  _.map(listdeviceextra,(devicedata)=>{
    let DeviceId = devicedata[`RDB编号`];
    if(typeof DeviceId !== 'string'){
      DeviceId = DeviceId+'';
    }
    const fn = (callbackfn)=>{
      const dbDevice = DBModels.DeviceModel;
      dbDevice.findOneAndUpdate({DeviceId},{$set:{Ext:devicedata}},{new:true},(err,result)=>{
        callbackfn(err,result);
      });
    }
    asyncfnsz.push(fn);
  });


  async.parallel(asyncfnsz,(err,resultlist)=>{
    if(!err){
      const success_count = _.filter(resultlist,(v)=>{
        return !!v;
      }).length;
      const notfound_count = resultlist.length - success_count;
      callbackfn({
        result:'OK',
        list:[
          {
            name:'success',
            count:success_count
          },
          {
            name:'notfound',
            count:notfound_count
          }
        ]
      });
    }
    else{
      callbackfn({
        result:'error',
      });
    }
  });
  // callbackfn({
  //   result:'OK',
  //   list:[
  //     {
  //       name:'ff',
  //       count:8
  //     },
  //     {
  //       name:'bb',
  //       count:5
  //     }
  //   ]
  // });
};

module.exports= importexcel;

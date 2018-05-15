const mongoose     = require('mongoose');
const _ = require('lodash');
const DBModels = require('../../db/models.js');
const xlsx = require('node-xlsx');
const importexcel_device_data = require('./importexcel_device_data');

const importexcel = (excelfilepath,req,callbackfn)=>{
  //console.log(`开始导入excel:${excelfilepath}`);
  const obj = xlsx.parse(excelfilepath);
  //console.log(JSON.stringify(obj));
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
  importexcel_device_data(listdeviceextra,req,callbackfn);

};

module.exports= importexcel;

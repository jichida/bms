const config = require('../config');
const DBModels = require('../handler/models.js');
const mongoose = require('mongoose');
const moment = require('moment');
const startexport = require('../handler/startexport');
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('UTF-8', 'GBK');
const csvwriter = require('csvwriter');
const fs = require('fs');
const _ = require('lodash');
const async = require('async');
const debug = require('debug')('srvinterval:deviecext');

const startexport_do = (filename,callbackfn) =>{

  const dbModel = DBModels.DeviceModel;
  const fields = null;
  const csvfields = 'RDB编号,项目,系统Barcode,省份,地区,生产日期,出厂日期,标称容量,\
串联数,并联数,客户名称,线路,电池剩余容量';
  const fn_convert = (doc,callbackfn)=>{
    const newdoc = {
      'RDB编号':_.get(doc,'DeviceId',''),
      '项目':_.get(doc,'Ext.项目',''),
      '系统Barcode':_.get(doc,'Ext.系统Barcode',''),
      '省份':_.get(doc,'Ext.省份',''),
      '地区':_.get(doc,'Ext.地区',''),
      '生产日期':_.get(doc,'Ext.生产日期',''),
      '出厂日期':_.get(doc,'Ext.出厂日期',''),
      '标称容量':_.get(doc,'Ext.标称容量',''),
      '串联数':_.get(doc,'Ext.串联数',''),
      '并联数':_.get(doc,'Ext.并联数',''),
      '客户名称':_.get(doc,'Ext.客户名称',''),
      '线路':_.get(doc,'Ext.线路',''),
      '电池剩余容量':_.get(doc,'Ext.电池剩余容量',''),
    };
    callbackfn(newdoc);
  }
  const query = {Ext:{$exists:true}};
  startexport({filename,dbModel,sort:{DataTime:1},fields:null,csvfields,fn_convert,query},callbackfn);
}
const startexport_export = (callbackfn)=>{
  const filename = `${config.exportdir}/LastestDeviceExt.csv`;

  startexport_do(filename,()=>{
    callbackfn(filename);
  });
}

module.exports = startexport_export;

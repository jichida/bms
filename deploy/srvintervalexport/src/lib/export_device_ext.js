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

  const dbModel = DBModels.DeviceExtModel;
  const fields = null;
  const csvfields = 'RDB编号,客服packno,车工号（BUS）/VIN（CAR）,类型,容量,串联数,并联数,电芯类型,CATL项目名称,\
项目PN,电池系统流水号,BMU硬件版本,CSC硬件版本,BMU软件版本,CSC软件版本,电池入库日期,电池出货日期,车辆生产厂,\
车辆型号,装车日期,整车出厂日期,省份,地区,里程(暂无，保留),客户名称,客户联系地址,客户联系人,客户联系电话,客户移动电话,\
用途,购买日期,新车上牌日期,车牌号,售后外服姓名,开始使用年份';

  const fn_convert = (doc,callbackfn)=>{
    const newdoc = {
      "RDB编号": _.get(doc,"DeviceId",''),
      "客服packno": _.get(doc,"packnocs",''),
      "车工号（BUS）/VIN（CAR）": _.get(doc,"buscarvin",''),
      "类型":_.get(doc,"type",''),
      "容量": _.get(doc,"capacity",''),
      "串联数": _.get(doc,"serialnumber",''),
      "并联数": _.get(doc,"parallelnumber",''),
      "电芯类型": _.get(doc,"typeelectriccore",''),
      "CATL项目名称":_.get(doc,"catlprojectname",''),
      "项目PN": _.get(doc,"projectpn",''),
      "电池系统流水号": _.get(doc,"batterysystemflownumber",''),
      "BMU硬件版本": _.get(doc,"BMUhardwareversion",''),
      "CSC硬件版本": _.get(doc,"CSChardwareversion",''),
      "BMU软件版本":_.get(doc,"BMUsoftwareversion",''),
      "CSC软件版本": _.get(doc,"CSCsoftwareversion",''),
      "电池入库日期":_.get(doc,"datebatterystorage",''),
      "电池出货日期":_.get(doc,"datebatterydelivery",''),
      "车辆生产厂": _.get(doc,"vehicleproductionplant",''),
      "车辆型号": _.get(doc,"vehiclemodel",''),
      "装车日期":_.get(doc,"dateloading",''),
      "整车出厂日期":_.get(doc,"datevehiclefactory",''),
      "省份": _.get(doc,"provice",''),
      "地区": _.get(doc,"area",''),
      "里程(暂无，保留)": _.get(doc,"mileage",''),
      "客户名称": _.get(doc,"customername",''),
      "客户联系地址":_.get(doc,"customercontactaddress",''),
      "客户联系人": _.get(doc,"customercontact",''),
      "客户联系电话":_.get(doc,"customercontactphone",''),
      "客户移动电话": _.get(doc,"customermobilephone",''),
      "用途": _.get(doc,"purpose",''),
      "购买日期": _.get(doc,"datepurchase",''),
      "新车上牌日期": _.get(doc,"datenewcar",''),
      "车牌号":_.get(doc,"licenseplatenumber",''),
      "售后外服姓名": _.get(doc,"nameaftersaleservice",''),
      "开始使用年份": _.get(doc,"usedyear",''),
    };
    callbackfn(newdoc);
  }
  const query = {Ext:{$exists:true}};
  startexport({filename,dbModel,sort:{DeviceId:1},fields:null,csvfields,fn_convert,query},callbackfn);
}
const startexport_export = (callbackfn)=>{
  const filename = `${config.exportdir}/LastestDeviceExt.csv`;

  startexport_do(filename,()=>{
    callbackfn(filename);
  });
}

module.exports = startexport_export;

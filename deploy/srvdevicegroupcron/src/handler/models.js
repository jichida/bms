const mongoose     = require('mongoose');
const Schema       = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate');
const moment = require('moment');
// const config = require('../config.js');
// const moment = require('moment');

mongoose.Promise = global.Promise;
//系统设置
const SystemConfigSchema = new Schema({
}, { strict: false });
SystemConfigSchema.plugin(mongoosePaginate);
const SystemConfigModel =mongoose.model('systemconfig',  SystemConfigSchema);

//设备
const DeviceSchema = new Schema({
}, { strict: false });
DeviceSchema.plugin(mongoosePaginate);
const DeviceModel =mongoose.model('device',  DeviceSchema);

//设备分组
const DeviceGroupSchema = new Schema({
  name:String,
  memo:String,
  contact:String,
  deviceids:[{ type: Schema.Types.ObjectId, ref: 'device', default: [] }],
  organizationid:{ type: Schema.Types.ObjectId, ref: 'organization' },
  systemflag:{ type: Schema.Types.Number,default: 0 },
}, { strict: false });
DeviceGroupSchema.plugin(mongoosePaginate);
const DeviceGroupModel =mongoose.model('devicegroup',  DeviceGroupSchema);

const GeoSchema = new Schema({
}, { strict: false });
const GeoModel = mongoose.model('amapdistrict',  GeoSchema);

exports.SystemConfigSchema = SystemConfigSchema;
exports.DeviceSchema = DeviceSchema;
exports.DeviceGroupSchema = DeviceGroupSchema;
exports.GeoSchema = GeoSchema;

exports.SystemConfigModel = SystemConfigModel;
exports.DeviceModel = DeviceModel;
exports.DeviceGroupModel = DeviceGroupModel;
exports.GeoModel = GeoModel;

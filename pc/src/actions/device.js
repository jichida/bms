import { createAction } from 'redux-act';
//获取设备分组信息
export const querydevicegroup_request = createAction('querydevicegroup_request');
export const querydevicegroup_result = createAction('querydevicegroup_result');
//查询设备【首页上的高级搜索】
export const querydevice_request = createAction('querydevice_request');
export const querydevice_result = createAction('querydevice_result');
//获取一个device所有信息
export const querydeviceinfo_request = createAction('querydeviceinfo_request');
export const querydeviceinfo_result = createAction('querydeviceinfo_result');
//查询告警信息
export const queryrealtimealarm_request = createAction('queryrealtimealarm_request');
export const queryrealtimealarm_result = createAction('queryrealtimealarm_result');
//查询历史轨迹数据
export const queryhistorytrack_request  = createAction('queryhistorytrack_request');
export const queryhistorytrack_result  = createAction('queryhistorytrack_result');

//查询电池包
export const searchbattery_request = createAction('searchbattery_request');
export const searchbattery_result = createAction('searchbattery_result');
//查询电池包报警
export const searchbatteryalarm_request = createAction('searchbatteryalarm_request');
export const searchbatteryalarm_result = createAction('searchbatteryalarm_result');
//查询单个电池包报警
export const searchbatteryalarmsingle_request = createAction('searchbatteryalarmsingle_request');
export const searchbatteryalarmsingle_result = createAction('searchbatteryalarmsingle_result');

//主动更新某个电池包的数据
//经纬度信息发生变化
export const serverpush_devicegeo = createAction('serverpush_devicegeo');
//批量设备地理位置变化
export const devicelistgeochange = createAction('devicelistgeochange');

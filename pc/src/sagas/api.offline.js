import {takeLatest,take,takeEvery,put,fork,call,select} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {
  querydevicegroup_request,
  querydevicegroup_result,
  querydevice_request,
  querydevice_result,
  queryhistorytrack_request,
  queryhistorytrack_result,
  notify_socket_connected,
  login_request,
  md_login_result,
  getsystemconfig_request,
  getsystemconfig_result,

  searchbatteryalarm_request,
  searchbatteryalarm_result,
  searchbatteryalarmsingle_request,
  searchbatteryalarmsingle_result,
  searchbattery_request,
  searchbattery_result,

  querydeviceinfo_request,
  querydeviceinfo_result,
  md_querydeviceinfo_result,

  serverpush_devicegeo,
  serverpush_devicegeo_sz,
  serverpush_devicealarm,

  serverpush_devicegeo_sz_request,
  serverpush_devicegeo_sz_result,
  start_serverpush_devicegeo_sz,

  ui_changemodeview,

  getcurallalarm_request,
  getcurallalarm_result,

  logout_request,
  logout_result,

  getallworkorder_request,
  getallworkorder_result,

  queryworkorder_request,
  queryworkorder_result,

  setalarmreaded_request,
  setalarmreaded_result,

  setworkorderdone_request,
  setworkorderdone_result,

  createworkorder_request,
  createworkorder_result,

  getworkusers_request,
  getworkusers_result,

  ui_clickplayback
} from '../actions';
import  {
  jsondata_bms_chargingpile,
  jsondata_bms_track,
  jsondata_bms_mydevice,
  jsondata_bms_alarm,
  jsondata_bms_workorder,
  jsondata_bms_groups,
  jsondata_bms_workusers,
  getrandom
} from '../test/bmsdata.js';
import { push,goBack,go,replace } from 'react-router-redux';
import config from '../env/config.js';
import {getRandomLocation} from '../env/geo';
import {getRandomLocation_track} from './simulatetrack';
import coordtransform from 'coordtransform';
import {g_devicesdb} from './mapmain';
import _ from 'lodash';
import {getgeodata} from '../sagas/mapmain_getgeodata';
//获取地理位置信息，封装为promise

import moment from 'moment';

const getresult_historytrack = (mstart,mend)=>{
  let list = [];
  list = _.filter(jsondata_bms_track,(item)=>{
    return (item.GPSTime >= mstart) && (item.GPSTime <= mend);
  });
  return list;
}

let list_historyplayback_sz = [
  getresult_historytrack('2017-07-31 09:30:00','2017-07-31 10:30:00'),
  getresult_historytrack('2017-07-31 13:00:00','2017-07-31 14:00:00'),
  getresult_historytrack('2017-07-31 14:00:00','2017-07-31 15:00:00'),
  getresult_historytrack('2017-07-31 15:00:00','2017-07-31 16:00:00'),
];



export function* apiflow(){//
  yield takeLatest(`${ui_clickplayback}`, function*(action) {
    try{
      const {payload} = action;
      const mode = yield select((state)=>{
        return state.app.modeview;
      });
      if(mode !== 'device'){
        yield put(ui_changemodeview('device'));
        yield take(`${querydevice_result}`);
      }
      //轨迹回放时,判断是否为
      yield put(push(`/historyplay/${payload}`));
   }
   catch(e){
     console.log(e);
   }
  });


  yield takeLatest(`${createworkorder_request}`, function*(action) {
    try{
      const {payload} = action;
      let indexalarm = jsondata_bms_workorder.length;
      payload.key = indexalarm + '';
      payload._id = payload.key;
      payload['工单号'] = payload.key;
      jsondata_bms_workorder.push(payload);
      yield put(createworkorder_result(payload));
   }
   catch(e){
     console.log(e);
   }
  });

  yield takeLatest(`${getworkusers_request}`, function*(action) {
    try{
      yield put(getworkusers_result({list:jsondata_bms_workusers}));
   }
   catch(e){
     console.log(e);
   }
  });

  yield takeLatest(`${setalarmreaded_request}`, function*(action) {
    try{
      const {payload} = action;
      let item;
      _.map(jsondata_bms_alarm,(alarm,index)=>{
        if(alarm._id === payload){
          item = {...alarm};
          item.isreaded = true;
          jsondata_bms_alarm[index] = item;
        };
      });

      if(!!item){
        yield put(setalarmreaded_result(item));
      }

   }
   catch(e){
     console.log(e);
   }
  });

  yield takeLatest(`${setworkorderdone_request}`, function*(action) {
    try{
      const {payload:{query,data}} = action;
      let item;
      _.map(jsondata_bms_workorder,(workorder)=>{
        if(workorder._id === query._id){
          workorder = {...workorder,...data};
          item = workorder;
        }
      });
      yield put(setworkorderdone_result(item));
   }
   catch(e){
     console.log(e);
   }
  });


  yield takeLatest(`${getallworkorder_request}`, function*(action) {
    try{
      yield put(getallworkorder_result({list:jsondata_bms_workorder}));
   }
   catch(e){
     console.log(e);
   }
  });

  yield takeLatest(`${queryworkorder_request}`, function*(action) {
    try{
      const {payload:{query}} = action;

      let list = [];

      let workusers = yield select((state)=>{
        return state.workorder.workusers;
      });
      let assignto = _.get(query,'queryalarm.assignto','');
      if(assignto !== ''){
        list = _.filter(jsondata_bms_workorder, (oneworkorder)=>{
          return workusers[assignto].name === oneworkorder['责任人'];
        });
      }
      else{
        list =  _.sampleSize(jsondata_bms_workorder, getrandom(0,jsondata_bms_workorder.length-1));
      }

      let startdatestring = _.get(query,'queryalarm.startDate','');
      let enddatestring = _.get(query,'queryalarm.endDate','');
      if(startdatestring !== '' && enddatestring !== ''){
        list = _.filter(list,(item)=>{
          let waringtime = item['createtime'];
          let match = (startdatestring <= waringtime) && (waringtime <= enddatestring);
          return match;
       });
      }
      //查询条件

      yield put(queryworkorder_result({list}));
   }
   catch(e){
     console.log(e);
   }
  });

  //========
  yield takeLatest(`${logout_request}`, function*(action) {
    try{
      yield put(logout_result({}));
   }
   catch(e){
     console.log(e);
   }
  });

  yield takeLatest(`${getcurallalarm_request}`, function*(action) {
    try{
      //获取今天所有告警信息列表

      // jsondata_bms_alarm
      yield put(getcurallalarm_result({list:jsondata_bms_alarm}));
   }
   catch(e){
     console.log(e);
   }
  });


  yield takeLatest(`${querydeviceinfo_request}`, function*(action) {
    try{
    const {payload:{query:{DeviceId}}} = action;
    let deviceinfo = g_devicesdb[DeviceId];
     yield put(md_querydeviceinfo_result(deviceinfo));
   }
   catch(e){
     console.log(e);
   }
  });

  yield takeLatest(`${getsystemconfig_request}`, function*(action) {
    try{
      yield put(getsystemconfig_result({}));

      yield call(delay,3000);

      if(config.softmode !== 'pc'){
        yield put(login_request({
          username:'15961125167',
          password:'123456',
          role:'operator'
        }));
      }
    }
    catch(e){
      console.log(e);
    }

  });

  yield takeLatest(`${login_request}`, function*(action) {
    try{
        const {payload} = action;
        const {username,password} = payload;
        if(password === '123456'){
            yield put(md_login_result({
            loginsuccess:true,
            username:username,
            token:'',
            avatar:"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMcAAADICAYAAABcU/UTAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyhpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTM4IDc5LjE1OTgyNCwgMjAxNi8wOS8xNC0wMTowOTowMSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTcgKE1hY2ludG9zaCkiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6N0U5MDExNTc5NjgxMTFFN0I5QzU4MjQ2MTY5MDFDOEMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6N0U5MDExNTg5NjgxMTFFN0I5QzU4MjQ2MTY5MDFDOEMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo3RTkwMTE1NTk2ODExMUU3QjlDNTgyNDYxNjkwMUM4QyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDo3RTkwMTE1Njk2ODExMUU3QjlDNTgyNDYxNjkwMUM4QyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PsCcA38AAApFSURBVHja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",
            role:'operator'
            }));
        }
        else if(password === '654321'){
            yield put(md_login_result({
            loginsuccess:true,
            username:username,
            token:'',
            avatar:"data:image/png;base64,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",
            role:'admin'
            }));
        }
        else{
            yield put(md_login_result({
            loginsuccess:false,
            }));
        }
    }catch(e){
        console.log(e);
    }
});

  yield takeLatest(`${ui_changemodeview}`, function*(action) {
    try{
        let viewmode = action.payload;
        let jsondata_result_2;
        if(viewmode === 'device'){
          jsondata_result_2 = jsondata_bms_mydevice;
        }
        else{
          jsondata_result_2 = jsondata_bms_chargingpile;
        }

        yield put(querydevice_result({list:jsondata_result_2}));
      }
      catch(e){
        console.log(e);
      }
  });

  yield takeLatest(`${querydevice_request}`, function*(action) {
    try{
       yield put(querydevice_result({list:jsondata_bms_mydevice}));
     }
     catch(e){
       console.log(e);
     }
    //  yield put(start_serverpush_devicegeo_sz({}));
  });

  yield takeLatest(`${searchbattery_request}`, function*(action) {
    try{
        const {payload:{query}} = action;
        let {carcollections} = yield select((state)=>{
          let carcollections = state.device.carcollections;
          return {carcollections};
        });
        //收藏的设备
        const list = _.filter(jsondata_bms_mydevice, (itemdevice)=>{
          return !!_.find(carcollections,(item)=>{
            return item === itemdevice.DeviceId;
          });
        });
        yield put(searchbattery_result({list}));
      }
      catch(e){
        console.log(e);
      }
  });


  yield takeLatest(`${searchbatteryalarm_request}`, function*(action) {
    try{
      const {payload:{query}} = action;

      console.log(`${JSON.stringify(query)}`);

      let list = [];
      if(!!query){
        let warninglevel = _.get(query,'queryalarm.warninglevel',-1);
        if(warninglevel !== -1){
          //报警等级
          list = _.filter(jsondata_bms_alarm,(item)=>{
            return item.warninglevel === warninglevel;
          });
        }
        else{
          //随机生成
            list = jsondata_bms_alarm;//_.sampleSize(jsondata_bms_alarm, getrandom(0,jsondata_bms_alarm.length));
        }

        let startdatestring = _.get(query,'queryalarm.startDate','');
        let enddatestring = _.get(query,'queryalarm.endDate','');
        if(startdatestring !== '' && enddatestring !== ''){
          list = _.filter(list,(item)=>{
            let waringtime = item['告警时间'];
            let match = (startdatestring <= waringtime) && (waringtime <= enddatestring);
            return match;
         });
        }

        //是否已读
        if(!!query.queryalarm){
          if(query.queryalarm.hasOwnProperty('isreaded')){
            list = _.filter(list,(item)=>{
              return item.isreaded === query.queryalarm.isreaded;
           });
          }
        }

      }
      else{
        //all
        list = jsondata_bms_alarm;
      }
      yield put(searchbatteryalarm_result({list}));

    }
    catch(e){
      console.log(e);
    }
  });

  yield takeLatest(`${searchbatteryalarmsingle_request}`, function*(action) {
    try{
        const {payload:{query}} = action;

        console.log(`${JSON.stringify(query)}`);

        let list = [];
        if(!!query){
           list = _.filter(jsondata_bms_alarm,(item)=>{
            return item.DeviceId === query.DeviceId;
          });

          let warninglevel = _.get(query,'queryalarm.warninglevel',-1);
          if(warninglevel != -1){
            list = _.filter(list,(item)=>{
             return item.warninglevel === warninglevel;
           });
          }

          let startdatestring = _.get(query,'queryalarm.startDate','');
          let enddatestring = _.get(query,'queryalarm.endDate','');
          if(startdatestring !== '' && enddatestring !== ''){
            list = _.filter(list,(item)=>{
              let waringtime = item['告警时间'];
              let match = (startdatestring <= waringtime) && (waringtime <= enddatestring);
              return match;
           });
          }
          // console.log(jsondata_bms_alarm);
          // console.log(`query.DeviceId:${query.DeviceId},list:${JSON.stringify(list)}`);
        }

        yield put(searchbatteryalarmsingle_result({list}));
      }
      catch(e){
        console.log(e);
      }
  });



   yield takeLatest(`${querydevicegroup_request}`, function*(action) {
       try{
          yield put(querydevicegroup_result({list:jsondata_bms_groups}));
        }
        catch(e){
          console.log(e);
        }
   });

   yield fork(function*(){
     try{
         while(!window.amapmain){
           yield call(delay,500);
         }
         yield put(notify_socket_connected(true));
       }
       catch(e){
         console.log(e);
       }

   });

   yield takeLatest(`${queryhistorytrack_request}`, function*(action) {
     try{
        const {payload} = action;
        const {query} = payload;
        const {startDate,endDate} = query;
        // let mstart = moment(startDate).format('2017-07-31 HH:mm:ss');
        // let mend = moment(endDate).format('2017-07-31 HH:mm:ss');
        let index = getrandom(0,list_historyplayback_sz.length -1);
        let resultlist = list_historyplayback_sz[index];
        console.log(`resultlist:index:${index}:${JSON.stringify(resultlist.length)}`);
        yield put(queryhistorytrack_result({list:resultlist}));
      }
      catch(e){
        console.log(e);
      }
   });

  //  模拟服务端推送消息
  yield takeLatest(`${serverpush_devicegeo_sz_request}`, function*(action) {
     try{
        let {modeview,carcollections} = yield select((state)=>{
          let carcollections = state.device.carcollections;
          let modeview = state.app.modeview;
          return {modeview,carcollections};
        });
        if('device' === modeview){

            const list = _.sampleSize(jsondata_bms_mydevice, jsondata_bms_mydevice.length);
            let items = [];
            for(let i = 0;i < list.length; i++){
              let item = {...list[i]};
              let locationsz = [];
              let findeditem = _.find(carcollections,(col)=>{
                return col === item.DeviceId;
              });
              if(!!findeditem){
                const wgs84togcj02=coordtransform.wgs84togcj02(item.LastHistoryTrack.Longitude,item.LastHistoryTrack.Latitude);
                locationsz = yield call(getRandomLocation_track,item.DeviceId,wgs84togcj02[1],wgs84togcj02[0]);
                //坐标转换
                const gcj02towgs84=coordtransform.gcj02towgs84(locationsz[0],locationsz[1]);
                item.LastHistoryTrack.Longitude = gcj02towgs84[0];
                item.LastHistoryTrack.Latitude = gcj02towgs84[1];
                item.locz = locationsz;
              }
              else{
                locationsz = getRandomLocation(item.LastHistoryTrack.Latitude,item.LastHistoryTrack.Longitude,getrandom(5,60));
                item.LastHistoryTrack.Latitude = locationsz[1];
                item.LastHistoryTrack.Longitude  =  locationsz[0];
                let cor = [item.LastHistoryTrack.Longitude,item.LastHistoryTrack.Latitude];
                const wgs84togcj02=coordtransform.wgs84togcj02(cor[0],cor[1]);
                item.locz = wgs84togcj02;
              }


              items.push(item);
            };
            yield put(serverpush_devicegeo_sz_result({list:items}));
        }
      }
      catch(e){
        console.log(e);
      }
   });
}

import { select,put,call,take,takeEvery,takeLatest,cancel,fork } from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {
  mapmain_setzoomlevel,
  mapmain_setmapcenter,
  map_setmapinited,
  carmapshow_createmap,
  carmapshow_destorymap,
  mapmain_setenableddrawmapflag,
  querydevice_result,
  ui_selcurdevice,
  querydeviceinfo_request
} from '../actions';

import {getcurrentpos} from './getcurrentpos';
import { push } from 'react-router-redux';
import L from 'leaflet';
import _ from 'lodash';

const divmapid_mapmain = 'mapmain';

let infoWindow;
const loczero = L.latLng(0,0);
let distCluster,pointSimplifierIns;

const initmapui =  (map)=>{
  return new Promise((resolve,reject) => {
      console.log(`开始加载地图啦,window.AMapUI:${!!window.AMapUI}`);
      window.AMapUI.load(['ui/geo/DistrictCluster','ui/misc/PointSimplifier', 'lib/$'], (DistrictCluster,PointSimplifier, $)=> {

           if (!PointSimplifier.supportCanvas) {
               alert('当前环境不支持 Canvas！');
               return;
           }

           let groupStyleMap;

           pointSimplifierIns = new PointSimplifier({
               zIndex: 115,
               //autoSetFitView: false,
               map: map, //所属的地图实例

               getPosition: (deviceitem)=> {
                   const LastHistoryTrack = deviceitem.LastHistoryTrack;
                   if (!LastHistoryTrack) {
                       return null;
                   }
                   if(LastHistoryTrack.Latitude === 0 || LastHistoryTrack.Longitude === 0){
                     return null;
                   }
                   let cor = [LastHistoryTrack.Longitude,LastHistoryTrack.Latitude];
                   //console.log(`坐标为:${cor}`);
                   return [LastHistoryTrack.Longitude,LastHistoryTrack.Latitude];
                   //return [LastHistoryTrack.Latitude,LastHistoryTrack.Longitude];
               },
               getHoverTitle: (deviceitem, idx)=> {
                   return `设备编号:${deviceitem.DeviceId},当前:${idx}`;
               },
               //使用GroupStyleRender
               renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
               renderOptions: {
                   //点的样式
                   pointStyle: {
                       width: 5,
                       height: 5,
                       fillStyle:'#A2D0FA'
                   },
                   getGroupId: (deviceitem, idx)=> {
                       let groupid = idx%3;
                       return groupid;
                   },
                   groupStyleOptions: (gid)=> {
                       return groupStyleMap[gid];
                   }

               }
           });

           const onIconLoad = ()=> {
               pointSimplifierIns.renderLater();
           }

           const onIconError = (e)=> {
               alert('图片加载失败！');
           }

           groupStyleMap = {
               '0': {
                   pointStyle: {
                       //绘制点占据的矩形区域
                       content: PointSimplifier.Render.Canvas.getImageContent(
                           'images/bike.png', onIconLoad, onIconError),
                       //宽度
                       width: 16,
                       //高度
                       height: 16,
                       //定位点为中心
                       offset: ['-50%', '-50%'],
                       fillStyle: null,
                       //strokeStyle: null
                   }
               },
               '1': {
                   pointStyle: {
                       //绘制点占据的矩形区域
                       content: PointSimplifier.Render.Canvas.getImageContent(
                           'images//people.png', onIconLoad, onIconError),
                       //宽度
                       width: 16,
                       //高度
                       height: 16,
                       //定位点为中心
                       offset: ['-50%', '-50%'],
                       fillStyle: null,
                       // strokeStyle: null
                   }
               },
               '2': {
                   pointStyle: {
                       //绘制点占据的矩形区域
                       content: PointSimplifier.Render.Canvas.getImageContent(
                           'images/truck.png', onIconLoad, onIconError),
                       //宽度
                       width: 16,
                       //高度
                       height: 16,
                       //定位点为中心
                       offset: ['-50%', '-50%'],
                       fillStyle: null,
                       //strokeStyle: null
                   }
               },
               '3': {
                   pointStyle: {
                       //绘制点占据的矩形区域
                       content: PointSimplifier.Render.Canvas.getImageContent(
                           'images/taxi.png', onIconLoad, onIconError),
                       //宽度
                       width: 16,
                       //高度
                       height: 16,
                       //定位点为中心
                       offset: ['-50%', '-50%'],
                       fillStyle: null,
                       //strokeStyle: null
                   }
               }
             };
             //<------------
             distCluster = new DistrictCluster({
                 zIndex: 100,
                 map: map, //所属的地图实例

                 getPosition: (deviceitem)=> {
                     const LastHistoryTrack = deviceitem.LastHistoryTrack;
                     if (!LastHistoryTrack) {
                         return null;
                     }
                     if(LastHistoryTrack.Latitude === 0 || LastHistoryTrack.Longitude === 0){
                       return null;
                     }
                     let cor = [LastHistoryTrack.Longitude,LastHistoryTrack.Latitude];
                     //console.log(`坐标为:${cor}`);
                     return [LastHistoryTrack.Longitude,LastHistoryTrack.Latitude];
                     //return [LastHistoryTrack.Latitude,LastHistoryTrack.Longitude];
                 },
             });

             resolve(pointSimplifierIns);
       });

   });
}

let createmap =({mapcenterlocation,zoomlevel})=> {
  console.log(`开始创建地图啦。。。。${mapcenterlocation.lng},amap:${!!window.amapmain}`);
  return new Promise((resolve,reject) => {
    if(!mapcenterlocation.equals(loczero) && !window.amapmain ){
      let center = new window.AMap.LngLat(mapcenterlocation.lng,mapcenterlocation.lat);
      window.amapmain = new window.AMap.Map(divmapid_mapmain, {
            center: center,
            zoom:zoomlevel,
            lang:"zh-cn",
            dragEnable:true,
            zoomEnable:true,
            touchZoom:true,
        });
        const scale = new window.AMap.Scale({
              visible: true
          });
        const  toolBar = new window.AMap.ToolBar({
              visible: true
          });
        const  overView = new window.AMap.OverView({
              visible: true
          });
          window.amapmain.addControl(scale);
          window.amapmain.addControl(toolBar);
          window.amapmain.addControl(overView);
          resolve(window.amapmain);
      }
      else{
        if(!!window.amapmain){
          resolve(window.amapmain);
          return;
        }
        reject(`地图参数${mapcenterlocation.lng},${mapcenterlocation.lat},amap:${!!window.amapmain}`);
      }
  });
}

const listenmapevent = (eventname)=>{
  return new Promise(resolve => {
    window.amapmain.on(eventname, (e)=> {
        resolve(eventname);
    });
  });
}

const listenmarkclickevent = (eventname)=>{
  return new Promise(resolve => {
    pointSimplifierIns.on(eventname, (e,record)=> {
        resolve(record);
    });
  });
}

const getmapstate_formapcar = (state) => {
  const {carmap} = state;
  return {...carmap};
}

const showinfowindow = (deviceitem)=>{
  return new Promise(resolve =>{
      let LastHistoryTrack = deviceitem.LastHistoryTrack;
      window.AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
          let txtLatitude = _.get(deviceitem,'LastHistoryTrack.Latitude','');
          let txtLongitude = _.get(deviceitem,'LastHistoryTrack.Longitude','');
          let DeviceId = _.get(deviceitem,'DeviceId','');

          infoWindow = new SimpleInfoWindow({
              infoTitle: `<p>设备id:<span class='color_warning'>${DeviceId}</span></p>`,
              infoBody: `<p>位置:纬度<span class='color_warning'>${txtLatitude}</span>,经度:<span class='color_warning'>${txtLongitude}</span> </p>`
          });
          let cor = [LastHistoryTrack.Longitude,LastHistoryTrack.Latitude];
          //显示在map上
          // window.amapmain.setZoomAndCenter(16,cor);
          window.amapmain.setCenter(cor);
          infoWindow.open(window.amapmain, cor);
          resolve(infoWindow);
      });
      // if(!!infoWindow){
      //   infoWindow.close();
      //   infoWindow.setMap(null);
      //   infoWindow = null;
      // }
      // let info = [];
      // let txtLatitude = _.get(deviceitem,'LastHistoryTrack.Latitude','');
      // let txtLongitude = _.get(deviceitem,'LastHistoryTrack.Longitude','');
      // let DeviceId = _.get(deviceitem,'DeviceId','');
      // info.push(`<p>位置:纬度<span class='color_warning'>${txtLatitude}</span>,经度:<span class='color_warning'>${txtLongitude}</span> </p>`);
      // info.push(`<p>设备id:<span class='color_warning'>${DeviceId}</span></p>`);
      // // if(!infoWindow){
      //   infoWindow = new window.AMap.InfoWindow({
      //       content: info.join("")  //使用默认信息窗体框样式，显示信息内容
      //   });
      // // }
      // // else{
      // //   infoWindow.setContent(info.join(""));
      // // }
      // // infoWindow.show();
      // let cor = [LastHistoryTrack.Longitude,LastHistoryTrack.Latitude];
      // infoWindow.open(window.amapmain, cor);
      // resolve(infoWindow);
  });
}

export function* createmapmainflow(){
    console.log(`createmapmainflow...`);
    //创建地图
    yield takeEvery(`${carmapshow_createmap}`, function*(action_createmap) {
      try{
        let {payload:{divmapid}} = action_createmap;
        if(divmapid === divmapid_mapmain){
          yield call(delay,1000);
          console.log(`carmapshow_createmap...`);
          //take
          let mapcarprops = yield select(getmapstate_formapcar);
          if(!mapcarprops.isMapInited){//仅在第一次加载页面初始化时进入
            //等待地图初始化
            yield take(`${map_setmapinited}`);
          }
          let {mapcenterlocation,zoomlevel} = mapcarprops;
          if(mapcenterlocation.equals(loczero)){//仅在第一次加载页面初始化时进入
            const centerpos = yield call(getcurrentpos);
            mapcenterlocation = L.latLng(centerpos.lat, centerpos.lng);
          }
          yield call(createmap,{mapcenterlocation,zoomlevel});//创建地图
          yield call(initmapui,window.amapmain);

          let task_dragend =  yield fork(function*(eventname){
            while(true){
              yield call(listenmapevent,eventname);
              let centerlocation = window.amapmain.getCenter();
              let centerlatlng = L.latLng(centerlocation.lat, centerlocation.lng);
              yield put(mapmain_setmapcenter(centerlatlng));
            }
          },'dragend');

          let task_zoomend =  yield fork(function*(eventname){
            while(true){
              yield call(listenmapevent,eventname);
              // let centerlocation = window.amapmain.getCenter();
              // let centerlatlng = L.latLng(centerlocation.lat, centerlocation.lng);
              yield put(mapmain_setzoomlevel(window.amapmain.getZoom()));
            }
          },'zoomend');

          let task_markclick = yield fork(function*(eventname){
            while(true){
                const dataitem = yield call(listenmarkclickevent,eventname);
                if(!!dataitem){
                  let deviceitem = dataitem.data;
                  console.log(`点击了记录:${JSON.stringify(dataitem)}`);

                  if(!!deviceitem){
                    yield put(ui_selcurdevice({DeviceId:deviceitem.DeviceId,deviceitem}));
                  }
                }
              //
            }
          },'pointClick');//'pointClick pointMouseover pointMouseout'
          //监听事件
          //  pointSimplifierIns.on('pointClick pointMouseover pointMouseout', function(e, record) {
          //      console.log(e.type, record);
          //  })

          yield take(`${carmapshow_destorymap}`);
          yield cancel(task_dragend);
          yield cancel(task_zoomend);
        }
      }
      catch(e){
        console.log(`创建地图失败${e}`);
      }

    });

    //销毁地图
    yield takeEvery(`${carmapshow_destorymap}`, function*(action_destorymap) {
      let {payload:{divmapid}} = action_destorymap;
      if(divmapid === divmapid_mapmain){
        window.amapmain = null;
        infoWindow=null;
      }
    });


    yield takeLatest(`${ui_selcurdevice}`,function*(actioncurdevice){
      try{
          const {payload:{DeviceId,deviceitem}} = actioncurdevice;
          console.log(`${JSON.stringify(deviceitem)}`);
          yield put(querydeviceinfo_request({query:{DeviceId}}));
          yield call(showinfowindow,deviceitem);
          console.log(`显示弹框${JSON.stringify(deviceitem)}`);
        }
        catch(e){
          console.log(`选择点失败${e}`);
        }
    });

    yield takeLatest(`${querydevice_result}`, function*(deviceresult) {
      let {payload:{list:devicelist}} = deviceresult;
      if(!!pointSimplifierIns){
        const data = [];
        _.map(devicelist,(deviceitem)=>{
          const LastHistoryTrack = deviceitem.LastHistoryTrack;
          if (!LastHistoryTrack) {
              return null;
          }
          if(LastHistoryTrack.Latitude === 0 || LastHistoryTrack.Longitude === 0){
            return null;
          }
          data.push(deviceitem);
        });
        //pointSimplifierIns.setData(devicelist);
        // let center = window.amapmain.getCenter();
        // const num = 100000;
        // var data = [];
        // for (var i = 0, len = num; i < len; i++) {
        //     data.push({
        //         DeviceId:i,
        //         LastHistoryTrack: {
        //           Latitude:center.getLat() + (Math.random() > 0.5 ? 1 : -1) * Math.random(),
        //           Longitude:center.getLng() + (Math.random() > 0.5 ? 1 : -1) * Math.random(),
        //         }
        //     });
        // }
        console.log(`一共显示${data.length}个设备`);
        distCluster.setData(data);
        pointSimplifierIns.setData(data);


        //const City =
      }


    });
}

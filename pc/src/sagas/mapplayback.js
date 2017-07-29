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

const divmapid_maptrackhistoryplayback = 'maptrackhistoryplayback';


const loczero = L.latLng(0,0);
let pathSimplifierIns;
const initmapui =  (map)=>{
    return new Promise((resolve,reject) => {
         console.log(`开始加载地图啦,window.AMapUI:${!!window.AMapUI}`);
        //加载PathSimplifier，loadUI的路径参数为模块名中 'ui/' 之后的部分
         window.AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier)=> {

          if (!PathSimplifier.supportCanvas) {
              alert('当前环境不支持 Canvas！');
              return;
          }

          pathSimplifierIns = new PathSimplifier({
              zIndex: 100,
              map: map, //所属的地图实例
              getPath: (pathData, pathIndex)=> {
                  //返回轨迹数据中的节点信息，[AMap.LngLat, AMap.LngLat...] 或者 [[lng,lat],[lng,lat]...]
                  return pathData.path;
              },
              getHoverTitle: (pathData, pathIndex, pointIndex)=> {
                  //返回鼠标悬停时显示的信息
                  if (pointIndex >= 0) {
                      //鼠标悬停在某个轨迹节点上
                      return pathData.name + '，点:' + pointIndex + '/' + pathData.path.length;
                  }
                  //鼠标悬停在节点之间的连线上
                  return pathData.name + '，点数量' + pathData.path.length;
              },
              renderOptions: {
                  //轨迹线的样式
                  pathLineStyle: {
                      strokeStyle: 'red',
                      lineWidth: 6,
                      dirArrowStyle: true
                  }
              }
          });

          //这里构建两条简单的轨迹，仅作示例
          pathSimplifierIns.setData([{
              name: '轨迹1',
              path: [
                  [100.340417, 27.376994],
                  [108.426354, 37.827452],
                  [113.392174, 31.208439],
                  [124.905846, 42.232876]
              ]
          }, {
              name: '大地线',
              //创建一条包括500个插值点的大地线
              path: PathSimplifier.getGeodesicPath([116.405289, 39.904987], [87.61792, 43.793308], 500)
          }]);
          resolve(pathSimplifierIns);
        });

   });
}

let createmap =({mapcenterlocation,zoomlevel})=> {
  console.log(`开始创建地图啦。。。。${mapcenterlocation.lng},${mapcenterlocation.lat},amaptrackhistoryplayback:${!!window.amaptrackhistoryplayback}`);
  return new Promise((resolve,reject) => {
    if(!mapcenterlocation.equals(loczero) && !window.amaptrackhistoryplayback ){
      let center = new window.AMap.LngLat(mapcenterlocation.lng,mapcenterlocation.lat);
      window.amaptrackhistoryplayback = new window.AMap.Map(divmapid_maptrackhistoryplayback, {
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
          window.amaptrackhistoryplayback.addControl(scale);
          window.amaptrackhistoryplayback.addControl(toolBar);
          window.amaptrackhistoryplayback.addControl(overView);
          resolve(window.amaptrackhistoryplayback);
      }
      else{
        if(!!window.amaptrackhistoryplayback){
          resolve(window.amaptrackhistoryplayback);
          return;
        }
        reject(`地图参数${mapcenterlocation.lng},${mapcenterlocation.lat},amaptrackhistoryplayback:${!!window.amaptrackhistoryplayback}`);
      }
  });
}

const listenmapevent = (eventname)=>{
  return new Promise(resolve => {
    window.amaptrackhistoryplayback.on(eventname, (e)=> {
        resolve(eventname);
    });
  });
}

// const listenmarkclickevent = (eventname)=>{
//   return new Promise(resolve => {
//     pointSimplifierIns.on(eventname, (e,record)=> {
//         resolve(record);
//     });
//   });
// }

const getmapstate_curdevice = (state) => {
  const {device:{devices,mapseldeviceid}} = state;
  let deviceitem = devices[mapseldeviceid];
  if(!!deviceitem){
    const LastHistoryTrack = deviceitem.LastHistoryTrack;
    if(!!LastHistoryTrack){
      const locz = L.latLng(LastHistoryTrack.Latitude,LastHistoryTrack.Longitude);
      return locz;
    }
  }
  return loczero;
}
//
// const showinfowindow = (deviceitem)=>{
//   return new Promise(resolve =>{
//       let LastHistoryTrack = deviceitem.LastHistoryTrack;
//       window.AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {
//           let txtLatitude = _.get(deviceitem,'LastHistoryTrack.Latitude','');
//           let txtLongitude = _.get(deviceitem,'LastHistoryTrack.Longitude','');
//           let DeviceId = _.get(deviceitem,'DeviceId','');
//
//           infoWindow = new SimpleInfoWindow({
//               infoTitle: `<p>设备id:<span class='color_warning'>${DeviceId}</span></p>`,
//               infoBody: `<p>位置:纬度<span class='color_warning'>${txtLatitude}</span>,经度:<span class='color_warning'>${txtLongitude}</span> </p>`
//           });
//           let cor = [LastHistoryTrack.Longitude,LastHistoryTrack.Latitude];
//           //显示在map上
//           // window.amapmain.setZoomAndCenter(16,cor);
//           window.amapmain.setCenter(cor);
//           infoWindow.open(window.amapmain, cor);
//           resolve(infoWindow);
//       });
//       // if(!!infoWindow){
//       //   infoWindow.close();
//       //   infoWindow.setMap(null);
//       //   infoWindow = null;
//       // }
//       // let info = [];
//       // let txtLatitude = _.get(deviceitem,'LastHistoryTrack.Latitude','');
//       // let txtLongitude = _.get(deviceitem,'LastHistoryTrack.Longitude','');
//       // let DeviceId = _.get(deviceitem,'DeviceId','');
//       // info.push(`<p>位置:纬度<span class='color_warning'>${txtLatitude}</span>,经度:<span class='color_warning'>${txtLongitude}</span> </p>`);
//       // info.push(`<p>设备id:<span class='color_warning'>${DeviceId}</span></p>`);
//       // // if(!infoWindow){
//       //   infoWindow = new window.AMap.InfoWindow({
//       //       content: info.join("")  //使用默认信息窗体框样式，显示信息内容
//       //   });
//       // // }
//       // // else{
//       // //   infoWindow.setContent(info.join(""));
//       // // }
//       // // infoWindow.show();
//       // let cor = [LastHistoryTrack.Longitude,LastHistoryTrack.Latitude];
//       // infoWindow.open(window.amapmain, cor);
//       // resolve(infoWindow);
//   });
// }

export function* createmaptrackhistoryplaybackflow(){
    console.log(`createmaptrackhistoryplaybackflow...`);
    //创建地图
    yield takeEvery(`${carmapshow_createmap}`, function*(action_createmap) {
      try{
        let {payload:{divmapid}} = action_createmap;
        if(divmapid === divmapid_maptrackhistoryplayback){
          yield call(delay,2000);
          console.log(`carmapshow_createmap...`);
          //take
          let mapcenterlocation = yield select(getmapstate_curdevice);
          const zoomlevel = 16;

          if(mapcenterlocation.equals(loczero)){//仅在第一次加载页面初始化时进入
            const centerpos = yield call(getcurrentpos);
            mapcenterlocation = L.latLng(centerpos.lat, centerpos.lng);
          }
          yield call(createmap,{mapcenterlocation,zoomlevel});//创建地图
          yield call(initmapui,window.amaptrackhistoryplayback);


          let task_zoomend =  yield fork(function*(eventname){
            while(true){
              yield call(listenmapevent,eventname);
              // let centerlocation = window.amapmain.getCenter();
              // let centerlatlng = L.latLng(centerlocation.lat, centerlocation.lng);
              yield put(mapmain_setzoomlevel(window.amaptrackhistoryplayback.getZoom()));
            }
          },'zoomend');


          yield take(`${carmapshow_destorymap}`);
          yield cancel(task_zoomend);
        }
      }
      catch(e){
        console.log(e);
        console.log(`创建地图失败${e}`);
      }

    });

    //销毁地图
    yield takeEvery(`${carmapshow_destorymap}`, function*(action_destorymap) {
      let {payload:{divmapid}} = action_destorymap;
      if(divmapid === divmapid_maptrackhistoryplayback){
        window.amaptrackhistoryplayback = null;
      }
    });

    yield takeLatest(`${ui_selcurdevice}`,function*(actioncurdevice){
      try{
          const {payload:{DeviceId,deviceitem}} = actioncurdevice;
          if(!!deviceitem){
            const LastHistoryTrack = deviceitem.LastHistoryTrack;
            if(!!LastHistoryTrack){
              if(LastHistoryTrack.Latitude !== 0 && LastHistoryTrack.Longitude !== 0){
                let cor = [LastHistoryTrack.Longitude,LastHistoryTrack.Latitude];
                window.amaptrackhistoryplayback.setCenter(cor);
              }
            }
          }
        }
        catch(e){
          console.log(e);
          console.log(`选择点失败${e}`);
        }
    });
}

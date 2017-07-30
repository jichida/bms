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
  querydeviceinfo_request,

  mapplayback_start
} from '../actions';

import {getcurrentpos} from './getcurrentpos';
import { push } from 'react-router-redux';
import L from 'leaflet';
import _ from 'lodash';

const divmapid_maptrackhistoryplayback = 'maptrackhistoryplayback';


const loczero = L.latLng(0,0);
let gPathSimplifier,pathSimplifierIns;
const initmapui =  (map)=>{
    return new Promise((resolve,reject) => {
         console.log(`开始加载地图啦,window.AMapUI:${!!window.AMapUI}`);
        //加载PathSimplifier，loadUI的路径参数为模块名中 'ui/' 之后的部分
         window.AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier)=> {
          gPathSimplifier = PathSimplifier;
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
              name: '上海桂菁路69号到常州津通工业园',
              //创建一条包括500个插值点的大地线
              path: PathSimplifier.getGeodesicPath([121.4044300000,31.1742500000], [119.9515200000,31.6641500000], 500)

          }]);
          resolve(pathSimplifierIns);
        });

   });
}

const startplayback = ({isloop,speed})=>{
  return new Promise((resolve,reject) => {
    if(!!pathSimplifierIns){
      //创建一个巡航器
          window.amaptrackhistoryplayback.setCenter([121.4044300000,31.1742500000]);

          const onload = ()=> {
              pathSimplifierIns.renderLater();
          }

          const onerror =(e)=> {
              alert('图片加载失败！');
          }

          const navg0 = pathSimplifierIns.createPathNavigator(0, {
             loop: isloop, //循环播放
             speed,
             pathNavigatorStyle: {
                  width: 16,
                  height: 32,
                  content: gPathSimplifier.Render.Canvas.getImageContent(`${process.env.PUBLIC_URL}/images/car.png`, onload, onerror),
                  strokeStyle: null,
                  fillStyle: null
            }
         });
         navg0.start();
         resolve(navg0);
    }
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

export function* createmaptrackhistoryplaybackflow(){
    console.log(`createmaptrackhistoryplaybackflow...`);
    //创建地图
    yield takeEvery(`${carmapshow_createmap}`, function*(action_createmap) {
      try{
        let {payload:{divmapid}} = action_createmap;
        if(divmapid === divmapid_maptrackhistoryplayback){
          while(!window.AMap){
            yield call(delay,500);
          }
          console.log(`carmapshow_createmap...`);
          //take
          let mapcenterlocation = yield select(getmapstate_curdevice);
          const zoomlevel = 16;

          if(mapcenterlocation.equals(loczero)){//仅在第一次加载页面初始化时进入
            const centerpos = yield call(getcurrentpos);
            mapcenterlocation = L.latLng(centerpos.lat, centerpos.lng);
          }
          yield call(createmap,{mapcenterlocation,zoomlevel});//创建地图
          while(!window.AMapUI){
            yield call(delay,500);
          }
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

    //mapplayback_start
    yield  takeLatest(`${mapplayback_start}`,function*(actionstart){
      try{
          const {payload:{isloop,speed}} = actionstart;
          yield call(startplayback,{isloop,speed});
        }
        catch(e){
          console.log(e);
          console.log(`选择点失败${e}`);
        }
    });
}

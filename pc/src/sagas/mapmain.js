import { select,put,call,take,takeEvery,takeLatest,cancel,fork,join } from 'redux-saga/effects';
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
  ui_selcurdevice_result,
  querydeviceinfo_request,
  querydeviceinfo_result,
  ui_showmenu,
  ui_showdistcluster,
  ui_showhugepoints,
  mapmain_seldistrict,
  mapmain_seldistrict_init,
  mapmain_getdistrictresult,
  mapmain_getdistrictresult_init,
  mapmain_getdistrictresult_last
} from '../actions';

import {getgeodatabatch,getgeodata} from './mapmain_getgeodata';
import {getcurrentpos} from './getcurrentpos';
import { push } from 'react-router-redux';
import L from 'leaflet';
import _ from 'lodash';
import moment from 'moment';
import coordtransform from 'coordtransform';
import {getadcodeinfo} from '../util/addressutil';
import {getpopinfowindowstyle,getgroupStyleMap} from './getmapstyle';
const divmapid_mapmain = 'mapmain';

let infoWindow;
const loczero = L.latLng(0,0);
let distCluster,pointSimplifierIns;

//优化的时候再考虑
// const createmap_marklist =(map)=>{
//   return new Promise((resolve,reject) => {
//       console.log(`开始加载地图啦,window.AMapUI:${!!window.AMapUI}`);
// }
let groupStyleMap = {};
//新建行政区域&海量点
const initmapui =  (map)=>{
  return new Promise((resolve,reject) => {
      console.log(`开始加载地图啦,window.AMapUI:${!!window.AMapUI}`);
      window.AMapUI.load(['ui/geo/DistrictCluster','ui/misc/PointSimplifier', 'lib/$'], (DistrictCluster,PointSimplifier, $)=> {

           if (!PointSimplifier.supportCanvas) {
               alert('当前环境不支持 Canvas！');
               return;
           }

           let groupsz = getgroupStyleMap();
           _.map(groupsz,(group)=>{
             const {name,image,...rest} = group;
             groupStyleMap[name] = {
                pointStyle: {
                 content:PointSimplifier.Render.Canvas.getImageContent(
                     image, onIconLoad, onIconError),
                 ...rest
               }
             }
           });

           pointSimplifierIns = new PointSimplifier({
               zIndex: 115,
               //autoSetFitView: false,
               map: map, //所属的地图实例

               getPosition: (deviceitem)=> {
                   return deviceitem.locz;
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
             //<------------
             distCluster = new DistrictCluster({
                 zIndex: 100,
                 map: map, //所属的地图实例

                 getPosition: (deviceitem)=> {
                     return deviceitem.locz;
                     //return [LastHistoryTrack.Latitude,LastHistoryTrack.Longitude];
                 },
             });

             resolve(pointSimplifierIns);
       });

   });
}

//新建地图
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

//监听地图事件
const listenmapevent = (eventname)=>{
  return new Promise(resolve => {
    window.amapmain.on(eventname, (e)=> {
        resolve(eventname);
    });
  });
}

//监听标记事件
const listenmarkclickevent = (eventname)=>{
  return new Promise(resolve => {
    pointSimplifierIns.on(eventname, (e,record)=> {
        resolve(record);
    });
  });
}

//监听弹框事件
const listenwindowinfoevent = (eventname)=>{
  return new Promise(resolve => {
    infoWindow.on(eventname, (e)=> {
        resolve(eventname);
    });
  });
}

//监听行政事件,clusterMarkerClick
const listenclusterevent = (eventname)=>{
  return new Promise(resolve => {
    distCluster.on(eventname, (e,record)=> {
        resolve({adcodetop:record.adcode,toggled:true});
    });
  });
}
//获取reduce
const getmapstate_formapcar = (state) => {
  const {carmap} = state;
  return {...carmap};
}

//显示弹框
const showinfowindow = (deviceitem)=>{
  return new Promise(resolve =>{
      let locz = deviceitem.locz;
      window.AMapUI.loadUI(['overlay/SimpleInfoWindow'], function(SimpleInfoWindow) {

          infoWindow = new SimpleInfoWindow(getpopinfowindowstyle(deviceitem));

          if(!!locz){
            window.amapmain.setCenter(locz);
            infoWindow.open(window.amapmain, locz);
          }
          else{
            infoWindow.open(window.amapmain, window.amapmain.getCenter());
          }

          resolve(infoWindow);
      });
  });
}

//获取某个行政编码的树形结构
let getClusterTree =({adcodetop})=> {
  // console.log(`distCluster:${!!distCluster},adcodetop:${adcodetop}`);
  return new Promise((resolve,reject) => {
    distCluster.getClusterRecord(adcodetop,(err,result)=>{
        // adcode: number 区划编码,
        //  name: string 区划名称,
        //  dataItems: Array.<Object> 该区划下辖的数据点的信息
        //  hangingDataItems: Array.<Object>
        //        该区划内的悬挂（没有对应子级）数据点
        //  children:Array.<{
        //      adcode, name, dataItem
        //  }> 子级区划的聚合信息
        // console.log(`${err}`);
        if(!err){
          let treenode = {
            children:[],
          };
          const {adcode,name,dataItems,hangingDataItems,children} = result;
          treenode.adcode = adcode;
          treenode.name = `${name}(${dataItems.length})`;

          // console.log(`adcode:${adcode},name:${name}`);
          // console.log(`${JSON.stringify(dataItems.length)}`);
          if(!children || children.length === 0){
            _.map(dataItems,(deviceitem)=>{
              if(!!deviceitem.dataItem){
                treenode.children.push({
                  loading: false,
                  name:`${deviceitem.dataItem.DeviceId}`,
                });
                //treenode.devicelist.push(deviceitem.dataItem);
              }
            });
          }
          else{
            _.map(children,(child)=>{
              treenode.children.push({
                adcode:child.adcode,
                loading: true,
                name:`${child.name}(${child.dataItems.length})`,
                children:[]
              });
            });
          }
          resolve(treenode);
        }
        else{
          reject(err);
        }

    });
  });
};


export function* createmapmainflow(){
    console.log(`createmapmainflow...`);
    //创建地图
    yield takeEvery(`${carmapshow_createmap}`, function*(action_createmap) {
      try{
        let {payload:{divmapid}} = action_createmap;
        if(divmapid === divmapid_mapmain){
          while(!window.AMap || !window.AMapUI){
            yield call(delay,500);
          }
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

          let listentask =  yield fork(function*(eventname){
            while(true){
              let result = yield call(listenclusterevent,eventname);
              yield put(mapmain_seldistrict(result));
              // yield put(clusterMarkerClick(result));
            }
          },'clusterMarkerClick');



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


    yield takeLatest(`${ui_selcurdevice_result}`,function*(actioncurdevice){
      try{
          const {payload:{DeviceId,deviceitem}} = actioncurdevice;
          console.log(`${JSON.stringify(deviceitem)}`);
          yield put(querydeviceinfo_request({query:{DeviceId}}));
          const {payload} = yield take(`${querydeviceinfo_result}`);
          yield call(showinfowindow,payload);
          yield fork(function*(eventname){
           while(true){
             yield call(listenwindowinfoevent,eventname);
             yield put(ui_showmenu("showdevice_no"));
           }
          },'close');
          yield put(ui_showmenu("showdevice"));
          console.log(`显示弹框${JSON.stringify(deviceitem)}`);
        }
        catch(e){
          console.log(`选择点失败${e}`);
        }
    });

    yield takeLatest(`${querydevice_result}`, function*(deviceresult) {
      let {payload:{list:devicelist}} = deviceresult;
      while(!pointSimplifierIns || !distCluster){
        yield call(delay,500);
      }
      //批量转换一次

      let devicelistresult = yield call(getgeodatabatch,devicelist);
      const data = [];
      _.map(devicelistresult,(deviceitem)=>{
        if(!!deviceitem.locz){
          data.push(deviceitem);
        }
      });
      console.log(`一共显示${data.length}个设备`);
      distCluster.setData(data);
      pointSimplifierIns.setData(data);

      yield put(mapmain_seldistrict_init({adcodetop:100000,toggled:true}));

    });

    //显示地图区域
    yield takeEvery(`${ui_showdistcluster}`, function*(action_showflag) {
        let {payload:isshow} = action_showflag;
        if(isshow){
          distCluster.show();
        }
        else{
          distCluster.hide();
        }
        distCluster.render();
    });
    //显示海量点
    yield takeEvery(`${ui_showhugepoints}`, function*(action_showflag) {
        let {payload:isshow} = action_showflag;
        if(isshow){
          pointSimplifierIns.show();
        }
        else{
          pointSimplifierIns.hide();
        }
        pointSimplifierIns.render();
    });
    //第一次初始化
    yield takeEvery(`${mapmain_seldistrict_init}`, function*(action_district) {
      try{
        let {payload:{adcodetop}} = action_district;
        console.log(`开始初始化设备树:${moment().format('YYYY-MM-DD HH:mm:ss')}`);

        function* gettreenode(adcode){
          let treenode;
          while(!treenode){
            try{
              treenode = yield call(getClusterTree,{adcodetop:adcode});
            }
            catch(e){
              yield call(delay,1000);
              // distCluster.zoomToShowSubFeatures(adcode);
              console.log(e);
            }
          }
          // console.log(`gettreenode result:${adcode}`);
          return treenode;
        }

        let treenoderoot = yield gettreenode(adcodetop);
        let forkhandles = [];

        function* settreenode(treenode){
          if(!!treenode && !!treenode.children){
            // console.log(`settreenode:${treenode.children.length}`);
            for(let i =0 ;i< treenode.children.length;i++){
              let child = treenode.children[i];
              let adcode = child.adcode;
              if(!!adcode){
                const handlefork = yield fork(gettreenodeandset,adcode,child);
                forkhandles.push(handlefork);
                // yield gettreenodeandset(adcode,child);
                // console.log(`开始:${adcode}`);
              }
              else{
                //device
                child.loading = false;
              }
            }
          }
        }

        function* gettreenodeandset(adcode,child){
          let childsub = yield gettreenode(adcode);
          child.children = childsub.children;
          // yield settreenode(childsub);
          const handlefork = yield fork(settreenode,childsub);
          forkhandles.push(handlefork);
        }
        yield settreenode(treenoderoot);
        // yield call(delay,10000);
        console.log(`等待完成,合计${forkhandles.length}个任务`);
        // yield forkhandles.map(t => join(t)).
        yield join(...forkhandles);
        // distCluster.zoomToShowSubFeatures(adcodetop);
        console.log(`初始化设备树完毕:${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        yield put(mapmain_getdistrictresult_init(treenoderoot));
      }
      catch(e){
        console.log(e);
      }
    });
    //mapmain_getdistrictresult
    yield takeEvery(`${mapmain_seldistrict}`, function*(action_district) {
        let {payload:{adcodetop}} = action_district;
        try{
          if(!!adcodetop){
            //下面判断，防止用户在地图上乱点导致左侧省市区的树无法更新
            //========================================================================================
            distCluster.zoomToShowSubFeatures(adcodetop);

            yield put(mapmain_getdistrictresult({adcode:adcodetop}));
            let adcodeinfo = getadcodeinfo(adcodetop);
            const {curdevicelist,devices} = yield select((state)=>{
              return {...state.device};
            });
            console.log(`${curdevicelist.length}`);
            if(adcodeinfo.level === 'district' && curdevicelist.length < 50){
              //如果当前定位到区一级，则自动放大到最合适位置
              let latlngs = [];
              _.map(curdevicelist,(devicenode)=>{
                  const deviceitem = devices[devicenode.name];
                  if(!!deviceitem){
                    latlngs.push([deviceitem.locz[1],deviceitem.locz[0]]);
                  }
              });
              console.log(`latlngs===>${JSON.stringify(latlngs)}`);
              if(latlngs.length > 0){
                 let polyline = L.polyline(latlngs);
                 let lBounds = polyline.getBounds();//LatLngBounds
                 let southWest = new window.AMap.LngLat(lBounds.getSouthWest().lng,lBounds.getSouthWest().lat);
                 let northEast = new window.AMap.LngLat(lBounds.getNorthEast().lng,lBounds.getNorthEast().lat);
                 let amapboounds = new window.AMap.Bounds(southWest,northEast);
                 window.amapmain.setBounds(amapboounds);

                 console.log(`zoomto...`);
               }
            }
          }
        }
        catch(e){
          console.log(e);
        }
        yield put(mapmain_getdistrictresult_last({}));

    });

    yield takeLatest(`${ui_selcurdevice}`,function*(actioncurdevice){
      const {payload:{DeviceId,deviceitem}} = actioncurdevice;
      try{
        //如果左侧的树中没有该设备
        const {curdevicelist} = yield select((state)=>{
          return {...state.device};
        });
        if(!_.find(curdevicelist,(o)=>{return DeviceId === o.name})){
            //树中找不到该设备,获取该设备所在经纬度
            const result = yield call(getgeodata,deviceitem);
            const adcodetop = parseInt(result.adcode);
            yield put(mapmain_seldistrict({adcodetop,toggled:true}));
            console.log(`等待数据完成...`);
            yield take(`${mapmain_getdistrictresult_last}`);//等待数据完成
        }
      }
      catch(e){
        console.log(e);
      }
      yield put(ui_selcurdevice_result(actioncurdevice.payload));
    });
}

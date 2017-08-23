import { select,put,call,take,takeEvery,takeLatest,cancel,fork,join,throttle } from 'redux-saga/effects';
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
  mapmain_getdistrictresult_last,
  ui_settreefilter,
  md_ui_settreefilter,
  serverpush_devicegeo,
  serverpush_devicegeo_sz,
  devicelistgeochange_distcluster,
  devicelistgeochange_pointsimplifierins,
  devicelistgeochange_geotreemenu,
} from '../actions';
import async from 'async';
import {getgeodatabatch,getgeodata} from './mapmain_getgeodata';
import {getcurrentpos} from './getcurrentpos';
import { push } from 'react-router-redux';
import L from 'leaflet';
import _ from 'lodash';
import moment from 'moment';
import coordtransform from 'coordtransform';
import {getadcodeinfo} from '../util/addressutil';
import {getpopinfowindowstyle,getgroupStyleMap} from './getmapstyle';
import jsondataareas from '../util/areas.json';
import jsondataprovinces from '../util/provinces.json';
import jsondatacities from '../util/cities.json';

const divmapid_mapmain = 'mapmain';

let infoWindow;
const loczero = L.latLng(0,0);
let distCluster,pointSimplifierIns;
let groupStyleMap = {};


//=====数据部分=====
let g_devices = {};
let gmap_treecount = {};
let gmap_devices = {};
//新建行政区域&海量点
const CreateMapUI_PointSimplifier =  (map)=>{
  return new Promise((resolve,reject) => {
      console.log(`开始加载地图啦,window.AMapUI:${!!window.AMapUI}`);
      window.AMapUI.load(['ui/misc/PointSimplifier',
    ],(PointSimplifier)=> {
           if (!PointSimplifier.supportCanvas) {
               alert('当前环境不支持 Canvas！');
               reject();
               return;
           }
           //分组样式
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

           const onIconLoad = ()=> {
               pointSimplifierIns.renderLater();
           }

           const onIconError = (e)=> {
               alert('图片加载失败！');
           }
           //海量点控件
           pointSimplifierIns = new PointSimplifier({
               zIndex: 115,
               autoSetFitView: false,
               map: map, //所属的地图实例
               getPosition: (deviceitem)=> {
                   let itemnew = g_devices[deviceitem.DeviceId];
                   if(!!itemnew){
                    //  console.log(`显示点:${JSON.stringify(itemnew.locz)}`);
                     return itemnew.locz;
                   }
                  //  console.log(`显示点:${JSON.stringify(deviceitem.locz)}`);
                   return deviceitem.locz;
                   //return [LastHistoryTrack.Latitude,LastHistoryTrack.Longitude];
               },
               getHoverTitle: (deviceitem, idx)=> {
                   return `设备编号:${deviceitem.DeviceId},当前:${idx}`;
               },
               //使用GroupStyleRender
               renderConstructor: PointSimplifier.Render.Canvas.GroupStyleRender,
               renderOptions: {
                   //点的样式,海量点样式
                   pointStyle: {
                       width: 5,
                       height: 5,
                       fillStyle:'#A2D0FA'
                   },
                   getGroupId: (deviceitem, idx)=> {
                       let idex = parseInt(deviceitem.locz[0]) + parseInt(deviceitem.locz[1]);
                       let groupid = idex%3;
                       return groupid;
                   },
                   groupStyleOptions: (gid)=> {
                       return groupStyleMap[gid];
                   }

               }
           });
           resolve(pointSimplifierIns);
       });

   });
}

const CreateMapUI_DistrictCluster =  (map)=>{
  return new Promise((resolve,reject) => {
      console.log(`开始加载地图啦,window.AMapUI:${!!window.AMapUI}`);
      window.AMapUI.load(['ui/geo/DistrictCluster',
      'lib/utils',
      'lib/dom.utils',
      'ui/geo/DistrictCluster/lib/DistMgr',
    ],(DistrictCluster,utils, domUtils, DistMgr)=> {
           //<------------
           const defaultgetClusterMarker = (feature, dataItems, recycledMarker)=> {
               //行政区域
               try{
                 let container, title, body;
                 const nodeClassNames = {
              				title: 'amap-ui-district-cluster-marker-title',
              				body: 'amap-ui-district-cluster-marker-body',
              				container: 'amap-ui-district-cluster-marker'
              			};
              			if (recycledMarker) {
              				container = recycledMarker.getContent();
              				title = domUtils.getElementsByClassName(nodeClassNames.title, 'span', container)[0];
              				body = domUtils.getElementsByClassName(nodeClassNames.body, 'span', container)[0];
              			} else {
                      container = document.createElement('div');
              				title = document.createElement('span');
              				title.className = nodeClassNames.title;
              				body = document.createElement('span');
              				body.className = nodeClassNames.body;
              				container.appendChild(title);
              				container.appendChild(body);
              			}

              			const props = feature.properties,
              			routeNames = [];
              			const classNameList = [nodeClassNames.container, 'level_' + props.level, 'adcode_' + props.adcode];
              			if (props.acroutes) {
              				const acroutes = props.acroutes;
              				for (let i = 0, len = acroutes.length; i < len; i++) {
              					classNameList.push('descendant_of_' + acroutes[i]);
              					if (i === len - 1) {
              						classNameList.push('child_of_' + acroutes[i]);
              					}
              					if (i > 0) {
              						routeNames.push(DistMgr.getNodeByAdcode(acroutes[i]).name);
              					}
              				}
              			}
              			container.className = classNameList.join(' ');
              			if (routeNames.length > 0) {
              				routeNames.push(props.name);
              				container.setAttribute('title', routeNames.join('>'));
              			} else {
              				container.removeAttribute('title');
              			}
                    if(!!title){
                      title.innerHTML = utils.escapeHtml(props.name);
                    }
              			if(!!body){
                      body.innerHTML = dataItems.length;
                    }

              			const resultMarker = recycledMarker || new window.AMap.Marker({
              				topWhenClick: true,
              				offset: new window.AMap.Pixel(-20, -30),
              				content: container
              			});
              			return resultMarker;
               }
               catch(e){

               }
          	    return null;
        		}

             utils.extend(DistrictCluster.prototype,
               {//重新设置数据时不刷新Marker
                   setDataWithoutClear: function(data) {
                      // console.log(`setDataWithoutClear=======>`);
                      data || (data = []);
                      this.trigger("willBuildData", data);
                      this._data.source = data;
                      //  this._data.bounds = BoundsItem.getBoundsItemToExpand();
                      this._buildDataItems(data);
                      this._buildKDTree();
                      this._distCounter.setData(this._data.list);
                      this.trigger("didBuildData", data);
                      this.renderLater(10);
                      data.length && this._opts.autoSetFitView && this.setFitView();
                    },
              });
             distCluster = new DistrictCluster({
                 zIndex: 100,
                 map: map, //所属的地图实例
                 autoSetFitView:false,
                 getPosition: (deviceitem)=> {
                     return deviceitem.locz;
                 },
                 renderOptions:{
                   featureClickToShowSub:true,
                   clusterMarkerRecycleLimit:1000,
                   clusterMarkerKeepConsistent:false,
                   getClusterMarker : (feature, dataItems, recycledMarker)=> {
                    //  const adcode = _.get(feature,'properties.adcode');
                    //  if(!!adcode){
                    //    gmap_treecount[adcode] = dataItems.length;
                    //    let deviceids = [];
                    //    _.map(dataItems,(data)=>{
                    //      let DeviceId = _.get(data,'dataItem.DeviceId');
                    //      if(!!DeviceId){
                    //        deviceids.push(DeviceId);
                    //      }
                    //    });
                    //    gmap_devices[adcode] = deviceids;
                    //  }
                     //dispatch 部分数据，更新到树
                      if(dataItems.length > 0){
                        return defaultgetClusterMarker(feature, dataItems, recycledMarker);
                      }
                      return null;
                    }
                 }
             });
             resolve(distCluster);
       });

   });
}

//新建地图
let CreateMap =({mapcenterlocation,zoomlevel})=> {
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

        window.AMap.plugin(['AMap.ToolBar','AMap.Scale','AMap.OverView'],
        ()=>{
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
        });

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
        distCluster.getClusterRecord(record.adcode,(err,result)=>{
          if(!err){
            const {adcode,name,dataItems,hangingDataItems,children} = result;
            if(!!dataItems){
              if(dataItems.length > 0){
                  resolve({adcodetop:record.adcode,toggled:true});
                  return;
              }
            }
          }
          resolve();
        });
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
let getClusterTree_all =()=> {
  const adcodetop=100000;
  return new Promise((resolve,reject) => {
    if(!distCluster){
      reject();
      return;
    }
    let gmap_treecount = {};
    let gmap_devices = {};
    let fnszroot = [];
    const fnget = (code,callback)=>{
      let fnsz = [];
      distCluster.getClusterRecord(code,(err,result)=>{
        if(!err){
          const {adcode,dataItems,children} = result;
          if(!children || children.length === 0){
            //device
            let deviceids = [];
            if(!!dataItems){
              _.map(dataItems,(deviceitem)=>{
                if(!!deviceitem.dataItem){
                  deviceids.push(deviceitem.dataItem.DeviceId);
                }
              });
            }
            gmap_treecount[adcode]=deviceids.length;
            gmap_devices[adcode]=deviceids;
            callback(null,true);
          }
          else{
            //group
            if(!dataItems || dataItems.length === 0){
              gmap_treecount[adcode]=0;
              callback(null,true);
              return;
            }
            gmap_treecount[adcode]=dataItems.length;
            _.map(children,(child)=>{
              const fn = (callback)=>{
                if(child.dataItems.length > 0){
                  fnget(child.adcode,callback);
                }
                else{
                  gmap_treecount[child.adcode]=0;
                  callback(null,true);
                }
              }
              fnsz.push(fn);
            });
            async.parallel(fnsz,(err,result)=>{
              callback(null,true);
            });
          }
        }
        else{
          callback(true,null);
        }
      });
    };

    //for root entry
    distCluster.getClusterRecord(adcodetop,(err,result)=>{
      if(!err){
        const {children,dataItems} = result;
        if(!children || children.length === 0){
          reject();
        }

        if(!dataItems || dataItems.length === 0){
          reject();
          return;
        }
        gmap_treecount[adcodetop]=dataItems.length;//全国

        _.map(children,(child)=>{
          const fn = (callback)=>{
            if(child.dataItems.length > 0){
              fnget(child.adcode,callback);
            }
            else{
              gmap_treecount[child.adcode]=0;
              callback(null,true);
            }
          }
          fnszroot.push(fn);
        });
        async.parallel(fnszroot,(err,result)=>{
          resolve({gmap_devices,gmap_treecount});
        });

      }
      else{
        reject(err);
      }
    });
  });
};

//获取某个行政编码的树形结构
let getClusterTree_provicecity =({adcodetop})=> {
  // console.log(`distCluster:${!!distCluster},adcodetop:${adcodetop}`);
  return new Promise((resolve,reject) => {
    if(!distCluster){
      reject();
      return;
    }
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
          const {adcode,name,dataItems,hangingDataItems,children} = result;
          if(!dataItems || dataItems.length === 0){
            resolve(0);
            return;
          }
          resolve(dataItems.length);
        }
        else{
          reject(err);
        }
    });
  });
};

let getClusterTree_area =({adcodetop})=> {
  // console.log(`distCluster:${!!distCluster},adcodetop:${adcodetop}`);
  return new Promise((resolve,reject) => {
    if(!distCluster){
      reject();
      return;
    }
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
          let deviceids = [];
          const {adcode,name,dataItems,hangingDataItems,children} = result;
          if(!dataItems || dataItems.length === 0){
            resolve(deviceids);
            return;
          }
          _.map(dataItems,(deviceitem)=>{
            if(!!deviceitem.dataItem){
              deviceids.push(deviceitem.dataItem.DeviceId);
            }
          });
          resolve(deviceids);
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
          yield call(CreateMap,{mapcenterlocation,zoomlevel});//创建地图

          yield call(CreateMapUI_PointSimplifier,window.amapmain);
          yield call(CreateMapUI_DistrictCluster,window.amapmain);

          let listentask =  yield fork(function*(eventname){
            while(true){
              let result = yield call(listenclusterevent,eventname);
              if(!!result){
                yield put(mapmain_seldistrict(result));
              }
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
        distCluster=null;
        pointSimplifierIns=null;
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
          // yield put(ui_showmenu("showdevice"));
          console.log(`显示弹框${JSON.stringify(deviceitem)}`);
        }
        catch(e){
          console.log(`选择点失败${e}`);
        }
    });

    //查询所有设备返回
    yield takeLatest(`${querydevice_result}`, function*(deviceresult) {
      let {payload:{list:devicelist}} = deviceresult;
      try{
          while(!pointSimplifierIns || !distCluster){
            yield call(delay,2500);
          }
          //批量转换一次
          g_devices = {};
          let devicelistresult = yield call(getgeodatabatch,devicelist);
          const data = [];
          _.map(devicelistresult,(deviceitem)=>{
            if(!!deviceitem.locz){
              data.push(deviceitem);
              g_devices[deviceitem.DeviceId] = deviceitem;
            }
          });
          console.log(`一共显示${data.length}个设备`);
          distCluster.setData(data);
          pointSimplifierIns.setData(data);

          yield put(mapmain_seldistrict_init());
        }
        catch(e){
          console.log(`选择点失败${e}`);
        }

    });

    //显示地图区域
    yield takeEvery(`${ui_showdistcluster}`, function*(action_showflag) {
        let {payload:isshow} = action_showflag;
        try{
          if(!!distCluster){
            if(isshow){
              distCluster.show();
            }
            else{
              distCluster.hide();
            }
            distCluster.render();
          }
        }
        catch(e){
          console.log(e);
        }
    });
    //显示海量点
    yield takeEvery(`${ui_showhugepoints}`, function*(action_showflag) {
        let {payload:isshow} = action_showflag;
        try{
          if(!!distCluster){
            if(isshow){
              pointSimplifierIns.show();
            }
            else{
              pointSimplifierIns.hide();
            }
            pointSimplifierIns.render();
          }
        }
        catch(e){
          console.log(e);
        }
    });
    //第一次初始化
    yield takeEvery(`${mapmain_seldistrict_init}`, function*(action_district) {
      try{
        console.log(`开始初始化设备树:${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        const {gmap_devices,gmap_treecount} = yield call(getClusterTree_all);
        console.log(`结束初始化设备树:${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        // let {payload:{adcodetop}} = action_district;
        // console.log(`开始初始化设备树:${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        //
//         function* getmap_area(adcode){
//           let deviceids;
//           while(!deviceids){
//             try{
//               deviceids = yield call(getClusterTree_area,{adcodetop:adcode});
//               gmap_devices[adcode] = deviceids;
//               gmap_treecount[adcode] = deviceids.length;
//               break;
//             }
//             catch(e){
//               yield call(delay,1000);
//               console.log(e);
//             }
//           }
//           return deviceids;
//         }
//         function* getmap_provicecity(adcode){
//           let counts;
//           while(!counts){
//             try{
//               counts = yield call(getClusterTree_provicecity,{adcodetop:adcode});
//               gmap_treecount[adcode] = counts;
//               break;
//             }
//             catch(e){
//               yield call(delay,1000);
//               console.log(e);
//             }
//           }
//           return counts;
//         }
//
//
// console.log(`??====>`);
//
//         function* initalltree(){
//            let forkhandles = [];
// console.log(`0====>`);
//             let mapcode = [];
//             let provicecitycode = [];
//             _.map(jsondataareas,(area)=>{
//               const code = parseInt(area.code);
//               mapcode.push(code);
//             });
//             _.map(jsondataprovinces,(provice)=>{
//               const code = parseInt(provice.code);
//               provicecitycode.push(code);
//             });
//             _.map(jsondatacities,(city)=>{
//               const code = parseInt(city.code);
//                if(city.name !== "市辖区" && city.name !== "省直辖县级行政区划"
//              && city.name !== "县" && city.name !== "自治区直辖县级行政区划"){
//                  provicecitycode.push(code);
//                }
//             });
//
//             console.log(`开始:${moment().format('YYYY-MM-DD HH:mm:ss')}`);
//
//             for(let i = 0;i < provicecitycode.length; i++){
//               // console.log(`provicecitycode start for ${mapcode[i]}`);
//                 yield getmap_area(provicecitycode[i]);
//               // const handlefork = yield fork(getmap_provicecity,provicecitycode[i]);
//               // forkhandles.push(handlefork);
//             }
//
//     console.log(`1====>`);
//             for(let i = 0; i < mapcode.length; i++){
//               // yield getmap_area(parseInt(jsondataareas[i].code));
//               console.log(`area start for ${mapcode[i]}`);
//               yield getmap_area(mapcode[i]);
//               // const handlefork = yield fork(getmap_area,mapcode[i]);
//               // forkhandles.push(handlefork);
//             }
//     console.log(`2====>`);
//             // for( let i = 0; i< jsondatacities.length ;i++){
//             //   const city = jsondatacities[i];
//             //   let code = parseInt(city.code);
//             //   const handlefork = yield fork(getmap_provicecity,code);
//             //   forkhandles.push(handlefork);
//             // }
//             console.log(`等待完成,合计${forkhandles.length}个任务:${moment().format('YYYY-MM-DD HH:mm:ss')}`);
//             if(forkhandles.length > 0){
//               yield join(...forkhandles);
//             }
//         };
//         yield initalltree();
//
//         console.log(`初始化设备树完毕:${moment().format('YYYY-MM-DD HH:mm:ss')}`);
//         console.log(gmap_devices);
//         console.log(gmap_treecount);
         yield put(mapmain_getdistrictresult_init({g_devices,gmap_devices,gmap_treecount}));
        //
        // let treenoderoot = yield gettreenode(adcodetop);
        // //先加载一次
        // yield put(mapmain_getdistrictresult_init(treenoderoot));
        //
        // function* settreenode(treenode){
        //   let forkhandles = [];
        //   if(!!treenode && !!treenode.children){
        //     // console.log(`settreenode:${treenode.children.length}`);
        //     for(let i =0 ;i< treenode.children.length;i++){
        //       let child = treenode.children[i];
        //       let adcode = child.adcode;
        //       if(!!adcode){
        //         const handlefork = yield fork(gettreenodeandset,adcode,child);
        //         forkhandles.push(handlefork);
        //         // yield gettreenodeandset(adcode,child);
        //         // console.log(`开始:${adcode}`);
        //       }
        //       else{
        //         //device
        //         child.loading = false;
        //       }
        //     }
        //   }
        //   if(forkhandles.length > 0){
        //     yield join(...forkhandles);
        //   }
        //
        // }
        //
        // function* gettreenodeandset(adcode,child){
        //   let childsub = yield gettreenode(adcode);
        //   if(!!childsub){
        //     child.children = childsub.children;
        //     // yield settreenode(childsub);
        //     let forkhandles = [];
        //     const handlefork = yield fork(settreenode,childsub);
        //     forkhandles.push(handlefork);
        //     if(forkhandles.length > 0){
        //       yield join(...forkhandles);
        //     }
        //   }
        //
        // }
        // yield settreenode(treenoderoot);
        // // const handlefork = yield fork(settreenode,treenoderoot);
        // // forkhandles.push(handlefork);
        // // yield call(delay,10000);
        // // console.log(`等待完成,合计${forkhandles.length}个任务:${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        // // yield forkhandles.map(t => join(t)).
        //
        // // distCluster.zoomToShowSubFeatures(adcodetop);
        // console.log(`初始化设备树完毕:${moment().format('YYYY-MM-DD HH:mm:ss')}`);
        // yield put(mapmain_getdistrictresult_init(treenoderoot));
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
            if(!!distCluster){
              distCluster.zoomToShowSubFeatures(adcodetop);
            }
            console.log(`zoomToShowSubFeatures:${adcodetop}`);

            yield put(mapmain_getdistrictresult({adcode:adcodetop}));
            // let adcodeinfo = getadcodeinfo(adcodetop);
            // const {curdevicelist,devices} = yield select((state)=>{
            //   return {...state.device};
            // });
            // console.log(`${curdevicelist.length}`);
            // if(adcodeinfo.level === 'district' && curdevicelist.length < 50){
            //   //如果当前定位到区一级，则自动放大到最合适位置
            //   let latlngs = [];
            //   _.map(curdevicelist,(devicenode)=>{
            //       const deviceitem = devices[devicenode.name];
            //       if(!!deviceitem){
            //         latlngs.push([deviceitem.locz[1],deviceitem.locz[0]]);
            //       }
            //   });
            //   console.log(`latlngs===>${JSON.stringify(latlngs)}`);
            //   if(latlngs.length > 0){
            //      let polyline = L.polyline(latlngs);
            //      let lBounds = polyline.getBounds();//LatLngBounds
            //      let southWest = new window.AMap.LngLat(lBounds.getSouthWest().lng,lBounds.getSouthWest().lat);
            //      let northEast = new window.AMap.LngLat(lBounds.getNorthEast().lng,lBounds.getNorthEast().lat);
            //      let amapboounds = new window.AMap.Bounds(southWest,northEast);
            //      window.amapmain.setBounds(amapboounds);
            //
            //      console.log(`zoomto...`);
            //    }
            // }
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

    yield takeLatest(`${md_ui_settreefilter}`,function*(action){
      //https://redux-saga.js.org/docs/recipes/
      try{
        const {payload} = action;
        let delaytime = 0;
        let treefilter = payload;
        if(!!treefilter){
            delaytime = 500;
        }
        yield call(delay, delaytime);
        yield put(ui_settreefilter(payload));
      }
      catch(e){
        console.log(e);
      }
    });
    //serverpush_devicegeo

    //某个设备地理位置发送变化
    yield takeEvery(`${serverpush_devicegeo}`,function*(action){
      //https://redux-saga.js.org/docs/recipes/
      const {payload} = action;
      let deviceitem = payload;
      try{
        g_devices[deviceitem.DeviceId] = deviceitem;
        yield put(devicelistgeochange_distcluster({}));
        yield put(devicelistgeochange_pointsimplifierins({}));
      }
      catch(e){
        console.log(e);
      }
    });

    yield takeEvery(`${serverpush_devicegeo_sz}`,function*(action){
      //https://redux-saga.js.org/docs/recipes/
      const {payload} = action;
      let {list} = payload;
      try{
        _.map(list,(deviceitem)=>{
          g_devices[deviceitem.DeviceId] = deviceitem;
        });
        // console.log(`list:${list.length}`)
        yield put(devicelistgeochange_distcluster({}));
        yield put(devicelistgeochange_pointsimplifierins({}));
      }
      catch(e){
        console.log(e);
      }
    });
    //devicelistgeochange
    yield throttle(1300,`${devicelistgeochange_distcluster}`,function*(action){
      try{
        if(!!distCluster){
          let data = [];
          _.map(g_devices,(item)=>{
            data.push(item);
          });
          distCluster.setDataWithoutClear(data);
          //获取树形结构
          //修改树形结构标题
          //设置树形结构
        }
      }
      catch(e){
        console.log(e);
      }
    });

    yield throttle(1700,`${devicelistgeochange_pointsimplifierins}`,function*(action){
      try{
        if(!!pointSimplifierIns){
          let data = [];
          _.map(g_devices,(item)=>{
            data.push(item);
          });
          pointSimplifierIns.setData(data);
        }
      }
      catch(e){
        console.log(e);
      }
    });

    //devicelistgeochange_geotreemenu
}

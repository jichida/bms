import { createReducer } from 'redux-act';
import {
    carmap_setenableddrawmapflag,
    carmap_setmapcenter,
    carmap_changemarkerstartlatlng,
    carmap_setdragging,
    carmap_setzoomlevel,
    carmap_setstartaddress,
    carmap_setendaddress,
    carmap_resetmap,
    carmap_setcurlocation,

    carmap_setmapinited,
} from '../actions';
import _ from 'lodash';

import L from 'leaflet';

const locz = [0,0];


const initial = {
    carmap: {
        isMapInited:false,
        dragging:false,//是否正在拖动（拖动中避免某些特性可提升性能）
        enabledragging:true,//是否允许拖动
        autozoomenabled:true,//是否自动缩放成合适视图
        zoomlevel:16,//缩放等级
        curlocation:L.latLng(locz[1], locz[0]),//当前位置
        mapcenterlocation:L.latLng(locz[1], locz[0]),//地图中心位置
    },
};

const carmap = createReducer({
    [carmap_setenableddrawmapflag]:(state,payload)=>{
      let enableddrawmapflag = payload;
      return {...state,enableddrawmapflag};
    },
    [carmap_setmapinited]:(state,isMapInited)=>{
      return {...state,isMapInited}
    },
    [carmap_resetmap]:(state,initobj)=> {
        //被行程完成 和 取消叫车后调用,路线不显示,store恢复初始化
        let {isMapInited,mapcenterlocation,curlocation,zoomlevel} = state;
        return {...initial.carmap,isMapInited,mapcenterlocation,curlocation,
            zoomlevel};
    },
    [carmap_setmapcenter]:(state,payload)=>{
      let mapcenterlocation = L.latLng(payload.lat, payload.lng)
      return {...state,mapcenterlocation}
    },
    [carmap_setcurlocation]:(state,curlocation)=>{
        //获取到当前位置,显示在地图上
        curlocation = L.latLng(curlocation.lat, curlocation.lng);
        return {...state,curlocation};
    },
    [carmap_setdragging]:(state,dragging)=>{
        //判断是否正在拖动
        return { ...state, dragging};
    },
    [carmap_setzoomlevel]:(state,zoomlevel)=>{
        //改变地图缩放等级
        let autozoomenabled = false;
        return { ...state, zoomlevel,autozoomenabled };
    },

}, initial.carmap);

export default carmap;

import { createReducer } from 'redux-act';
import{
  querydevice_result,
  ui_selcurdevice_result,
  querydeviceinfo_result,
  mapmain_getdistrictresult,
  mapmain_getdistrictresult_init,
  mapmain_seldistrict,
  ui_changetreestyle,
  ui_settreefilter
} from '../actions';
import _ from 'lodash';
import {getadcodeinfo} from '../util/addressutil';
import {getgroupnamebydevice} from '../test/offlinedata';

const initial = {
  device:{
    treeviewstyle:'byloc',//byloc or bygroup
    treefilter:undefined,
    toggled:true,
    toggledgruop:true,
    mapseldeviceid:undefined,
    mapdeviceidlist:[],
    datatree:{},
    datatreegroup:{},

    curproviceid:undefined,
    curcityid:undefined,
    curdistrictid:undefined,
    curprovicelist:[],
    curcitylist:[],
    curdistrictlist:[],
    curdevicelist:[],

    devices: {
    },
  }
};

const device = createReducer({
  [ui_settreefilter]:(state,payload)=>{
    let treefilter = payload;
    return {...state,treefilter};
  },
  [ui_changetreestyle]:(state,payload)=>{
    const treeviewstyle = payload;
    return {...state,treeviewstyle};
  },
  [ui_selcurdevice_result]:(state,payload)=>{
    const mapseldeviceid = payload.DeviceId;
    // console.log(`mapseldeviceid:${mapseldeviceid},payload:${JSON.stringify(payload)}`);
    let datatree = {...state.datatree};
    let datatreegroup = {...state.datatreegroup};
    let findandsettreenode = (node,mapseldeviceid)=>{
      let retnode = node;
      if(node.name === `${mapseldeviceid}`){
        node.active = true;
        console.log(`node${node.name}==>true`);
        return retnode;
      }
      retnode = null;
      if(!!node.children){
        for(let i = 0; i<node.children.length ;i++){
          const subnode = node.children[i];
          let tmpnode = findandsettreenode(subnode,mapseldeviceid);
          if(!!tmpnode){
            retnode = node;
            retnode.toggled = true;
          }
        }
      }
      node.active = false;
      return retnode;
    }
    findandsettreenode(datatree,mapseldeviceid);
    findandsettreenode(datatreegroup,mapseldeviceid);
    return {...state,mapseldeviceid,datatree,datatreegroup};
  },
  [querydeviceinfo_result]:(state,payload)=>{
    const devicerecord = payload;
    let devices = {...state.devices};
    devices[devicerecord.DeviceId] = devicerecord;
    return {...state,devices};
  },
  [mapmain_seldistrict]:(state,payload)=>{
    const {toggled} = payload;
    return {...state,toggled};
  },
  [mapmain_getdistrictresult_init]:(state,payload)=>{
    let treenode = payload;
    let datatree =  {
        id:treenode.adcode,
        adcode:treenode.adcode,
        loading: false,
        active : false,
        toggled:state.toggled,
        name:treenode.name,
        children:treenode.children
    };
    return {...state,datatree};
  },
  [mapmain_getdistrictresult]:(state,payload)=>{
    let treenode = payload;
    let findandsettreenode = (node,adcode,isroot)=>{
      let retnode = node;
      if(node.adcode === adcode){
        console.log(node);
        return retnode;
      }
      retnode = null;
      if(!!node.children){
        for(let i = 0; i<node.children.length ;i++){
          const subnode = node.children[i];
          let tmpnode = findandsettreenode(subnode,adcode,false);
          if(!!tmpnode){
            if(tmpnode.adcode !== adcode){
              node.toggled = true;
              node.active = false;
              node.loading = false;
            }
            else{//equal
              subnode.toggled = state.toggled;
              subnode.active = true;
              subnode.loading = false;
            }
            retnode = node;
          }
        }
      }
      if(!isroot && !retnode){
        node.active = false;
        node.toggled = false;
        node.loading = true;
      }
      return retnode;
    };
      // let treenode = payload;
     let datatree = {...state.datatree};
     findandsettreenode(datatree,treenode.adcode,true);
     return {...state,datatree};
  },
  [querydevice_result]:(state,payload)=>{
    const {list} = payload;
    // let deviceidlist = [];
    let devices = {};
    _.map(list,(devicerecord)=>{
      //deviceidlist.push(devicerecord.DeviceId);
      devices[devicerecord.DeviceId] = devicerecord;
    });
    let datatreegroup = {
      id:0,
      loading: false,
      active : state.toggledgruop,
      toggled:state.toggledgruop,
      name:`所有分组`,
      children:[]
    };
    const devicesgroups = _.groupBy(list,getgroupnamebydevice);
    _.map(devicesgroups,(csz,ckey)=>{
        let node = {
          id:ckey,
          name:`${ckey}(${csz.length})`,
          children:[]
        };

        _.map(csz,(v,k)=>{
          node.children.push({
            id:`${v.DeviceId}`,
            name:`${v.DeviceId}`,
            toggled:false,
            active:false,
          });
        });

        datatreegroup.children.push(node);
    });
    return {...state,devices,datatreegroup};
  },
}, initial.device);

export default device;

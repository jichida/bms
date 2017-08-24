import { createReducer } from 'redux-act';
import{
  querydevice_result,
  querydevicegroup_result,
  ui_selcurdevice_result,
  querydeviceinfo_result,
  mapmain_getdistrictresult,
  mapmain_getdistrictresult_init,
  devicelistgeochange_geotreemenu_refreshtree,
  mapmain_areamountdevices_result,
  mapmain_seldistrict,
  ui_changetreestyle,
  ui_settreefilter
} from '../actions';
import _ from 'lodash';
import {getadcodeinfo} from '../util/addressutil';
import {getgroupnamebydevice} from '../util/device';
import {get_initgeotree} from '../util/treedata';

const {datatree,gmap_treename,gmap_treecount} = get_initgeotree();
const initial = {
  device:{
    treeviewstyle:'byloc',//byloc or bygroup
    treefilter:undefined,
    toggled:true,
    toggledgruop:true,
    mapseldeviceid:undefined,
    // mapdeviceidlist:[],
    gmap_treename,
    gmap_treecount,
    gmap_devices:{},
    datatreeconst:datatree,
    datatree,
    datatreegroup:{},

    curdevicelist:[],
    groupidlist:[],
    groups:{},
    devices:{},
  }
};

const device = createReducer({
  [ui_settreefilter]:(state,payload)=>{
    let treefilter = {...payload};
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
        console.log(`node${node.name}==>true`);
        return retnode;
      }
      retnode = null;
      if(!!node.children){
        for(let i = 0; i<node.children.length ;i++){
          const subnode = node.children[i];
          let tmpnode = findandsettreenode(subnode,mapseldeviceid);
          if(!!tmpnode){
            if(tmpnode.name === `${mapseldeviceid}`){
              subnode.active = true;
              subnode.loading = false;
            }
            subnode.toggled = true;
            retnode = node;
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
  [devicelistgeochange_geotreemenu_refreshtree]:(state,payload)=>{
    const {g_devices,gmap_devices,gmap_treecount} = payload;
    return {...state,gmap_devices:{...gmap_devices},gmap_treecount:{...gmap_treecount}};
  },
  [mapmain_areamountdevices_result]:(state,payload)=>{
    const {adcode,g_devices,gmap_devices} = payload;
    let datatree = state.datatree;
    let findandsettreenodedevice = (node)=>{
       let retnode = node;
       if(node.adcode === adcode){
         return retnode;
       }
       if(!!node.children){
         for(let i = 0; i<node.children.length ;i++){
           const subnode = node.children[i];
           let tmpnode = findandsettreenodedevice(subnode);
           if(!!tmpnode){
             //<---
             let children = [];
             _.map(gmap_devices[tmpnode.adcode],(deviceid)=>{
               children.push({
                 type:'device',
                 loading:false,
                 name:deviceid,
                 device:g_devices[deviceid]
               });
             });
             tmpnode.children = [...children];
             console.log(`变化的数据[${tmpnode.name}]是:${children.length}`);
           }
         }
       }
       return null;
     }
     findandsettreenodedevice(datatree);
     return {...state,g_devices,datatree,gmap_devices};
  },
  [mapmain_getdistrictresult_init]:(state,payload)=>{
     const {g_devices,gmap_devices,gmap_treecount} = payload;

     let datatree = {...state.datatreeconst};
    //  let findandsettreenodedevice = (node)=>{
    //    let retnode = node;
    //    if(node.type === `group_area`){
    //      return retnode;
    //    }
    //    if(!!node.children){
    //      for(let i = 0; i<node.children.length ;i++){
    //        const subnode = node.children[i];
    //        let tmpnode = findandsettreenodedevice(subnode);
    //        if(!!tmpnode){
    //          //<---
    //          _.map(gmap_devices[tmpnode.adcode],(deviceid)=>{
    //            tmpnode.children.push({
    //              type:'device',
    //              loading:false,
    //              name:deviceid,
    //              device:g_devices[deviceid]
    //            });
    //          });
    //        }
    //      }
    //    }
    //    node.active = false;
    //    return null;
    //  }
    //  findandsettreenodedevice(datatree);
     return {...state,gmap_devices,gmap_treecount,datatree};
  },
  [mapmain_getdistrictresult]:(state,payload)=>{
    let {adcode} = payload;
    let adcodeinfo = getadcodeinfo(adcode);
    let curdevicelist = state.curdevicelist;
    let findandsettreenode = (node,adcode,isroot)=>{
      let retnode = node;
      if(node.adcode === adcode){
        console.log(node);
        if(adcodeinfo.level === 'district'){
          curdevicelist = [...node.children];
        }
        return retnode;
      }
      retnode = null;
      if(!!node.children){
        for(let i = 0; i<node.children.length ;i++){
          const subnode = node.children[i];
          let tmpnode = findandsettreenode(subnode,adcode,false);
          if(!!tmpnode){//subnode为tmpnode,目标选中
            if(tmpnode.adcode === adcode){
              //选中／展开//equal
              subnode.active = true;
              subnode.toggled = state.toggled;
              subnode.loading = false;
            }
            node.active = false;
            node.toggled = true;
            node.loading = false;

            retnode = node;
          }
        }
      }
      if(!isroot && !retnode){
        node.active = false;
        node.toggled = false;
        node.loading = false;
      }
      return retnode;
    };
      // let treenode = payload;
     let datatree = {...state.datatree};
     findandsettreenode(datatree,adcode,true);
     //root保持不动
     datatree.toggled = true;
     datatree.active = false;
     datatree.loading = false;
     return {...state,datatree,curdevicelist};
  },
  [querydevicegroup_result]:(state,payload)=>{
    const {list} = payload;
    let groupidlist = [];
    let groups = {};
    _.map(list,(grouprecord)=>{
      groupidlist.push(grouprecord._id);
      groups[grouprecord._id] = grouprecord;
    });
    return {...state,groups,groupidlist};
  },
  [querydevice_result]:(state,payload)=>{
    const {list} = payload;
    // let mapdeviceidlist = [];
    let devices = {};
    _.map(list,(devicerecord)=>{
      // mapdeviceidlist.push(devicerecord.DeviceId);
      devices[devicerecord.DeviceId] = devicerecord;
    });
    let datatreegroup = {
      id:0,
      loading: false,
      active : state.toggledgruop,
      toggled:state.toggledgruop,
      name:`所有分组`,
      type:'group',
      children:[]
    };
    const devicesgroups = _.groupBy(list,(dev)=>{
      return getgroupnamebydevice(dev)._id;
    });
    _.map(devicesgroups,(csz,ckey)=>{
        let node = {
          id:ckey,
          type:'group',
          name:`${state.groups[ckey].name}(${csz.length})`,
          children:[]
        };

        _.map(csz,(v,k)=>{
          node.children.push({
            type:'device',
            id:`${v.DeviceId}`,
            name:`${v.DeviceId}`,
            device:devices[v.DeviceId],
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

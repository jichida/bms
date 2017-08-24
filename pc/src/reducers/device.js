import { createReducer } from 'redux-act';
import{
  querydevice_result,
  querydevicegroup_result,
  ui_selcurdevice_result,
  querydeviceinfo_result,
  mapmain_getdistrictresult,
  mapmain_init_device,
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

const {datatree,gmap_treename,gmap_acode_treecount} = get_initgeotree();
const initial = {
  device:{
    treeviewstyle:'byloc',//byloc or bygroup
    treefilter:undefined,

    mapseldeviceid:undefined,
    // mapdeviceidlist:[],
    gmap_treename,
    gmap_acode_treecount,
    gmap_acode_devices:{},
    datatreeconst:datatree,
    datatree,
    datatreegroup:{},

    curdevicelist:[],
    groupidlist:[],
    groups:{},
    g_devicesdb:{},
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
    let g_devicesdb = {...state.g_devicesdb};
    g_devicesdb[devicerecord.DeviceId] = devicerecord;
    return {...state,g_devicesdb};
  },

  [devicelistgeochange_geotreemenu_refreshtree]:(state,payload)=>{
    const {g_devicesdb,gmap_acode_devices,gmap_acode_treecount} = payload;
    return {...state,
      g_devicesdb:{...g_devicesdb},
      gmap_acode_devices:{...gmap_acode_devices},gmap_acode_treecount:{...gmap_acode_treecount}};
  },
  [mapmain_areamountdevices_result]:(state,payload)=>{
    const {adcode,g_devicesdb,gmap_acode_devices} = payload;
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
             _.map(gmap_acode_devices[tmpnode.adcode],(deviceid)=>{
               children.push({
                 type:'device',
                 loading:false,
                 name:deviceid,
                 device:g_devicesdb[deviceid]
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
     return {...state,g_devicesdb,datatree,gmap_acode_devices};
  },
  [mapmain_init_device]:(state,payload)=>{
     const {g_devicesdb,gmap_acode_devices,gmap_acode_treecount} = payload;
     let datatree = {...state.datatreeconst};
     return {...state,g_devicesdb,gmap_acode_devices,gmap_acode_treecount,datatree};
  },
  [mapmain_getdistrictresult]:(state,payload)=>{
    let {adcode,forcetoggled} = payload;
    // let adcodeinfo = getadcodeinfo(adcode);
    let curdevicelist = state.curdevicelist;
    let findandsettreenode = (node,adcode)=>{
      let retnode = node;
      if(node.adcode === adcode){
        // console.log(node);
        if(node.type === 'group_area'){
          curdevicelist = [...node.children];
        }
        if(node.type !== 'group_root'){
          return retnode;
        }

      }
      retnode = null;
      if(!!node.children){
        for(let i = 0; i<node.children.length ;i++){
          const subnode = node.children[i];
          let tmpnode = findandsettreenode(subnode,adcode);
          if(!!tmpnode){//subnode为tmpnode,目标选中
            if(tmpnode.adcode === adcode){
              //选中／展开//equal
              subnode.active = true;
              subnode.loading = false;
              if(forcetoggled){//强制展开结点
                subnode.toggled = true;
              }
            }
            node.active = false;
            node.toggled = true;
            node.loading = false;

            retnode = node;
          }
        }
      }
      if(!retnode){
        if(node.type !== 'group_root'){
          node.active = false;
          node.toggled = false;
        }
        node.loading = false;
      }
      return retnode;
    };
      // let treenode = payload;
     let datatree = {...state.datatree};
     findandsettreenode(datatree,adcode);
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
    let g_devicesdb = {};
    _.map(list,(devicerecord)=>{
      // mapdeviceidlist.push(devicerecord.DeviceId);
      g_devicesdb[devicerecord.DeviceId] = devicerecord;
    });
    let datatreegroup = {
      id:0,
      loading: false,
      active :true,
      toggled:true,
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
            device:g_devicesdb[v.DeviceId],
            toggled:false,
            active:false,
          });
        });

        datatreegroup.children.push(node);
    });
    return {...state,g_devicesdb,datatreegroup};
  },
}, initial.device);

export default device;

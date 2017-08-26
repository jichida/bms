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
  mapmain_selgroup,
  ui_changetreestyle,
  ui_settreefilter,
  ui_searchbattery_result
} from '../actions';
import _ from 'lodash';
import {getadcodeinfo} from '../util/addressutil';
import {getgroupnamebydevice} from '../util/device';
import {get_initgeotree} from '../util/treedata';

const {datatree,gmap_acode_treename,gmap_acode_treecount} = get_initgeotree();
const initial = {
  device:{
    treefilter:undefined,

    mapseldeviceid:undefined,//当前选中的设备
    // mapdeviceidlist:[],
    gmap_acode_treename,//key:acode/value:name
    gmap_acode_treecount,//key:acode/value:count
    gmap_acode_devices:{},//key:acode/value:deviceidlist
    datatreeloc:datatree,
    datatreegroup:{
      id:'0',
      loading: false,
      active :true,
      toggled:true,
      name:`所有分组`,
      type:'group_root',
      children:[]
    },
    datatreesearchresult:{
      id:'0',
      loading: false,
      active :true,
      toggled:true,
      name:`搜索结果`,
      type:'group_root',
      children:[]
    },
    groupidlist:[],
    groups:{},
    g_devicesdb:{},
  }
};

const device = createReducer({
  [ui_searchbattery_result]:(state,payload)=>{
    const {devicelist,g_devicesdb} = payload;
    let datatreesearchresult={
      id:'0',
      loading: false,
      active :true,
      toggled:true,
      name:`搜索结果`,
      type:'group_root',
      children:[]
    };
    let children = [];
    _.map(devicelist,(deviceid)=>{
      children.push({
        type:'device',
        loading:false,
        name:deviceid,
        device:g_devicesdb[deviceid]
      });
    });
    datatreesearchresult.children = [...children];
    return {...state,datatreesearchresult,g_devicesdb};
  },
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

    let datatreeloc = {...state.datatreeloc};
    let datatreegroup = {...state.datatreegroup};
    let datatreesearchresult = {...state.datatreesearchresult};
    let findandsettreenode = (node,mapseldeviceid)=>{
      let retnode = node;
      if(node.name === `${mapseldeviceid}`){
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
    findandsettreenode(datatreeloc,mapseldeviceid);
    findandsettreenode(datatreegroup,mapseldeviceid);
    findandsettreenode(datatreesearchresult,mapseldeviceid);
    return {...state,mapseldeviceid,datatreeloc,datatreegroup,datatreesearchresult};
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
    const {adcode,g_devicesdb,gmap_acode_devices,gmap_acode_treecount} = payload;
    let datatreeloc = state.datatreeloc;
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

           }
         }
       }
       return null;
     }
     findandsettreenodedevice(datatreeloc);
     return {...state,g_devicesdb,datatreeloc,gmap_acode_devices,gmap_acode_treecount};
  },
  [mapmain_init_device]:(state,payload)=>{
     const {g_devicesdb,gmap_acode_devices,gmap_acode_treecount} = payload;
     let datatreeloc = {...datatree};
     return {...state,g_devicesdb,gmap_acode_devices,gmap_acode_treecount,datatreeloc};
  },
  [mapmain_getdistrictresult]:(state,payload)=>{
    let {adcode,forcetoggled} = payload;
    //选中某个区域,只列选中的数据
    let findandsettreenode = (node,adcode)=>{
      if(node.adcode === adcode){
        if(node.type !== 'group_root'){
          return node;
        }
      }
      let retnode = null;
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
            retnode = node;
          }//find ok
          else{
            //非自己所属
            subnode.active = false;
            subnode.toggled = false;
          }
        }
      }
      if(!retnode){
        if(node.type !== 'group_root'){
          node.active = false;
          node.toggled = true;
        }
        node.loading = false;
      }
      return retnode;
    };
      // let treenode = payload;
     let datatreeloc = {...state.datatreeloc};
     findandsettreenode(datatreeloc,adcode);
     //root保持不动
     datatreeloc.toggled = true;
     datatreeloc.active = false;
     datatreeloc.loading = false;
     return {...state,datatreeloc};
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
      id:'0',
      loading: false,
      active :true,
      toggled:true,
      name:`所有分组`,
      type:'group_root',
      children:[]
    };
    const devicesgroups = _.groupBy(list,(dev)=>{
      return getgroupnamebydevice(dev)._id;
    });
    _.map(devicesgroups,(csz,ckey)=>{
        let node = {
          id:ckey,
          type:'group_leaf',
          name:`${state.groups[ckey].name}(${csz.length})`,
          children:[],
          toggled:false,
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
  [mapmain_selgroup]:(state,payload)=>{
    let {groupid,forcetoggled} = payload;
    let findandsettreenode = (node,groupid)=>{
      let retnode = node;
      if(node.id === groupid){
        if(node.type !== 'group_root'){
          return retnode;
        }
      }
      retnode = null;
      if(!!node.children){
        for(let i = 0; i<node.children.length ;i++){
          const subnode = node.children[i];
          let tmpnode = findandsettreenode(subnode,groupid);
          if(!!tmpnode){//subnode为tmpnode,目标选中
            if(tmpnode.id === groupid){
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
     let datatreegroup = {...state.datatreegroup};
     findandsettreenode(datatreegroup,groupid);
     //root保持不动
     datatreegroup.toggled = true;
     datatreegroup.active = false;
     datatreegroup.loading = false;
     return {...state,datatreegroup};//这样reducer刷新才能刷新树！！！
  }
}, initial.device);

export default device;

import { createReducer } from 'redux-act';
import{
  querydevice_result,
  ui_selcurdevice,
  querydeviceinfo_result,
  mapmain_getdistrictresult,
  mapmain_seldistrict
} from '../actions';
import _ from 'lodash';

const initial = {
  device:{
    toggled:false,
    mapseldeviceid:undefined,
    mapdeviceidlist:[],
    datatree:[],
    deviceidlist:[],
    selnodeid:100000,
    devices: {
    },
  }
};

const device = createReducer({
  [ui_selcurdevice]:(state,payload)=>{
    const mapseldeviceid = payload.DeviceId;
    return {...state,mapseldeviceid};
  },
  [querydeviceinfo_result]:(state,payload)=>{
    const devicerecord = payload;
    let devices = {...state.devices};
    devices[devicerecord.DeviceId] = devicerecord;
    return {...state,devices};
  },
  [mapmain_seldistrict]:(state,payload)=>{
    const {adcodetop:selnodeid,toggled} = payload;
    return {...state,selnodeid,toggled};
  },
  [mapmain_getdistrictresult]:(state,payload)=>{
      let treenode = payload;
      let datatree = state.datatree;
      if(treenode.adcode === 100000){
        datatree = {
          id:treenode.adcode,
          adcode:treenode.adcode,
          loading: false,
          toggled:state.toggled,
          name:treenode.name,
          children:treenode.children
        };
      }
      else{
        datatree = {...datatree};
        let findandsettreenode = (node,parentnodeid,newnodevalue)=>{
          if(node.adcode === parentnodeid){
            return node;
          }
          if(!!node.children){
            for(let i = 0; i<node.children.length ;i++){
              const subnode = node.children[i];
              let resutnode = findandsettreenode(subnode,parentnodeid,newnodevalue);
              if(!!resutnode){
                node.children[i] = newnodevalue;
                return null;
              }
            }
          }
          return null;
        }
        let selnodeid = state.selnodeid;
        let resutnode = findandsettreenode(datatree,selnodeid,{
          id:treenode.adcode,
          adcode:treenode.adcode,
          loading: false,
          toggled:state.toggled,
          name:treenode.name,
          children:treenode.children
        });
      }
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

    // const Province = _.groupBy(list,'LastHistoryTrack.Province');
    // console.log(Province);
    // let devicedatatree = {};
    // _.map(Province,(psz,pkey)=>{
    //   if(pkey === 'undefined' || !pkey){
    //     pkey = '其他';
    //   }
    //   if(!!pkey){
    //     devicedatatree[pkey] = {};
    //   }
    //
    //   let City = _.groupBy(psz,'LastHistoryTrack.City');
    //   _.map(City,(csz,ckey)=>{
    //     if(ckey === 'undefined' || !ckey){
    //       ckey = '其他';
    //     }
    //     let vsz = [];
    //     _.map(csz,(v,k)=>{
    //       vsz.push(v.DeviceId);
    //     });
    //     devicedatatree[pkey][ckey] = vsz;
    //
    //   });
    // });
    // console.log(devicedatatree);
    // let datatreesz = [];
    // let totalall = 0;
    // _.map(devicedatatree,(psz,pname)=>{
    //   // console.log(`pname:${pname},psz:${JSON.stringify(psz)}`)
    //   let children = [];
    //   let psztotal = 0;
    //   _.map(psz,(csz,cname)=>{
    //     let objnamesz = [];
    //     _.map(csz,(deviceid)=>{
    //       objnamesz.push({name:deviceid});
    //     })
    //     children.push({
    //       name:`${cname}(${csz.length})`,
    //       children:objnamesz
    //     });
    //     psztotal += csz.length;
    //   });
    //   datatreesz.push({
    //     name:`${pname}(${psztotal})`,
    //     children
    //   });
    //   totalall += psztotal;
    // });
    // let datatree =
    //   {
    //       name: `所有设备(${totalall})`,
    //       toggled: true,
    //       children:datatreesz
    //   }
    return {...state,devices};
  },
}, initial.device);

export default device;

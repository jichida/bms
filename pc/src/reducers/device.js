import { createReducer } from 'redux-act';
import{
  querydevice_result,
  ui_selcurdevice_result,
  querydeviceinfo_result,
  mapmain_getdistrictresult,
  mapmain_seldistrict,
  ui_changetreestyle
} from '../actions';
import _ from 'lodash';
import {getadcodeinfo} from '../util/addressutil';
import {getgroupnamebydevice} from '../test/offlinedata';

const initial = {
  device:{
    treeviewstyle:'byloc',//byloc or bygroup

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
  [ui_changetreestyle]:(state,payload)=>{
    const treeviewstyle = payload;
    return {...state,treeviewstyle};
  },
  [ui_selcurdevice_result]:(state,payload)=>{
    const mapseldeviceid = payload.DeviceId;
    console.log(`mapseldeviceid:${mapseldeviceid},payload:${JSON.stringify(payload)}`);
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
  [mapmain_getdistrictresult]:(state,payload)=>{
      let treenode = payload;
      let datatree = state.datatree;

      let curprovicelist = state.curprovicelist;
      let curcitylist = state.curcitylist;
      let curdistrictlist = state.curdistrictlist;
      let curdevicelist = state.curdevicelist;
      let curproviceid= state.curproviceid;
      let curcityid= state.curcityid;
      let curdistrictid= state.curdistrictid;

      if(treenode.adcode === 100000){
        curprovicelist = treenode.children;
        curcitylist = [];
        curdistrictlist = [];
        curdevicelist = [];
        datatree = {
          id:treenode.adcode,
          adcode:treenode.adcode,
          loading: false,
          active : false,
          toggled:state.toggled,
          name:treenode.name,
          children:treenode.children
        };
      }
      else{
        let selnodeid = treenode.adcode;
        _.map(curprovicelist,(provice)=>{
          if(selnodeid === provice.adcode){
            curproviceid = selnodeid;
            curcitylist = treenode.children;

            curcityid = undefined;
            curdistrictid = undefined;

            curdistrictlist = [];
            curdevicelist = [];
          }
        });

        _.map(curcitylist,(city)=>{
          if(selnodeid === city.adcode){
            curcityid = selnodeid;
            curdistrictlist = treenode.children;
            curdistrictid = undefined;
            curdevicelist = [];
            //上海／北京／等特殊
            let adcodeinfo = getadcodeinfo(selnodeid);
            if(adcodeinfo.level === 'district'){
              curdevicelist = curdistrictlist;
            }
          }
        });

        _.map(curdistrictlist,(district)=>{
          if(selnodeid === district.adcode){
            curdistrictid = selnodeid;
            curdevicelist = treenode.children;
          }
        });

        datatree = {...datatree};
        if(!!curproviceid){
          _.map(datatree.children,(childprovice)=>{
            if(childprovice.adcode === curproviceid){
              childprovice.children = curcitylist;
              childprovice.loading = false;
              childprovice.toggled = state.toggled;
              childprovice.active = true;
              if(!!curcityid){
                childprovice.toggled = true;
                childprovice.active = false;
                _.map(childprovice.children,(childcity)=>{
                  if(childcity.adcode === curcityid){
                    childcity.children = curdistrictlist;
                    childcity.loading = false;
                    childcity.toggled = state.toggled;
                    childcity.active = true;
                    if(!!curdistrictid){
                      childcity.active = false;
                      childcity.toggled = true;
                      _.map(childcity.children,(childdistict)=>{
                        if(childdistict.adcode === curdistrictid){
                          childdistict.children = curdevicelist;
                          childdistict.loading = false;
                          childdistict.toggled = state.toggled;
                          childdistict.active = true;
                        }
                        else{
                          childdistict.children = [];
                          childdistict.toggled = false;
                          childdistict.active = false;
                        }
                      });
                    }
                  }
                  else{
                    childcity.children = [];
                    childcity.toggled = false;
                    childcity.active = false;
                  }
                });
              }
            }
            else{
              childprovice.children = [];
              childprovice.toggled = false;
              childprovice.active = false;
            }
          });
        }

      }
      return {
        ...state,
        datatree,
        curprovicelist,
        curcitylist,
        curdistrictlist,
        curdevicelist,
        curproviceid,
        curcityid,
        curdistrictid
      };
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

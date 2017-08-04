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

    curproviceid:undefined,
    curcityid:undefined,
    curdistrictid:undefined,
    curprovicelist:[],
    curcitylist:[],
    curdistrictlist:[],
    curdevicelist:[],

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

      let curprovicelist = state.curprovicelist;
      let curcitylist = state.curcitylist;
      let curdistrictlist = state.curdistrictlist;
      let curdevicelist = state.curdevicelist;
      let curproviceid= state.curproviceid;
      let curcityid= state.curcityid;
      let curdistrictid= state.curdistrictid;

      if(treenode.adcode === 100000){
        curprovicelist = treenode.children;
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
        let selnodeid = state.selnodeid;
        _.map(curprovicelist,(provice)=>{
          if(selnodeid === provice.adcode){
            curproviceid = selnodeid;
            curcitylist = treenode.children;

            curcityid = undefined;
            curdistrictid = undefined;
          }
        });

        _.map(curcitylist,(city)=>{
          if(selnodeid === city.adcode){
            curcityid = selnodeid;
            curdistrictlist = treenode.children;
            curdistrictid = undefined;
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
              if(!!curcityid){
                childprovice.toggled = true;
                _.map(childprovice.children,(childcity)=>{
                  if(childcity.adcode === curcityid){
                    childcity.children = curdistrictlist;
                    childcity.loading = false;
                    childcity.toggled = state.toggled;
                    if(!!curdistrictid){
                      childcity.toggled = true;
                      _.map(childcity.children,(childdistict)=>{
                        if(childdistict.adcode === curdistrictid){
                          childdistict.children = curdevicelist;
                          childdistict.loading = false;
                          childdistict.toggled = state.toggled;
                        }
                        else{
                          childdistict.children = [];
                          childdistict.toggled = false;
                        }
                      });
                    }
                  }
                  else{
                    childcity.children = [];
                    childcity.toggled = false;
                  }
                });
              }
            }
            else{
              childprovice.children = [];
              childprovice.toggled = false;
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

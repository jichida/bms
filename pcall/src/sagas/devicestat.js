import { select,put,takeLatest,} from 'redux-saga/effects';
// import {delay} from 'redux-saga';
import {
  getdevicestatprovinces_result,
  getdevicestatcities_result,
  getdevicestatareas_result,
  mapmain_set_devicestat,
  getdevicestatareadevices_result,
  mapmain_getdistrictresult,
  getdevicestatcities_request,
  getdevicestatareas_request,
  getdevicestatareadevices_request,
  refreshdevice
} from '../actions';
import map from 'lodash.map';
import get from 'lodash.get';
import {getdevicestatus_isonline} from '../util/getdeviceitemstatus';
// import  {
//   getrandom
// } from '../test/bmsdata.js';
const getdevicestate = (state)=>{
  const {datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node} = state.device;
  return {datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node} ;
}

export function* devicestatflow() {
  yield takeLatest(`${getdevicestatprovinces_result}`, function*(action) {
    try{
      let {datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node} = yield select(getdevicestate);
      const provincelist = action.payload;
      const datanodeproviceroot = datatreeloc.children[0];
      gmap_acode_treecount[1] = {//所有
        count_total:0,
        count_online:0,
      };
      gmap_acode_treecount[100000] = {//所有
        count_total:0,
        count_online:0,
      };
      if(datanodeproviceroot.children.length === 0){
        map(provincelist,(province)=>{
          let provinceadcode = parseInt(province.adcode,10);
          let provincenode = {
            provinceadcode,
            adcode:provinceadcode,
            name:province.name,
            loading: false,
            type:'group_province',
            children:[]
          };
          gmap_acode_node[provinceadcode] = provincenode;
          gmap_acode_treename[provinceadcode] = province.name;
          gmap_acode_treecount[provinceadcode] = {
            count_total:province.count_total,
            count_online:province.count_online,
            count_offline:province.count_offline,
          };
          datanodeproviceroot.children.push(provincenode);
          gmap_acode_treecount[1].count_total += province.count_total;
          gmap_acode_treecount[1].count_online += province.count_online;
          gmap_acode_treecount[100000].count_total += province.count_total;
          gmap_acode_treecount[100000].count_online += province.count_online;
        });
        datatreeloc = {...datatreeloc};
        gmap_acode_treecount = {...gmap_acode_treecount};
      }
      else{
        map(provincelist,(province)=>{
          let provinceadcode = parseInt(province.adcode,10);
          gmap_acode_treename[provinceadcode] = province.name;
          gmap_acode_treecount[provinceadcode] = {
            count_total:province.count_total,
            count_online:province.count_online,
            count_offline:province.count_offline,
          };
          gmap_acode_treecount[1].count_total += province.count_total;
          gmap_acode_treecount[1].count_online += province.count_online;
          gmap_acode_treecount[100000].count_total += province.count_total;
          gmap_acode_treecount[100000].count_online += province.count_online;
        });
        gmap_acode_treecount = {...gmap_acode_treecount};
      }
      yield put(mapmain_set_devicestat({datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node}))
    }
    catch(e){
      console.log(e);
    }

  });

  yield takeLatest(`${getdevicestatcities_result}`, function*(action) {
    try{
      let {datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node} = yield select(getdevicestate);
      const provinceadcode = action.payload.adcode;
      const parentnode = datatreeloc.children[0];
      let targetnode;
      if(parentnode.children.length > 0){
        //第一次加载
        for(let i = 0; i< parentnode.children.length ;i++){
          const subnode = parentnode.children[i];
          if(subnode.adcode === provinceadcode){
            console.log(`${subnode.adcode}`);
            targetnode = subnode;
            // break;
          }
          else{
            if(subnode.children.length > 0){
              subnode.children = [];
              subnode.active = false;
              subnode.toggled = false;
              subnode.loading = false;
            }
          }
        }
      }

      if(!!targetnode){
        if(targetnode.children.length === 0){
          const jsondatacities = action.payload.result;
          map(jsondatacities,(city)=>{
              const citynode = {
                provinceadcode:targetnode.adcode,
                cityadcode:parseInt(city.adcode,10),
                adcode:parseInt(city.adcode,10),
                name:city.name,
                loading: false,
                type:'group_city',
                children:[]
              };
              gmap_acode_node[city.adcode] = citynode;
              gmap_acode_treename[city.adcode] = city.name;
              gmap_acode_treecount[city.adcode] = {
                count_total:city.count_total,
                count_online:city.count_online,
                count_offline:city.count_offline,
              };
              //----------
              targetnode.children.push(citynode);

              datatreeloc = {...datatreeloc};
              gmap_acode_treename = {...gmap_acode_treename};
              gmap_acode_treecount = {...gmap_acode_treecount};
          });
        }
      }
      yield put(mapmain_set_devicestat({datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node}));
    }
    catch(e){
      console.log(e);
    }
  });

  yield takeLatest(`${getdevicestatareas_result}`, function*(action) {
    try{
      let {datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node} = yield select(getdevicestate);
      const provinceadcode = action.payload.provinceadcode;
      const cityadcode = action.payload.cityadcode;
      const parentnode = datatreeloc.children[0];
      let targetnode;
      if(parentnode.children.length > 0){
        //第一次加载
        for(let i = 0; i< parentnode.children.length ;i++){
          const subnode = parentnode.children[i];
          if(subnode.adcode === provinceadcode){
            console.log(`${subnode.adcode}`);
            const provincetargetnode = subnode;
            // break;
            for(let j = 0; j< provincetargetnode.children.length ;j++){
              const subnode = provincetargetnode.children[j];
              if(subnode.adcode === cityadcode){
                // debugger;
                targetnode = subnode;
              }
              else{
                if(subnode.children.length > 0){
                  subnode.children = [];
                  subnode.active = false;
                  subnode.toggled = false;
                  subnode.loading = false;
                }
              }
            }
          }
          else{
            if(subnode.children.length > 0){
              subnode.children = [];
              subnode.active = false;
              subnode.toggled = false;
              subnode.loading = false;
            }
          }
        }
      }

      if(!!targetnode){
        if(targetnode.children.length === 0){
          const jsondareas = action.payload.result;
          map(jsondareas,(area)=>{
              const areanode = {
                provinceadcode,
                cityadcode,
                adcode:parseInt(area.adcode,10),
                name:area.name,
                loading: false,
                type:'group_area',
                children:[]
              };
              gmap_acode_node[area.adcode] = areanode;
              gmap_acode_treename[area.adcode] = area.name;
              gmap_acode_treecount[area.adcode] = {
                count_total:area.count_total,
                count_online:area.count_online,
                count_offline:area.count_offline,
              };
              //----------
              targetnode.children.push(areanode);

              datatreeloc = {...datatreeloc};
              gmap_acode_treename = {...gmap_acode_treename};
              gmap_acode_treecount = {...gmap_acode_treecount};
          });
        }
      }
      yield put(mapmain_set_devicestat({datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node}));
    }
    catch(e){
      console.log(e);
    }
  });
  //getdevicestatareadevices_result
  yield takeLatest(`${getdevicestatareadevices_result}`, function*(action) {
    try{
      let {datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node} = yield select(getdevicestate);
      const provinceadcode = action.payload.provinceadcode;
      const cityadcode = action.payload.cityadcode;
      const adcode = action.payload.adcode;//
      debugger;
      const parentnode = datatreeloc.children[0];
      let targetnode;
      if(parentnode.children.length > 0){
        //第一次加载
        for(let i = 0; i< parentnode.children.length ;i++){
          const subnode = parentnode.children[i];
          if(subnode.adcode === provinceadcode){
            console.log(`${subnode.adcode}`);
            const provincetargetnode = subnode;
            // break;
            for(let j = 0; j< provincetargetnode.children.length ;j++){
              const subnode = provincetargetnode.children[j];
              if(subnode.adcode === cityadcode){
                debugger;
                const citytargetnode = subnode;
                for(let k = 0; k< citytargetnode.children.length ;k++){
                  const subnode = citytargetnode.children[k];
                  if(subnode.adcode === adcode){
                    debugger;
                    console.log(subnode)
                    targetnode = subnode;
                  }
                  else{
                    if(subnode.children.length > 0){
                      subnode.children = [];
                      subnode.active = false;
                      subnode.toggled = false;
                      subnode.loading = false;
                    }
                  }
                }
              }
              else{
                if(subnode.children.length > 0){
                  subnode.children = [];
                  subnode.active = false;
                  subnode.toggled = false;
                  subnode.loading = false;
                }
              }
            }
          }
          else{
            if(subnode.children.length > 0){
              subnode.children = [];
              subnode.active = false;
              subnode.toggled = false;
              subnode.loading = false;
            }
          }
        }
      }
      console.log(targetnode);
      if(!!targetnode){
        if(targetnode.children.length === 0){
          const jsonddevices = action.payload.result;
          map(jsonddevices,(device)=>{
            debugger;
            // adcode: "640324"
            // city: "吴忠市"
            // citycode: "0953"
            // deviceid:
            // DeviceId: "1848230175"
            // last_GPSTime: "2019-01-22 11:29:02"
            // last_Latitude: 36.942943
            // last_Longitude: 105.946309
            // _id: "5c18b4844e5a37ed023949da"

              const devicenode = {
                provinceadcode,
                cityadcode,
                id:get(device,`deviceid._id`),
                name:get(device,`deviceid.DeviceId`),
                device:device.deviceid,
                loading: false,
                type:'device',
                children:[]
              };
              // gmap_acode_node[area.adcode] = areanode;
              // gmap_acode_treename[area.adcode] = area.name;
              // gmap_acode_treecount[area.adcode] = {
              //   count_total:area.count_total,
              //   count_online:area.count_online,
              //   count_offline:area.count_offline,
              // };
              // //----------
              targetnode.children.push(devicenode);
              //
              datatreeloc = {...datatreeloc};
              // gmap_acode_treename = {...gmap_acode_treename};
              // gmap_acode_treecount = {...gmap_acode_treecount};
          });
        }
      }
      yield put(mapmain_set_devicestat({datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node}));
    }
    catch(e){
      console.log(e);
    }
  });

  yield takeLatest(`${refreshdevice}`, function*(action) {
    try{
      let {datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node} = yield select(getdevicestate);
      const {g_devicesdb,SettingOfflineMinutes} = action.payload;

      let count_total_all = 0;
      let count_total_all_online = 0;
      let count_total_loc = 0;
      let count_total_loc_online = 0;
      let count_total_noloc = 0;
      let count_total_noloc_online = 0;

      map(g_devicesdb,(deviceitem)=>{
        if(!!deviceitem.DeviceId){
          if(!!deviceitem.locz){
            count_total_all++;
            count_total_loc++;
            if(getdevicestatus_isonline(deviceitem,SettingOfflineMinutes)){
              count_total_all_online++;
              count_total_loc_online++;
            }
          }
          else{
            count_total_all++;
            count_total_noloc++;
            if(getdevicestatus_isonline(deviceitem,SettingOfflineMinutes)){
              count_total_noloc_online++;
              count_total_noloc_online++;
            }
          }
        }
      });

      //<----
      // const alllocnode = datatreeloc.children[0];//全国
      // const allnolocnode = datatreeloc.children[1];//未定位

      gmap_acode_treecount[1] = {//所有
        count_total:count_total_all,
        count_online:count_total_all_online,
      };

      gmap_acode_treecount[2] = {//未定位
        count_total:count_total_noloc,
        count_online:count_total_noloc_online,
      }

      gmap_acode_treecount[100000] = {
        count_total:count_total_loc,
        count_online:count_total_loc_online,
      }
      gmap_acode_treecount = {...gmap_acode_treecount};
      yield put(mapmain_set_devicestat({datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node}));
    }
    catch(e){
      console.log(e);
    }

  });

  const getAddress = (adcode,type)=>{
    let rate = 10000;
    if(type==='province'){
      rate = 10000;
    }
    if(type==='city'){
       rate = 100;
    }
    let address = adcode;
    if(typeof address === 'string'){
      address = parseInt(address,10);
    }
    const addressnew = Math.floor(address/rate);
    const retv = addressnew*rate;
    return parseInt(retv,10);
  }
  //mapmain_getdistrictresult
  yield takeLatest(`${mapmain_getdistrictresult}`, function*(action) {
    try{
      const {adcodetop,forcetoggled,src,name,level} = action.payload;
      if(level === "province"){
        //<-----//{adcode: 640000, name: "宁夏回族自治区", loading: false, type: "group_province"
        yield put(getdevicestatcities_request({name:name,adcode:adcodetop}));
      }
      else if(level === 'city'){
        const provinceadcode = getAddress(adcodetop,'province');
        const cityadcode= getAddress(adcodetop,'city');
        yield put(getdevicestatareas_request({provinceadcode,cityadcode,adcode:adcodetop}));
      }
      else if(level === 'district'){
        //getdevicestatareadevices_result
        const provinceadcode = getAddress(adcodetop,'province');
        debugger;
        const cityadcode= getAddress(adcodetop,'city');
        yield put(getdevicestatareadevices_request({provinceadcode,
          cityadcode,adcode:adcodetop}));

      }
    }
    catch(e){

    }
  });
}

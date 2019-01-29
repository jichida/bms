import { select,put,takeLatest,takeEvery,call,fork,join} from 'redux-saga/effects';
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
  refreshdevice_seldevice,
  refreshdevice_mountdevice,
  refreshdevice,
  refreshdevice_treecount,
  queryamaptree
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

const amapgettree = ()=>{
  return new Promise((resolve,reject) => {
    window.AMap.plugin('AMap.DistrictSearch',  ()=> {
      const districtSearch = new window.AMap.DistrictSearch({
        // 关键字对应的行政区级别，country表示国家
        level: 'country',
        //  显示下级行政区级数，1表示返回下一级行政区
        subdistrict: 3
      });
      // 搜索所有省/直辖市信息
     districtSearch.search('中国', (status, result)=> {
       // 查询成功时，result即为对应的行政区信息
       resolve(result);
     });
   });
  });
}



export function* devicestatflow() {
  yield takeLatest(`${queryamaptree}`, function*(action) {
    try{
      // debugger;
      const result  = yield call(amapgettree);

      let forkhandles_province = [];
      let forkhandles_city = [];
      let forkhandles_area = [];

      let forkfn_city = [];
      let forkfn_area = [];

      let provincelist = [];
      const provincelist_districtList = get(result,`districtList[0].districtList`,[]);
      for(let i = 0;i < provincelist_districtList.length; i++){
        //所有省
        if(provincelist_districtList[i].level === "province"){
          provincelist.push({
            adcode:parseInt(provincelist_districtList[i].adcode,10),
            name:provincelist_districtList[i].name,
            count_total:0,
            count_online:0,
            count_offline:0
          });
        }

        //所有市
        let citylist = [];
        const citylist_districtList = get(provincelist_districtList[i],`districtList`,[]);
        for(let j=0;j<citylist_districtList.length;j++){
          if(citylist_districtList[j].level === "city"){
            citylist.push({
              provinceadcode:parseInt(provincelist_districtList[i].adcode,10),
              cityadcode:parseInt(citylist_districtList[j].adcode,10),
              adcode:parseInt(citylist_districtList[j].adcode,10),
              name:citylist_districtList[j].name,
              count_total:0,
              count_online:0,
              count_offline:0
            });
          }
          let arealist = [];
          const arealist_districtList = get(citylist_districtList[j],`districtList`,[]);
          for(let k = 0; k< arealist_districtList.length;k++){
            if(arealist_districtList[k].level === "district"){
              arealist.push({
                provinceadcode:parseInt(provincelist_districtList[i].adcode,10),
                cityadcode:parseInt(citylist_districtList[j].adcode,10),
                adcode:parseInt(arealist_districtList[k].adcode,10),
                name:arealist_districtList[k].name,
                count_total:0,
                count_online:0,
                count_offline:0
              });
            }
          }//end for
          const fnf = function*(){
              const handlefork = yield fork(function*({arealist,provinceadcode,cityadcode}){
                // console.log(arealist);
                // debugger;
                if(arealist.length > 0){
                  yield put(getdevicestatareas_result({provinceadcode,cityadcode,result:arealist}));
                }

              },{arealist,provinceadcode:parseInt(provincelist_districtList[i].adcode,10),
              cityadcode:parseInt(citylist_districtList[j].adcode,10)});

              forkhandles_area.push(handlefork);
          }
          forkfn_area.push(fnf);
        }//end for

        const fnf = function*(){
          const handlefork = yield fork(function*({citylist,provinceadcode}){
            // console.log(citylist);
            // debugger;
            if(citylist.length > 0){
              yield put(getdevicestatcities_result({provinceadcode,result:citylist}));
            }

          },{citylist,provinceadcode:parseInt(provincelist_districtList[i].adcode,10)});
          forkhandles_city.push(handlefork);
        };
        forkfn_city.push(fnf);
      }//end for

      const handlefork = yield fork(function*(provincelist){
        // debugger;
        // console.log(provincelist);
        if(provincelist.length > 0){
          yield put(getdevicestatprovinces_result(provincelist));
        }
      },provincelist);
      forkhandles_province.push(handlefork);

      if(forkhandles_province.length > 0){
        yield join(...forkhandles_province);
      }

      for(let i = 0 ;i < forkfn_city.length;i++){
        yield forkfn_city[i]();
      }
      if(forkhandles_city.length > 0){
        yield join(...forkhandles_city);
      }

      for(let i = 0 ;i < forkfn_area.length;i++){
        yield forkfn_area[i]();
      }

      if(forkhandles_area.length > 0){
        yield join(...forkhandles_area);
      }
      console.log(`load tree finished!!!${forkhandles_province.length},${forkhandles_city.length},${forkhandles_area.length}`);
      let {datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node} = yield select(getdevicestate);
      console.log(datatreeloc);
      // console.log(gmap_acode_treename);
      // console.log(gmap_acode_treecount);
      // console.log(gmap_acode_node);
//       districtList: Array(1)
// 0:
// adcode: "100000"
// center: c {P: 39.915085, O: 116.3683244, lng: 116.368324, lat: 39.915085}
// citycode: []
// districtList: Array(34)
// 0:
// adcode: "410000"
// center: c {P: 34.757975, O: 113.665412, lng: 113.665412, lat: 34.757975}
// citycode: []
// districtList: Array(18)
// 0:
// adcode: "410900"
// center: c {P: 35.768234, O: 115.04129899999998, lng: 115.041299, lat: 35.768234}
// citycode: "0393"
// districtList: Array(6)
// 0:
// adcode: "410923"
// center: c {P: 36.075204, O: 115.20433600000001, lng: 115.204336, lat: 36.075204}
// citycode: "0393"
// level: "district"
// name: "南乐县"
// __proto__: Obj
    }
    catch(e){
      console.log(e);
    }
  });
  yield takeEvery(`${getdevicestatprovinces_result}`, function*(action) {
    try{
      let {datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node} = yield select(getdevicestate);
      const provincelist = action.payload;
      // console.log(provincelist);
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
      yield put.resolve(mapmain_set_devicestat({datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node}))
      // console.log(`load provincelist finished!`)
    }
    catch(e){
      console.log(e);
    }

  });

  yield takeEvery(`${getdevicestatcities_result}`, function*(action) {
    try{
      let {datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node} = yield select(getdevicestate);
      const provinceadcode = action.payload.provinceadcode;
      // console.log(action.payload)
      const parentnode = datatreeloc.children[0];
      let targetnode;
      if(parentnode.children.length > 0){
        //第一次加载
        for(let i = 0; i< parentnode.children.length ;i++){
          const subnode = parentnode.children[i];
          if(subnode.adcode === provinceadcode){
            // console.log(`${subnode.adcode}`);
            targetnode = subnode;
            // break;
          }
          else{
            if(subnode.children.length > 0){
              // subnode.children = [];
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
      yield put.resolve(mapmain_set_devicestat({datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node}));
      // console.log(`load citylist finished!,${provinceadcode}`)
    }
    catch(e){
      console.log(e);
    }
  });

  yield takeEvery(`${getdevicestatareas_result}`, function*(action) {
    try{
      let {datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node} = yield select(getdevicestate);
      // console.log(action.payload)
      const provinceadcode = action.payload.provinceadcode;
      const cityadcode = action.payload.cityadcode;
      const parentnode = datatreeloc.children[0];
      let targetnode;
      if(parentnode.children.length > 0){
        //第一次加载
        for(let i = 0; i< parentnode.children.length ;i++){
          const subnode = parentnode.children[i];
          if(subnode.adcode === provinceadcode){
            // console.log(`${subnode.adcode}`);
            const provincetargetnode = subnode;
            // break;
            for(let j = 0; j< provincetargetnode.children.length ;j++){
              const subnode2 = provincetargetnode.children[j];
              if(subnode2.adcode === cityadcode){
                // debugger;
                targetnode = subnode2;
              }
              else{
                if(subnode2.children.length > 0){
                  // subnode.children = [];
                  subnode2.active = false;
                  subnode2.toggled = false;
                  subnode2.loading = false;
                }
              }
            }
          }
          else{
            if(subnode.children.length > 0){
              // subnode.children = [];
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
      // console.log(`load arealist finished!,${cityadcode}`)
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
      // debugger;
      const parentnode = datatreeloc.children[0];
      let targetnode;
      if(parentnode.children.length > 0){
        //第一次加载
        for(let i = 0; i< parentnode.children.length ;i++){
          const subnode = parentnode.children[i];
          if(subnode.adcode === provinceadcode){
            // console.log(`${subnode.adcode}`);
            const provincetargetnode = subnode;
            // break;
            for(let j = 0; j< provincetargetnode.children.length ;j++){
              const subnode2 = provincetargetnode.children[j];
              if(subnode2.adcode === cityadcode){
                // debugger;
                const citytargetnode = subnode2;
                for(let k = 0; k< citytargetnode.children.length ;k++){
                  const subnode3 = citytargetnode.children[k];
                  if(subnode3.adcode === adcode){
                    // debugger;
                    // console.log(subnode)
                    targetnode = subnode3;
                  }
                  else{
                    if(subnode3.children.length > 0){
                      // subnode.children = [];
                      subnode3.active = false;
                      subnode3.toggled = false;
                      subnode3.loading = false;
                    }
                  }
                }
              }
              else{
                if(subnode2.children.length > 0){
                  // subnode.children = [];
                  subnode2.active = false;
                  subnode2.toggled = false;
                  subnode2.loading = false;
                }
              }
            }
          }
          else{
            if(subnode.children.length > 0){
              // subnode.children = [];
              subnode.active = false;
              subnode.toggled = false;
              subnode.loading = false;
            }
          }
        }
      }
      // console.log(targetnode);
      if(!!targetnode){
        targetnode.children = [];
        if(targetnode.children.length === 0){
          const jsonddevices = action.payload.result;
          map(jsonddevices,(device)=>{
            // debugger;
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
                id:get(device,`_id`),
                name:get(device,`DeviceId`),
                device:device,
                loading: false,
                type:'device',
                // children:[]
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
    //仅选择树节点
    try{
      const {adcodetop,forcetoggled,src,name,level} = action.payload;
      let {datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node} = yield select(getdevicestate);
      console.log(datatreeloc);
      let provinceadcode = '';
      let cityadcode = '';
      let areaadcode = '';
      if(level === "province"){
        provinceadcode = adcodetop;
      }
      else if(level === 'city'){
         provinceadcode = getAddress(adcodetop,'province');
         cityadcode= getAddress(adcodetop,'city');
      }
      else if(level === 'district'){
        //getdevicestatareadevices_result
         provinceadcode = getAddress(adcodetop,'province');
         cityadcode= getAddress(adcodetop,'city');
         areaadcode = adcodetop;
      }

      const parentnode = datatreeloc.children[0];
      if(parentnode.children.length > 0){
        //第一次加载
        for(let i = 0; i< parentnode.children.length ;i++){
          const subnode = parentnode.children[i];
          if(subnode.adcode === provinceadcode){
            subnode.active = true;
            subnode.toggled = true;
            subnode.loading = false;
            // console.log(`${subnode.adcode}`);
            const provincetargetnode = subnode;
            // break;
            for(let j = 0; j< provincetargetnode.children.length ;j++){
              const subnode2 = provincetargetnode.children[j];
              if(subnode2.adcode === cityadcode){
                subnode2.active = true;
                subnode2.toggled = true;
                subnode2.loading = false;

                const citytargetnode = subnode2;
                for(let k = 0; k< citytargetnode.children.length ;k++){
                  const subnode3 = citytargetnode.children[k];
                  if(subnode3.adcode === areaadcode){
                    subnode3.active = true;
                    subnode3.toggled = true;
                    subnode3.loading = false;
                  }
                  else{

                      // subnode.children = [];
                      subnode3.active = false;
                      subnode3.toggled = false;
                      subnode3.loading = false;

                  }
                }
              }
              else{
                if(subnode2.children.length>0){
                  // subnode.children = [];
                  subnode2.active = false;
                  subnode2.toggled = false;
                  subnode2.loading = false;
                }

              }
            }
          }
          else{
              if(subnode.children.length>0){
                // subnode.children = [];
                subnode.active = false;
                subnode.toggled = false;
                subnode.loading = false;
              }

          }
        }
      }

      datatreeloc = {...datatreeloc};
      yield put(mapmain_set_devicestat({datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node}));

      // if(level === "province"){
      //   //<-----//{adcode: 640000, name: "宁夏回族自治区", loading: false, type: "group_province"
      //   // yield put(getdevicestatcities_request({name:name,adcode:adcodetop}));
      // }
      // else if(level === 'city'){
      //   // const provinceadcode = getAddress(adcodetop,'province');
      //   // const cityadcode= getAddress(adcodetop,'city');
      //   // yield put(getdevicestatareas_request({provinceadcode,cityadcode,adcode:adcodetop}));
      // }
      // else if(level === 'district'){
      //   //getdevicestatareadevices_result
      //   // const provinceadcode = getAddress(adcodetop,'province');
      //   // // debugger;
      //   // const cityadcode= getAddress(adcodetop,'city');
      //   // yield put(getdevicestatareadevices_request({provinceadcode,
      //   //   cityadcode,adcode:adcodetop}));
      //   //
      // }
    }
    catch(e){

    }
  });

  //refreshdevice_treecount
  yield takeLatest(`${refreshdevice_treecount}`, function*(action) {
    try{
      let {datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node} = yield select(getdevicestate);
      const {gmap_acode_treecount:gmap_acode_treecount_new} = action.payload;
      gmap_acode_treecount = {...gmap_acode_treecount,...gmap_acode_treecount_new};
      console.log(gmap_acode_treecount);
      yield put(mapmain_set_devicestat({datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node}));
    }
    catch(e){
      console.log(e);
    }
  });

  //refreshdevice_mountdevice
  yield takeLatest(`${refreshdevice_mountdevice}`, function*(action) {
    try{
      const {g_devicesdb,deviceids,adcodetop} = action.payload;
      const provinceadcode = getAddress(adcodetop,'province');
      const cityadcode= getAddress(adcodetop,'city');
      const adcode = adcodetop;
      let result = [];
      for(let i=0;i<deviceids.length;i++ ){
        result.push(g_devicesdb[deviceids[i]]);
      }
      yield put(getdevicestatareadevices_result({provinceadcode,cityadcode,adcode,result}));
      //      const provinceadcode = action.payload.provinceadcode;
      //       const cityadcode = action.payload.cityadcode;
      //       const adcode = action.payload.adcode;//
      // let {datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node} = yield select(getdevicestate);
      // const {deviceids,adcodetop} = action.payload;
    }
    catch(e){
      console.log(e);
    }
  });

  //refreshdevice_seldevice
  yield takeLatest(`${refreshdevice_seldevice}`, function*(action) {
    try{
      let {datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node} = yield select(getdevicestate);
      const {adcodetop,DeviceId} = action.payload;
      //getdevicestatareadevices_result
       const provinceadcode = getAddress(adcodetop,'province');
       const cityadcode= getAddress(adcodetop,'city');
       const areaadcode = adcodetop;

      // debugger;
      const parentnode = datatreeloc.children[0];
      let targetnode;
      if(parentnode.children.length > 0){
        //第一次加载
        for(let i = 0; i< parentnode.children.length ;i++){
          const subnode = parentnode.children[i];
          if(subnode.adcode === provinceadcode){
            // console.log(`${subnode.adcode}`);
            const provincetargetnode = subnode;
            // break;
            for(let j = 0; j< provincetargetnode.children.length ;j++){
              const subnode2 = provincetargetnode.children[j];
              if(subnode2.adcode === cityadcode){
                // debugger;
                const citytargetnode = subnode2;
                for(let k = 0; k< citytargetnode.children.length ;k++){
                  const subnode3 = citytargetnode.children[k];
                  if(subnode3.adcode === areaadcode){
                    targetnode = subnode3;
                  }
                  else{
                    if(subnode3.children.length > 0){
                      // subnode.children = [];
                      subnode3.active = false;
                      subnode3.toggled = false;
                      subnode3.loading = false;
                    }
                  }
                }
              }
              else{
                if(subnode2.children.length > 0){
                  // subnode.children = [];
                  subnode2.active = false;
                  subnode2.toggled = false;
                  subnode2.loading = false;
                }
              }
            }
          }
          else{
            if(subnode.children.length > 0){
              // subnode.children = [];
              subnode.active = false;
              subnode.toggled = false;
              subnode.loading = false;
            }
          }
        }
      }
      // console.log(targetnode);
      if(!!targetnode){
          for(let i = 0;  i < targetnode.children.length ; i++){
            const subnode4 = targetnode.children[i];
            if(subnode4.name === `${DeviceId}`){
              subnode4.active = true;
            }
            else{
              subnode4.active = false;
            }
        }
        datatreeloc = {...datatreeloc};
        yield put(mapmain_set_devicestat({datatreeloc,gmap_acode_treename,gmap_acode_treecount,gmap_acode_node}));
      }
    }
    catch(e){
      console.log(e);
    }
  });
}

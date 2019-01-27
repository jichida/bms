import { select,put,takeLatest,} from 'redux-saga/effects';
// import {delay} from 'redux-saga';
import {
  getdevicestatprovinces_result,
  getdevicestatcities_result,
  mapmain_set_devicestat
} from '../actions';
import map from 'lodash.map';
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
          let provincecode = parseInt(province.adcode,10);
          let provincenode = {
            adcode:provincecode,
            name:province.name,
            loading: false,
            type:'group_province',
            children:[]
          };
          gmap_acode_node[provincecode] = provincenode;
          gmap_acode_treename[provincecode] = province.name;
          gmap_acode_treecount[provincecode] = {
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
          let provincecode = parseInt(province.adcode,10);
          gmap_acode_treename[provincecode] = province.name;
          gmap_acode_treecount[provincecode] = {
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
            break;
          }
        }
      }

      if(!!targetnode){
        if(targetnode.children.length === 0){
          const jsondatacities = action.payload.result;
          map(jsondatacities,(city)=>{
              const citynode = {
                citycode:city.citycode,
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

}

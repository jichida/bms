import async from 'async';
import coordtransform from 'coordtransform';
import _ from 'lodash';
//转换数据,批量转换所有数据
export const getgeodatabatch =(devicelist)=> {
  return new Promise((resolve,reject) => {
    let resultdevicelist = [];
    _.map(devicelist,(deviceitem)=>{
      let isget = true;
      const LastHistoryTrack = deviceitem.LastHistoryTrack;
      if (!LastHistoryTrack) {
          isget = false;
      }
      else{
        if(LastHistoryTrack.Latitude === 0 || LastHistoryTrack.Longitude === 0){
          isget = false;
        }
      }
      if(isget){
        let cor = [LastHistoryTrack.Longitude,LastHistoryTrack.Latitude];
        const wgs84togcj02=coordtransform.wgs84togcj02(cor[0],cor[1]);
        //let keygeo = `${wgs84togcj02[0]},${wgs84togcj02[1]}`;
        deviceitem.locz = wgs84togcj02;
      }
      resultdevicelist.push(deviceitem);
    });
    //console.log(`mapgeo:${JSON.stringify(mapgeo)}`);
    //console.log(`resultdevicelist:${JSON.stringify(resultdevicelist)}`);
    resolve(resultdevicelist);
  });
};

export const getgeodata =(deviceitem)=>{
  return new Promise((resolve,reject) => {
    console.log(`${JSON.stringify(deviceitem)}`);
    const geocoder = new window.AMap.Geocoder({
            radius: 1000,
        });
    const lnglatXY=deviceitem.locz;//[116.396574, 39.992706];//地图上所标点的坐标
    geocoder.getAddress(lnglatXY, function(status, result) {
        if (status === 'complete' && result.info === 'OK') {
           //获得了有效的地址信息:
           //即，result.regeocode.formattedAddress
           let georesult = result.regeocode;
           let addressComponent = georesult.addressComponent;
           let resultobj = {
             adcode:addressComponent.adcode,
             city:addressComponent.city,
             province:addressComponent.province,
             district:addressComponent.district,
             formattedAddress:georesult.formattedAddress
           };
           console.log(`获取到地理信息位置:${JSON.stringify(resultobj)}`);
           resolve(resultobj);
        }else{
           //获取地址失败
           reject(status);
        }
    });
  });
}

export const getgeodatabatch2 =(devicelist)=> {
  return new Promise((resolve,reject) => {
    const geocoder = new window.AMap.Geocoder({
            radius: 1000,
            batch:true,
        });
    let i = 0;
    let parallelfunsz = [];
    let resultdevicelist = [];
    let mapgeo = {};
    let lnglatXYsz = [];
    let mapsz = [];

    //每20个获取一个坐标数组
    _.map(devicelist,(deviceitem)=>{
      let isget = true;
      const LastHistoryTrack = deviceitem.LastHistoryTrack;
      if (!LastHistoryTrack) {
          isget = false;
      }
      else{
        if(LastHistoryTrack.Latitude === 0 || LastHistoryTrack.Longitude === 0){
          isget = false;
        }
      }

      if(isget){
        let cor = [LastHistoryTrack.Longitude,LastHistoryTrack.Latitude];
        const wgs84togcj02=coordtransform.wgs84togcj02(cor[0],cor[1]);
        lnglatXYsz.push(wgs84togcj02);
      }

      if(lnglatXYsz.length>19 || i===devicelist.length -1 ){
        //last one
        mapsz.push(lnglatXYsz);
        lnglatXYsz = [];
      }
      i++;
    });

    //console.log(`数组的数组:${JSON.stringify(mapsz)}`);
    //设置并发
    _.map(mapsz,(mapxy)=>{
      //console.log(`mapxy==>:${JSON.stringify(mapxy)}`);
      parallelfunsz.push((callbackfn)=>{
        let mapxyobj = _.map(mapxy, _.clone);
        //console.log(`mapxyobj==>:${JSON.stringify(mapxyobj)}`);
        //console.log(`mapxy==>:${JSON.stringify(mapxy)}`);
        geocoder.getAddress(mapxyobj, (status, result)=> {
             if (status === 'complete' && result.info === 'OK') {
               if(!!result.regeocodes){
                 _.map(result.regeocodes,(georesult,index)=>{
                   if(!!georesult){
                     let addressComponent = georesult.addressComponent;
                     if(!!addressComponent){
                       //console.log(`mapxy in==>:${JSON.stringify(mapxy)}`);
                       mapgeo[`${mapxy[index][0]},${mapxy[index][1]}`] = {
                         adcode:addressComponent.adcode,
                         city:addressComponent.city,
                         province:addressComponent.province,
                         district:addressComponent.district,
                         formattedAddress:georesult.formattedAddress
                       };
                     }
                   }
                 });
               }
               callbackfn(null,true);
             }
         });
      });
    });

    //获取所有结果
    async.parallel(parallelfunsz,(err,result)=>{
      _.map(devicelist,(deviceitem)=>{
        let isget = true;
        const LastHistoryTrack = deviceitem.LastHistoryTrack;
        if (!LastHistoryTrack) {
            isget = false;
        }
        else{
          if(LastHistoryTrack.Latitude === 0 || LastHistoryTrack.Longitude === 0){
            isget = false;
          }
        }
        if(isget){
          let cor = [LastHistoryTrack.Longitude,LastHistoryTrack.Latitude];
          const wgs84togcj02=coordtransform.wgs84togcj02(cor[0],cor[1]);
          let keygeo = `${wgs84togcj02[0]},${wgs84togcj02[1]}`;
          deviceitem.address = mapgeo[keygeo];
          deviceitem.locz = wgs84togcj02;
        }
        resultdevicelist.push(deviceitem);
      });
      //console.log(`mapgeo:${JSON.stringify(mapgeo)}`);
      //console.log(`resultdevicelist:${JSON.stringify(resultdevicelist)}`);
      resolve(resultdevicelist);
    });
  });
}

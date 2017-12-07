const request = require("request");
const _ = require('lodash');

const key = "604128e90f0f7ca695c811e7ccf5d6f0";

const get_allgeos = (callback)=>{
  const options = {
     method: 'GET',
     url: `http://restapi.amap.com/v3/config/district?key=${key}&subdistrict=3&keywords=100000`,
     headers:
      {
        'content-type': 'application/json',
         'accept': 'application/json'
      }
    };
   request(options, function (error, response, body) {
       if (!!error) {
         callback(error,null);
         return;
       };

       try{
         let resultobj = body;
         if(typeof resultobj === 'string'){
             resultobj= JSON.parse(body);
         }

         let result_geo = [];
         if(resultobj.status == 1){
           let provinces = [];
           _.map(resultobj.districts[0].districts,(result_provice)=>{
            //provinces.push(provice);
            _.map(result_provice.districts,(result_city)=>{
              if(result_city.level === 'district' || result_city.districts.length === 0){
                result_geo.push({
                  provice_adcode:result_provice.adcode,
                  provice_name:result_provice.name,
                  adcode:result_city.adcode,
                  name:result_city.name,
                  level:result_city.level
                });
              }
              else{
                _.map(result_city.districts,(result_district)=>{
                  result_geo.push({
                    provice_adcode:result_provice.adcode,
                    provice_name:result_provice.name,
                    city_adcode:result_city.adcode,
                    city_name:result_city.name,
                    adcode:result_district.adcode,
                    name:result_district.name,
                    level:result_district.level
                  });
                });
              }
            });
           });
           callback(null,result_geo);
          //  console.log(`输出结果:${JSON.stringify(result_geo)}`);
        }
       }
       catch(e){
         console.log(`返回结果e:${JSON.stringify(e)}`);
       }
   });
}
//
// const get_provices = (callback)=>{
//   const options = {
//      method: 'GET',
//      url: `http://restapi.amap.com/v3/config/district?key=${key}&subdistrict=1&keywords=100000`,
//      headers:
//       {
//         'content-type': 'application/json',
//          'accept': 'application/json'
//       }
//     };
//    request(options, function (error, response, body) {
//      if (error) throw new Error(error);
//
//        try{
//          let resultobj = body;
//          if(typeof resultobj === 'string'){
//              resultobj= JSON.parse(body);
//          }
//         //  console.log(`resultobj:${JSON.stringify(resultobj)}`);
//          if(resultobj.status == 1){
//            let provinces = [];
//            _.map(resultobj.districts[0].districts,(district)=>{
//              let provice = {
//                adcode:district.adcode,
//                name:district.name,
//                level:district.level,
//              };
//              provinces.push(provice);
//            });
//            callback(null,provinces);
//          }
//
//        }
//        catch(e){
//          console.log(`返回结果e:${JSON.stringify(e)}`);
//        }
//    });
// }
//
// const get_cities = (provice,callback)=>{
//   console.log(`get_cities 输入参数:${JSON.stringify(provice)}`);
//   const options = {
//      method: 'GET',
//      url: `http://restapi.amap.com/v3/config/district?key=${key}&subdistrict=1&level=province&keywords=${provice.adcode}`,
//      headers:
//       {
//         'content-type': 'application/json',
//          'accept': 'application/json'
//       }
//     };
//    request(options, function (error, response, body) {
//      if (error) throw new Error(error);
//
//        try{
//          let resultobj = body;
//          if(typeof resultobj === 'string'){
//              resultobj= JSON.parse(body);
//          }
//         //  console.log(`get_cities resultobj:${JSON.stringify(resultobj)}`);
//          if(resultobj.status == 1){
//            let cities = [];
//            _.map(resultobj.districts[0].districts,(district)=>{
//              cities.push({
//                provice_adcode:provice.adcode,
//                provice_name:provice.name,
//                adcode:district.adcode,
//                name:district.name,
//                level:district.level,
//              });
//            });
//            callback(null,cities);
//          }
//
//        }
//        catch(e){
//          console.log(`返回结果e:${JSON.stringify(e)}`);
//        }
//    });
// }
//
// const get_districts = (city,callback)=>{
//   console.log(`get_districts 输入参数:${JSON.stringify(city)}`);
//   const options = {
//      method: 'GET',
//      url: `http://restapi.amap.com/v3/config/district?key=${key}&subdistrict=1&level=city&keywords=${city.adcode}`,
//      headers:
//       {
//         'content-type': 'application/json',
//          'accept': 'application/json'
//       }
//     };
//    request(options, function (error, response, body) {
//      if (error) throw new Error(error);
//
//        try{
//          let resultobj = body;
//          if(typeof resultobj === 'string'){
//              resultobj= JSON.parse(body);
//          }
//         //  console.log(`get_districts resultobj:${JSON.stringify(resultobj)}`);
//          if(resultobj.status == 1){
//            let districts = [];
//            _.map(resultobj.districts[0].districts,(district)=>{
//             //  console.log(`get_districts:${JSON.stringify(district)}`);
//              districts.push({
//                provice_adcode:city.provice_adcode,
//                provice_name:city.provice_name,
//                city_adcode:city.adcode,
//                city_name:city.name,
//                adcode:district.adcode,
//                name:district.name,
//                level:district.level,
//              });
//            });
//            callback(null,districts);
//          }
//
//        }
//        catch(e){
//          console.log(`返回结果e:${JSON.stringify(e)}`);
//        }
//    });
// }


const get_districts_polyline = (district,callback)=>{
  console.log(`get_districts_polyline 输入参数:${JSON.stringify(district)}`);
  const options = {
     method: 'GET',
     url: `http://restapi.amap.com/v3/config/district?key=${key}&subdistrict=0&keywords=${district.adcode}&extensions=all`,
     headers:
      {
        'content-type': 'application/json',
         'accept': 'application/json'
      }
    };
   request(options, function (error, response, body) {
        if (!!error) {
          callback(error,null);
          return;
        };

       try{
         let resultobj = body;
         if(typeof resultobj === 'string'){
             resultobj= JSON.parse(body);
         }
        //  console.log(`get_districts resultobj:${JSON.stringify(resultobj)}`);
         if(resultobj.status == 1){
           const polyline_str = resultobj.districts[0].polyline;
           let polyline = [];
           let polylinesz = polyline_str.split(';');
           _.map(polylinesz,(pzstr)=>{
             let locz = pzstr.split(',');
             if(locz.length === 2){
               let lng = parseFloat(locz[0]);
               let lat = parseFloat(locz[1]);
               polyline.push([lng,lat]);
             }
           });
           callback(null,polyline);
         }

       }
       catch(e){
         console.log(`返回结果e:${JSON.stringify(e)}`);
       }
   });
}
// get_provices((err,provinces)=>{
//   console.log(`所有省份:${JSON.stringify(provinces)}`);
//   if(!err && !!provinces){
//     _.map(provinces,(provice)=>{
//       get_cities(provice,(err,cities)=>{
//         console.log(`所有城市:${JSON.stringify(cities)}`);
//         _.map(cities,(err,city)=>{
//           get_districts(city,(err,districts)=>{
//             console.log(`所有区域:${JSON.stringify(districts)}`);
//           });
//         });
//       });
//     });
//   }
// });
// const city = {"provice_adcode":"500000","provice_name":"重庆市","adcode":"500100","name":"重庆城区"};
// get_districts(city,(err,districts)=>{
//   console.log(`所有区域:${JSON.stringify(districts)}`);
//   if(districts.length > 0){
//     get_districts_polyline(districts[0],(err,district_result)=>{
//       console.log(`district_result===>${JSON.stringify(district_result)}`);
//     })
//   }
// });
// const district = {"provice_adcode":"330000","provice_name":"浙江省","city_adcode":"330900","city_name":"舟山市","adcode":"330902","name":"定海区","level":"district"}
// get_districts_polyline(district,(err,polyline)=>{
//   console.log(`polyline=>${JSON.stringify(polyline)}`)
// });
// exports.get_provices = get_provices;
// exports.get_cities = get_cities;
// exports.get_districts = get_districts;
exports.get_districts_polyline = get_districts_polyline;
exports.get_allgeos = get_allgeos;

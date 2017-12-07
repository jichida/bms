const request = require("request");
const _ = require('lodash');

const key = "604128e90f0f7ca695c811e7ccf5d6f0";

const get_provices = (callback)=>{
  const options = {
     method: 'GET',
     url: `http://restapi.amap.com/v3/config/district?key=${key}&subdistrict=1&keywords=100000`,
     headers:
      {
        'content-type': 'application/json',
         'accept': 'application/json'
      }
    };
   request(options, function (error, response, body) {
     if (error) throw new Error(error);

       try{
         let resultobj = body;
         if(typeof resultobj === 'string'){
             resultobj= JSON.parse(body);
         }
        //  console.log(`resultobj:${JSON.stringify(resultobj)}`);
         if(resultobj.status == 1){
           let provinces = [];
           _.map(resultobj.districts[0].districts,(district)=>{
             let provice = {
               adcode:district.adcode,
               name:district.name,
               level:district.level,
             };
             provinces.push(provice);
           });
           callback(null,provinces);
         }

       }
       catch(e){
         console.log(`返回结果e:${JSON.stringify(e)}`);
       }
   });
}

const get_cities = (provice,callback)=>{
  console.log(`get_cities 输入参数:${JSON.stringify(provice)}`);
  const options = {
     method: 'GET',
     url: `http://restapi.amap.com/v3/config/district?key=${key}&subdistrict=1&level=province&keywords=${provice.adcode}`,
     headers:
      {
        'content-type': 'application/json',
         'accept': 'application/json'
      }
    };
   request(options, function (error, response, body) {
     if (error) throw new Error(error);

       try{
         let resultobj = body;
         if(typeof resultobj === 'string'){
             resultobj= JSON.parse(body);
         }
        //  console.log(`get_cities resultobj:${JSON.stringify(resultobj)}`);
         if(resultobj.status == 1){
           let cities = [];
           _.map(resultobj.districts[0].districts,(district)=>{
             cities.push({
               provice_adcode:provice.adcode,
               provice_name:provice.name,
               adcode:district.adcode,
               name:district.name,
               level:district.level,
             });
           });
           callback(null,cities);
         }

       }
       catch(e){
         console.log(`返回结果e:${JSON.stringify(e)}`);
       }
   });
}

const get_districts = (city,callback)=>{
  console.log(`get_districts 输入参数:${JSON.stringify(city)}`);
  const options = {
     method: 'GET',
     url: `http://restapi.amap.com/v3/config/district?key=${key}&subdistrict=1&level=city&keywords=${city.adcode}`,
     headers:
      {
        'content-type': 'application/json',
         'accept': 'application/json'
      }
    };
   request(options, function (error, response, body) {
     if (error) throw new Error(error);

       try{
         let resultobj = body;
         if(typeof resultobj === 'string'){
             resultobj= JSON.parse(body);
         }
        //  console.log(`get_districts resultobj:${JSON.stringify(resultobj)}`);
         if(resultobj.status == 1){
           let districts = [];
           _.map(resultobj.districts[0].districts,(district)=>{
            //  console.log(`get_districts:${JSON.stringify(district)}`);
             districts.push({
               provice_adcode:city.provice_adcode,
               provice_name:city.provice_name,
               city_adcode:city.adcode,
               city_name:city.name,
               adcode:district.adcode,
               name:district.name,
               level:district.level,
             });
           });
           callback(null,districts);
         }

       }
       catch(e){
         console.log(`返回结果e:${JSON.stringify(e)}`);
       }
   });
}


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
     if (error) throw new Error(error);

       try{
         let resultobj = body;
         if(typeof resultobj === 'string'){
             resultobj= JSON.parse(body);
         }
        //  console.log(`get_districts resultobj:${JSON.stringify(resultobj)}`);
         if(resultobj.status == 1){
           let district_result = {
             provice_adcode:city.provice_adcode,
             provice_name:city.provice_name,
             city_adcode:city.city_adcode,
             city_name:city.city_name,
             district_adcode:district.adcode,
             district_name:district.name,
             level:district.level,
           };
           const polyline_str = resultobj.districts[0].polyline;
           district_result.polyline = polyline_str.split(';');
           callback(null,district_result);
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

exports.get_provices = get_provices;
exports.get_cities = get_cities;
exports.get_districts = get_districts;
exports.get_districts_polyline = get_districts_polyline;

const async = require('async');
const _ = require('lodash');
const utilgeo =  require('./utilgeo.js');
const db = require('./db/index');

const start = ()=>{

async.waterfall([
    (callback)=> {
      db.load_provices((provinces)=>{
        console.log(`provinces===>${JSON.stringify(provinces)}`)
        if(provinces.length === 0){
          utilgeo.get_provices((err,provinces)=>{
            console.log(`provinces===>${JSON.stringify(provinces)}`)
            callback(null,{isindb:false,provinces});
          });
        }
        else{
          callback(null,{isindb:true,provinces});
        }
      });
    },
    ({isindb,provinces}, callback)=> {
      console.log(`isindb:${isindb},provinces===>${JSON.stringify(provinces)}`);
      if(!isindb){
        db.save_provices(provinces);
      }

       _.map(provinces,(provice)=>{
         utilgeo.get_cities(provice,callback);
        //  if(provinces.adcode !== '820000'){
        //    utilgeo.get_cities(provice,callback);
        //  }
        //  if(provice.adcode === '320000'){
        //    console.log(`start get cities....`);
        //    utilgeo.get_cities(provice,callback);
        //  }
       });
    },
   (cities, callback)=> {
     console.log(`cities===>${JSON.stringify(cities)}`);
      _.map(cities,(city)=>{
        if(city.level === 'district'){
          // let district = {
          //
          // }
        }
        else{
          db.load_onecity(city,(result)=>{
            if(!result && city.level === 'city'){
              //数据库中无城市数据
              utilgeo.get_districts(city,callback);
            }
          });
        }

        // if(city.adcode === '320400'){
        //   utilgeo.get_districts(city,callback);
        // }
      });
  },
  (districts, callback)=> {
    console.log(`districts===>${JSON.stringify(districts)}`);
     _.map(districts,(district)=>{
       utilgeo.get_districts_polyline(district,callback);
     });
 },
], (err, district_result)=> {
    console.log(`district_result===>${JSON.stringify(district_result)}`);
});


};
exports.start = start;
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

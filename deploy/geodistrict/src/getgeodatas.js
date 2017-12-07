const async = require('async');
const _ = require('lodash');
const utilgeo =  require('./utilgeo.js');
const db = require('./db/index');

const start = ()=>{

async.waterfall([
    (callback)=> {
      db.load_provices({},(provinces)=>{
        // console.log(`provinces===>${JSON.stringify(provinces)}`)
        if(provinces.length === 0){
          utilgeo.get_provices((err,provinces)=>{
            // console.log(`provinces===>${JSON.stringify(provinces)}`)
            callback(null,{isindb:false,provinces});
          });
        }
        else{
          callback(null,{isindb:true,provinces});
        }
      });
    },
    ({isindb,provinces}, callback)=> {
      // console.log(`isindb:${isindb},provinces===>${JSON.stringify(provinces)}`);
      if(!isindb){
        db.save_provices(provinces);
      }

      let fnsz = [];
       _.map(provinces,(provice)=>{
           let fn = (callback)=>{
            //  console.log(`provinces===>${JSON.stringify(provice)}`);
             db.load_cities({provice_adcode:provice.adcode},(cities)=>{
              //  console.log(`数据库中获取cities===>${JSON.stringify(cities)}`);
               if(cities.length === 0){//数据库中没有
                   utilgeo.get_cities(provice,(err,cities)=>{
                    //  console.log(`geo 获取cities===>${JSON.stringify(cities)}`);
                     db.save_cities(cities);
                     callback(null,cities);
                   });

               }
               else{
                  callback(null,cities);
               }
             });
         }
         fnsz.push(fn);
       });
       console.log(`函数个数===>${fnsz.length}`);
       async.parallel(fnsz,(err,result)=>{
         console.log(`async.parallel===>err:${JSON.stringify(err)},${JSON.stringify(result)}`);

         let cities = [];
         _.map(result,(cts)=>{
           cities = _.concat(cities,cts);
         });

         callback(null,cities);
       });
    },
   (cities, callback)=> {
     console.log(`全部城市===>${JSON.stringify(cities)}`);
     let fnsz = [];
      _.map(cities,(city)=>{
        let fn = (callback)=>{
          db.load_districts({adcode:city.city_adcode},(districts)=>{
            if(districts.length === 0){
              //数据库中不存在
              utilgeo.get_districts(city,(err,districts)=>{
                db.save_districts(districts);
                callback(null,districts);
              });
            }
            else{
              callback(null,districts);
            }
          });
        }
        fnsz.push(fn);
      });
      console.log(`函数个数===>${fnsz.length}`);
      async.parallel(fnsz,(err,result)=>{
        console.log(`async.parallel===>err:${JSON.stringify(err)},${JSON.stringify(result)}`);

        let districts = [];
        _.map(result,(cts)=>{
          districts = _.concat(districts,cts);
        });

        callback(null,districts);
      });
  },
  (districts, callback)=> {
    console.log(`获得全部区域===>${JSON.stringify(districts)}`);
     _.map(districts,(district)=>{
       //utilgeo.get_districts_polyline(district,callback);
     });
 },
], (err, district_result)=> {
    console.log(`district_result===>${JSON.stringify(district_result)}`);
});


};
exports.start = start;

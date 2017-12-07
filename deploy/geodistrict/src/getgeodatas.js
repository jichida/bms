const async = require('async');
const _ = require('lodash');
const utilgeo =  require('./utilgeo.js');
const db = require('./db/index');
const geolib = require('geolib');
const moment = require('moment');

const start = ()=>{

  // utilgeo.get_allgeos((err,result_geo_list)=>{
  //   console.log(`获取到数据:${result_geo_list.length}`);
  //   if(!err && result_geo_list){
  //     _.map(result_geo_list,(result_geo)=>{
  //       console.log(`处理数据:${JSON.stringify(result_geo)}`);
  //       //setTimeout(()=>{
  //         db.load_geos(result_geo,(result_list)=>{
  //           // console.log(`从数据库中读取:${JSON.stringify(result_list)}`);
  //           let result_geo_rec = result_geo;
  //           if(result_list.length === 1){
  //             result_geo_rec = result_list[0];
  //           }
  //           else{
  //             db.save_geos(result_geo);
  //           }
  //
  //           if(!result_geo_rec.polygons){
  //             console.log(`找不到 polyline=>${JSON.stringify(result_geo_rec)}`)
  //             utilgeo.get_districts_polyline(result_geo,(err,polyline)=>{
  //               console.log(`polyline=>${JSON.stringify(polyline)}`)
  //               result_geo.polygons = {
  //                 "type" : "Polygon",
  //                 "coordinates" : []
  //               };
  //               result_geo.polygons['coordinates'].push(polyline);
  //               db.update_geos(result_geo);
  //             });
  //           }
  //         });
  //       // },100);//timeout
  //
  //     });
  //   }

  // });


let maplist =[];
db.load_geos({"adcode" : "450202"},(result_geo_list)=>{
  console.log(`获取到数据:${result_geo_list.length}`);
  if(result_geo_list.length > 0){
    _.map(result_geo_list,(result_geo)=>{
      if(!!result_geo.adcode){
        let array_polygon = [];
        let polygons_list = result_geo.polygons['coordinates'][0];
        let result_geo_new = _.omit(result_geo,'coordinates');
        _.map(polygons_list,(pt)=>{
          array_polygon.push({
            latitude:pt[1],
            longitude:pt[0]
          });
        });
        console.log(`array_polygon:${JSON.stringify(array_polygon)}`)
        result_geo_new.array_polygon = array_polygon;
        maplist.push(result_geo_new);
        // mapsz[result_geo.adcode] = result_geo_new;
      }
      else{
        console.log(`mapsz[result_geo.adcode]???===>${JSON.stringify(result_geo)}`)
      }
    });


    const getgeofrompoint = ((point)=>{
      let matched = {};
      _.map(maplist,(v,k)=>{
        console.log(`v.array_polygon???===>${JSON.stringify(v.array_polygon)}`)
        if(geolib.isPointInside(point,v.array_polygon)){
          return v;
        }
      });
      return null;
    });

    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')}==>${maplist.length}`);
    let point = {latitude: 40.2207700000, longitude: 116.2312800000};
    let result = getgeofrompoint(point);
    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')}判断结果${JSON.stringify(result)}`);
    point = {latitude: 24.350483, longitude: 109.433671};
    result = getgeofrompoint(point);
    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')}判断结果${JSON.stringify(result)}`);
    point = {latitude: 26.258009, longitude: 119.378868};
    result = getgeofrompoint(point);
    console.log(`${moment().format('YYYY-MM-DD HH:mm:ss')}判断结果${JSON.stringify(result)}`);
  }
});


  // async.waterfall([
  //     (callback)=> {
  //       utilgeo.get_allgeos((result_geo_list)=>{
  //         _.map(result_geo_list,(result_geo)=>{
  //           db.load_geos(result_geo,(result_list)=>{
  //             if(result_list.length === 0){
  //
  //             }
  //             else{
  //
  //             }
  //           });
  //         });
  //       });
  //
  //       db.get_allgeos({},(provinces)=>{
  //         // console.log(`provinces===>${JSON.stringify(provinces)}`)
  //         if(provinces.length === 0){
  //           console.log(`provinces数据库中不存在吗`)
  //           utilgeo.get_provices((err,provinces)=>{
  //             // console.log(`provinces===>${JSON.stringify(provinces)}`)
  //             db.save_provices(provinces);
  //             callback(null,provinces);
  //           });
  //         }
  //         else{
  //           callback(null,provinces);
  //         }
  //       });
  //     },
// async.waterfall([
//     (callback)=> {
//       db.load_provices({},(provinces)=>{
//         // console.log(`provinces===>${JSON.stringify(provinces)}`)
//         if(provinces.length === 0){
//           console.log(`provinces数据库中不存在吗`)
//           utilgeo.get_provices((err,provinces)=>{
//             // console.log(`provinces===>${JSON.stringify(provinces)}`)
//             db.save_provices(provinces);
//             callback(null,provinces);
//           });
//         }
//         else{
//           callback(null,provinces);
//         }
//       });
//     },
//     (provinces, callback)=> {
//       // console.log(`isindb:${isindb},provinces===>${JSON.stringify(provinces)}`)
//       let fnsz = [];
//        _.map(provinces,(provice)=>{
//            let fn = (callback)=>{
//             //  console.log(`provinces===>${JSON.stringify(provice)}`);
//              db.load_cities({provice_adcode:provice.adcode},(cities)=>{
//                if(cities.length === 0){//数据库中没有
//                    console.log(`cities数据库中不存在${provice.name}|${provice.adcode}吗`)
//                    utilgeo.get_cities(provice,(err,cities)=>{
//                     //  console.log(`geo 获取cities===>${JSON.stringify(cities)}`);
//                      db.save_cities(cities);
//                      callback(null,cities);
//                    });
//
//                }
//                else{
//                   callback(null,cities);
//                }
//              });
//          }
//          fnsz.push(fn);
//        });
//       //  console.log(`函数个数===>${fnsz.length}`);
//        async.parallel(fnsz,(err,result)=>{
//         //  console.log(`async.parallel===>err:${JSON.stringify(err)},${JSON.stringify(result)}`);
//
//          let cities = [];
//          _.map(result,(cts)=>{
//            cities = _.concat(cities,cts);
//          });
//
//          callback(null,cities);
//        });
//     },
//    (cities, callback)=> {
//     //  console.log(`全部城市===>${JSON.stringify(cities)}`);
//      let fnsz = [];
//       _.map(cities,(city)=>{
//         let fn = (callback)=>{
//           db.load_districts({city_adcode:city.adcode},(districts)=>{
//             if(districts.length === 0){
//               console.log(`districts数据库中不存在${city.name}|${city.adcode}吗`)
//               //数据库中不存在
//               utilgeo.get_districts(city,(err,districts)=>{
//                 db.save_districts(districts);
//                 callback(null,districts);
//               });
//             }
//             else{
//               callback(null,districts);
//             }
//           });
//         }
//         fnsz.push(fn);
//       });
//       // console.log(`函数个数===>${fnsz.length}`);
//       async.parallel(fnsz,(err,result)=>{
//         // console.log(`async.parallel===>err:${JSON.stringify(err)},${JSON.stringify(result)}`);
//         let districts = [];
//         _.map(result,(cts)=>{
//           districts = _.concat(districts,cts);
//         });
//         console.log(`获得全部区域===>${district.length}`);
//         callback(null,districts);
//       });
//   },
//   (districts, callback)=> {
//     console.log(`获得全部区域===>${JSON.stringify(districts)}`);
//      _.map(districts,(district)=>{
//        //utilgeo.get_districts_polyline(district,callback);
//      });
//  },
// ], (err, district_result)=> {
//     // console.log(`district_result===>${JSON.stringify(district_result)}`);
// });


};
exports.start = start;

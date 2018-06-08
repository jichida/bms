const config = require('../../config.js');
const DBModels = require('../../db/models.js');
const mongoose  = require('mongoose');
const winston = require('../../log/log.js');
const _ = require('lodash');
const moment = require('moment');
const debug = require('debug')('srvapp:device');
const oldyears = moment().subtract(10,'years').format('YYYY');
const async = require('async');
debug(`10年以前是:${oldyears}`);

const getcount_car = (query,callbackfn)=>{
  const deviceextModel = DBModels.DeviceExtModel;

  deviceextModel.count(query,(err, list)=> {
      callbackfn(err,list);
  });
}

const getcount_bus = (query,callbackfn)=>{
  const deviceextModel = DBModels.DeviceExtModel;
  deviceextModel.count(query,(err, list)=> {
      callbackfn(err,list);
  });
}

const getusedyear = (query,callbackfn)=>{
  const deviceextModel = DBModels.DeviceExtModel;
  deviceextModel.aggregate([
       {$match:query},
       {$group: {
           _id: '$usedyear',
           count: { $sum: 1 },
       }
     }]).exec((err, list)=> {

         let result = {};
         if(!err && !!list){
           _.map(list,(v)=>{
             if(v._id !== ''){
               if(oldyears > v._id){
                 if(!result[`${oldyears}之前`]){
                   result[`${oldyears}之前`] = v.count;
                 }
                 else{
                   result[`${oldyears}之前`] += v.count;
                 }
               }
               else{
                 result[v._id] = v.count;
               }
             }
           });
         }

         let retarray = [];
         _.map(result,(v,k)=>{
           retarray.push({
              "type":query['type'],
              "name":`${k}`,
              "value":`${v}`,
           });
         });

         callbackfn(null,retarray);
       });
}



const getstat_province = (query,maxcount,callbackfn)=>{
  const deviceextModel = DBModels.DeviceExtModel;
  deviceextModel.aggregate([
    {$match:query},
    {
  		$project: {
  			_id: 0,
  			provice: 1,
  			bustype: {
  				$cond: [{
  					$eq: ["$type", 'BUS']
  				}, 1, 0]
  			},
  			cartype: {
  				$cond: [{
  					$eq: ["$type", 'CAR']
  				}, 1, 0]
  			}
  		}
  	},
  	{
  		$group: {
  			_id:'$provice',
  			buscount: {
  				$sum: '$bustype'
  			},
  			carcount: {
  				$sum: '$cartype'
  			},
  			count: {
  				$sum: 1
  			}
  		}
  	},
  	{
  		$sort: {
  			count: -1
  		}
  	}
  ]).exec((err, list)=> {
         let retarray = [];
         if(!err && !!list){
        //    {
        //      "_id" : "北京市",
        //      "buscount" : 7.0,
        //      "carcount" : 0.0,
        //      "count" : 7.0
        //  }
          let maxcountlist = list.length > maxcount?maxcount:list.length;
          for(let i = 0 ;i < maxcountlist; i++){
            const v = list[i];
            retarray.push({
               "type":'BUS',
               "name":`${v._id}`,
               "value":`${v.buscount}`,
            });
            retarray.push({
               "type":'CAR',
               "name":`${v._id}`,
               "value":`${v.carcount}`,
            });
          }

         }

         callbackfn(null,retarray);
       });
}

const getstat_catlproject = (query,maxcount,callbackfn)=>{
  const deviceextModel = DBModels.DeviceExtModel;

  deviceextModel.aggregate([
    {$match:query},
    {
  		$project: {
  			_id: 0,
  			catlprojectname: 1,
  			bustype: {
  				$cond: [{
  					$eq: ["$type", 'BUS']
  				}, 1, 0]
  			},
  			cartype: {
  				$cond: [{
  					$eq: ["$type", 'CAR']
  				}, 1, 0]
  			}
  		}
  	},
  	{
  		$group: {
  			_id:'$catlprojectname',
  			buscount: {
  				$sum: '$bustype'
  			},
  			carcount: {
  				$sum: '$cartype'
  			},
  			count: {
  				$sum: 1
  			}
  		}
  	},
  	{
  		$sort: {
  			count: -1
  		}
  	}
  ]).exec((err, list)=> {
         let retarray = [];
         if(!err && !!list){
          //  {
          //       "_id" : "ZZZ-123",
          //       "buscount" : 24.0,
          //       "carcount" : 1.0,
          //       "count" : 25.0
          //   }
          let maxcountlist = list.length > maxcount?maxcount:list.length;
          for(let i = 0 ;i < maxcountlist; i++){
            const v = list[i];
            retarray.push({
               "type":'BUS',
               "name":`${v._id}`,
               "value":`${v.buscount}`,
            });
            retarray.push({
               "type":'CAR',
               "name":`${v._id}`,
               "value":`${v.carcount}`,
            });
          }
         }

         callbackfn(null,retarray);
       });
}

exports.getcountcar =  (actiondata,ctx,callback)=>{
  let query = actiondata.query || {};
  query["type"] = "CAR";
  getcount_car(query,(err,result)=>{
    callback({
      cmd:'getcountcar_result',
      payload:result
    });
  });
}

exports.getcountbus =  (actiondata,ctx,callback)=>{
  let query = actiondata.query || {};
  query["type"] = "BUS";
  console.log(`getcountbus-->${JSON.stringify(query)}`)
  getcount_bus(query,(err,result)=>{
    callback({
      cmd:'getcountbus_result',
      payload:result
    });
  });
}

exports.getusedyearcar =  (actiondata,ctx,callback)=>{
  let query = actiondata.query || {};
  query["type"] = "CAR";
  console.log(`getusedyearcar-->${JSON.stringify(query)}`)
  getusedyear(query,(err,result)=>{
    callback({
      cmd:'getusedyearcar_result',
      payload:result
    });
  });
  // {"type":"CAR","name":"2018","value":"1241"},
  // {"type":"CAR","name":"2017","value":"1141"},
  // {"type":"CAR","name":"2016","value":"1842"},
  // {"type":"CAR","name":"2015","value":"2242"},
  // {"type":"CAR","name":"2014","value":"1842"},
}

exports.getusedyearbus =  (actiondata,ctx,callback)=>{
  let query = actiondata.query || {};
  query["type"] = "BUS";
  console.log(`getusedyearbus-->${JSON.stringify(query)}`)
  getusedyear(query,(err,result)=>{
    debug(`getusedyearbus--->${JSON.stringify(result)}`)
    callback({
      cmd:'getusedyearbus_result',
      payload:result
    });
  });
}

exports.getstatprovince =  (actiondata,ctx,callback)=>{
  const maxcount = _.get(actiondata,'maxcount',20);
  let query = actiondata.query || {};
  getstat_province(query,maxcount,(err,result)=>{
    debug(`getstatprovince--->${JSON.stringify(result)}`)
    callback({
      cmd:'getstatprovince_result',
      payload:result
    });
  });
  // let fnsz = [];
  // fnsz.push((callbackfn)=>{
  //   getstat_province('BUS',(err,result)=>{
  //     callbackfn(err,result);
  //   });
  // });
  // fnsz.push((callbackfn)=>{
  //   getstat_province('CAR',(err,result)=>{
  //     callbackfn(err,result);
  //   });
  // });
  //
  // async.parallel(fnsz,(err,result2)=>{
  //   let result = result2[0];
  //   _.map(result2[1],(v)=>{
  //     result.push(v);
  //   });
  //   debug(`getstatprovince--->${JSON.stringify(result)}`)
  //   callback({
  //     cmd:'getstatprovince_result',
  //     payload:result
  //   });
  // });

}

exports.getstatcatlproject =  (actiondata,ctx,callback)=>{
  const maxcount = _.get(actiondata,'maxcount',20);
  let query = actiondata.query || {};
  getstat_catlproject(query,maxcount,(err,result)=>{
    callback({
      cmd:'getstatcatlproject_result',
      payload:result
    });
  });
}

/**


db.getCollection('deviceexts').aggregate([{
		$project: {
			_id: 0,
			catlprojectname: 1,
			bustype: {
				$cond: [{
					$eq: ["$type", 'BUS']
				}, 1, 0]
			},
			cartype: {
				$cond: [{
					$eq: ["$type", 'CAR']
				}, 1, 0]
			}
		}
	},
	{
		$group: {
			_id: {
				catlprojectname: '$catlprojectname',
			},
			buscount: {
				$sum: '$bustype'
			},
			carcount: {
				$sum: '$cartype'
			},
			count: {
				$sum: 1
			}
		}
	},
	{
		$sort: {
			count: -1
		}
	}
])

*/

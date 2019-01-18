const config = require('../../config.js');
const DBModels = require('../../db/models.js');
const mongoose  = require('mongoose');
const winston = require('../../log/log.js');
const _ = require('lodash');
const moment = require('moment');
const debug = require('debug')('srvapp:deviceext');
const oldyears = moment().subtract(10,'years').format('YYYY');
const async = require('async');
debug(`10年以前是:${oldyears}`);

const getcount_type = (query,callbackfn)=>{
  const deviceextModel = DBModels.DeviceExtModel;
  deviceextModel.count(query,(err, list)=> {
      callbackfn(err,list);
  });
}


const getusedyear = (queryorg,callbackfn)=>{
  const query = _.clone(queryorg);
  // debug(`---->getusedyear--->${JSON.stringify(query)}`)
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
        //  debug(`getusedyear===>${JSON.stringify(query)}---->:${JSON.stringify(retarray)}`);

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
  			province: 1,
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
  			_id:'$province',
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

exports.getcountcar =  getcountcar = (actiondata,ctx,callback)=>{
  let query = actiondata.query || {};
  query["type"] = "CAR";
  getcount_type(query,(err,result)=>{
    callback({
      cmd:'getcountcar_result',
      payload:result
    });
  });
}

exports.getcountbus =  getcountbus = (actiondata,ctx,callback)=>{
  let query = actiondata.query || {};
  query["type"] = "BUS";
  getcount_type(query,(err,result)=>{
    callback({
      cmd:'getcountbus_result',
      payload:result
    });
  });
}


exports.getcountcontainertrunk =  getcountcontainertrunk = (actiondata,ctx,callback)=>{
  let query = actiondata.query || {};
  query["type"] = "CONTAINERTRUCK";
  getcount_type(query,(err,result)=>{
    callback({
      cmd:'getcountcontainertrunk_result',
      payload:result
    });
  });
}


exports.getcountenergytruck =  getcountenergytruck = (actiondata,ctx,callback)=>{
  let query = actiondata.query || {};
  query["type"] = "ENERGYTRUCK";
  getcount_type(query,(err,result)=>{
    callback({
      cmd:'getcountenergytruck_result',
      payload:result
    });
  });
}


exports.getusedyearcar = getusedyearcar = (actiondata,ctx,callback)=>{
  let query = actiondata.query || {};
  query["type"] = "CAR";
  // debug(`getusedyearcar--->${JSON.stringify(query)}`)
  getusedyear(query,(err,result)=>{
    callback({
      cmd:'getusedyearcar_result',
      payload:result
    });
  });
}

exports.getusedyearbus =  getusedyearbus = (actiondata,ctx,callback)=>{
  let query = actiondata.query || {};
  query["type"] = "BUS";
  // debug(`getusedyearbus--->${JSON.stringify(query)}`)
  getusedyear(query,(err,result)=>{
    callback({
      cmd:'getusedyearbus_result',
      payload:result
    });
  });
}

exports.getusedyearcontainertrunk =  getusedyearcontainertrunk = (actiondata,ctx,callback)=>{
  let query = actiondata.query || {};
  query["type"] = "CONTAINERTRUCK";
  // debug(`getusedyearbus--->${JSON.stringify(query)}`)
  getusedyear(query,(err,result)=>{
    callback({
      cmd:'containertrunk_result',
      payload:result
    });
  });
}

exports.getusedyearenergytruck = getusedyearenergytruck = (actiondata,ctx,callback)=>{
  let query = actiondata.query || {};
  query["type"] = "ENERGYTRUCK";
  // debug(`getusedyearcar--->${JSON.stringify(query)}`)
  getusedyear(query,(err,result)=>{
    callback({
      cmd:'getusedyearenergytruck_result',
      payload:result
    });
  });
}




exports.getstatprovince =  getstatprovince = (actiondata,ctx,callback)=>{
  const maxcount = _.get(actiondata,'maxcount',20);
  let query = actiondata.query || {};
  getstat_province(query,maxcount,(err,result)=>{
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

exports.getstatcatlproject = getstatcatlproject = (actiondata,ctx,callback)=>{
  const maxcount = _.get(actiondata,'maxcount',20);
  let query = actiondata.query || {};
  getstat_catlproject(query,maxcount,(err,result)=>{
    callback({
      cmd:'getstatcatlproject_result',
      payload:result
    });
  });
}

exports.deviceext=  (actiondataorg,ctx,callback)=>{
  const maxcount = _.get(actiondataorg,'maxcount',20);
  const query = actiondataorg.query || {};

  let fnsz = [];
  fnsz.push((callbackfn)=>{//getcountcar
    const actiondata = _.clone(actiondataorg);
    getcountcar(actiondata,ctx,(result)=>{
      callbackfn(null,result.payload);
    });
  });
  fnsz.push((callbackfn)=>{//getcountbus
    const actiondata = _.clone(actiondataorg);
    getcountbus(actiondata,ctx,(result)=>{
      callbackfn(null,result.payload);
    });
  });
  fnsz.push((callbackfn)=>{//getcountcontainertrunk
    const actiondata = _.clone(actiondataorg);
    getcountcontainertrunk(actiondata,ctx,(result)=>{
      callbackfn(null,result.payload);
    });
  });
  fnsz.push((callbackfn)=>{//getcountenergytruck
    const actiondata = _.clone(actiondataorg);
    getcountenergytruck(actiondata,ctx,(result)=>{
      callbackfn(null,result.payload);
    });
  });
  fnsz.push((callbackfn)=>{//getusedyearcar
    const actiondata = _.clone(actiondataorg);
    getusedyearcar(actiondata,ctx,(result)=>{
      callbackfn(null,result.payload);
    });
  });
  fnsz.push((callbackfn)=>{//getusedyearbus
    const actiondata = _.clone(actiondataorg);
    getusedyearbus(actiondata,ctx,(result)=>{
      callbackfn(null,result.payload);
    });
  });
  fnsz.push((callbackfn)=>{//getusedyearcontainertrunk
    const actiondata = _.clone(actiondataorg);
    getusedyearcontainertrunk(actiondata,ctx,(result)=>{
      callbackfn(null,result.payload);
    });
  });
  fnsz.push((callbackfn)=>{//getusedyearenergytruck
    const actiondata = _.clone(actiondataorg);
    getusedyearenergytruck(actiondata,ctx,(result)=>{
      callbackfn(null,result.payload);
    });
  });
  fnsz.push((callbackfn)=>{//getstatprovince
    const querydo = !!query.catlprojectname?query:{};
    getstatprovince({query:querydo},ctx,(result)=>{
      callbackfn(null,result.payload);
    });
  });
  fnsz.push((callbackfn)=>{//getstatcatlproject
    const querydo = !!query.province?query:{};
    getstatcatlproject({query:querydo},ctx,(result)=>{
      callbackfn(null,result.payload);
    });
  });

  async.parallel(fnsz,(err,result)=>{
    callback({
      cmd:'deviceext_result',
      payload:{
        getcountcar:result[0],
        getcountbus:result[1],
        getcountcontainertrunk:result[2],
        getcountenergytruck:result[3],
        getusedyearcar:result[4],
        getusedyearbus:result[5],
        getusedyearcontainertrunk:result[5],
        getusedyearenergytruck:result[6],
        getstatprovince:result[7],
        getstatcatlproject:result[8],
      }
    });
  });
}


exports.pushdeviceext = (actiondataorg,ctx,callback)=>{
  const deviceextModel = DBModels.DeviceExtModel;
  deviceextModel.find({},{
    DeviceId:1,
    usedyear:1,
    type:1,
    province:1,
    catlprojectname:1
  }).lean().exec((err,list)=>{
    if(!err){
      callback({
        cmd:'pushdeviceext',
        payload:{list}
      });
    }
    else{
      callback({
        cmd:'common_err',
        payload:{errmsg:err.message,type:'pushdeviceext'}
      });
    }
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

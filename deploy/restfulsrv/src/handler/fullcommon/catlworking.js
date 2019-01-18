const mysqldb = require('./dbconnection');
const _ = require('lodash');
const async = require('async');
const debug = require('debug')('srvapp:catlworking');
const config = require('../../config');

const getcatl_warningf = (maxcount,callback)=>{
  const sql = `SELECT DATE_FORMAT(update_time,'%Y-%m-%d %H:%i:%S') AS update_time,deviceid AS DeviceId,type FROM MA_WARNING_F ORDER BY update_time DESC LIMIT ${maxcount}`;
  mysqldb.load(sql).then((rows)=>{
    callback(null,rows);
  });
};


exports.catl_warningf =  catl_warningf = (actiondata,ctx,callback)=>{
  const maxcount = _.get(actiondata,'maxcount',8);
  getcatl_warningf(maxcount,(err,result)=>{
    callback({
      cmd:'catl_warningf_result',
      payload:result
    });
  });
}

const getcatl_working = (callback)=>{
  const sql = `SELECT RDB,日期,cycle数,CATL项目名称,电芯最高温度,电芯最低温度,运行等效温差,充电次数 FROM MA_CATL_WORKING`;
  mysqldb.load(sql).then((rows)=>{
    callback(null,rows);
  });
};

const getcatl_cycle = (callback)=>{
  const sql = `SELECT cycle数 as name,count(cycle数) as value FROM MA_CATL_WORKING  group by cycle数`;
  mysqldb.load(sql).then((rows)=>{
    callback(null,rows);
  });
};

const getcatl_celltemperature = (callback)=>{//电芯最高温度,电芯最低温度
  const sql = `SELECT 运行等效温差 as name,count(运行等效温差) as value FROM MA_CATL_WORKING  group by 运行等效温差`;
  mysqldb.load(sql).then((rows)=>{
    callback(null,rows);
  });
};

const getcatl_cyclecount = (callback)=>{//充电次数
  const sql = `SELECT 充电次数 as name,count(充电次数) as value FROM MA_CATL_WORKING  group by 充电次数`;
  mysqldb.load(sql).then((rows)=>{
    callback(null,rows);
  });
};

const getcatl_dxtemperature = (callback)=>{//最高等效温度
  const sql = `SELECT 最高等效温度 as name,count(最高等效温度) as value FROM MA_CATL_WORKING  group by 最高等效温度`;
  mysqldb.load(sql).then((rows)=>{
    callback(null,rows);
  });
};

exports.catl_working = catl_working = (actiondata,ctx,callback)=>{
  getcatl_working((err,result)=>{
    callback({
      cmd:'catl_working_result',
      payload:result
    });
  });
}

exports.catl_cycle = catl_cycle = (actiondata,ctx,callback)=>{
  getcatl_cycle((err,result)=>{
    callback({
      cmd:'catl_cycle_result',
      payload:result
    });
  });
}

exports.catl_celltemperature = catl_celltemperature = (actiondata,ctx,callback)=>{
  getcatl_celltemperature((err,result)=>{
    callback({
      cmd:'catl_celltemperature_result',
      payload:result
    });
  });
}

exports.catl_cyclecount = catl_cyclecount = (actiondata,ctx,callback)=>{
  getcatl_cyclecount((err,result)=>{
    callback({
      cmd:'catl_cyclecount_result',
      payload:result
    });
  });
}

exports.catl_dxtemperature = catl_dxtemperature = (actiondata,ctx,callback)=>{
  getcatl_dxtemperature((err,result)=>{
    callback({
      cmd:'catl_dxtemperature_result',
      payload:result
    });
  });
}

const getcatlmysql = (callback)=>{
  debug(`start getcatlmysql`)
  const query = {};
  const actiondata = {};
  const ctx = {};
  let fnsz = [];
  // fnsz.push((callbackfn)=>{//catl_working_request
  //   catl_working(actiondata,ctx,(result)=>{
  //     callbackfn(null,result.payload);
  //   });
  // });
  fnsz.push((callbackfn)=>{//catl_cycle_request
    catl_cycle(actiondata,ctx,(result)=>{
      callbackfn(null,result.payload);
    });
  });
  fnsz.push((callbackfn)=>{//catl_celltemperature_request
    catl_celltemperature(actiondata,ctx,(result)=>{
      callbackfn(null,result.payload);
    });
  });
  fnsz.push((callbackfn)=>{//catl_cyclecount_request
    catl_cyclecount(actiondata,ctx,(result)=>{
      callbackfn(null,result.payload);
    });
  });
  fnsz.push((callbackfn)=>{//catl_dxtemperature
    catl_dxtemperature(actiondata,ctx,(result)=>{
      callbackfn(null,result.payload);
    });
  });
  fnsz.push((callbackfn)=>{//catl_warningf
    catl_warningf(actiondata,ctx,(result)=>{
      callbackfn(null,result.payload);
    });
  });

  async.parallel(fnsz,(err,result)=>{
    debug(`end  getcatlmysql`);
    callback({
      cmd:'catl_result',
      payload:{
        catl_cycle:result[0],
        catl_celltemperature:result[1],
        catl_cyclecount:result[2],
        catl_dxtemperature:result[3],
        catl_warningf:result[4],
      }
    });
  });
}

exports.getcatlmysql = getcatlmysql;
exports.catl =  (actiondata,ctx,callback)=>{
  if(_.get(config,'catlmysqldata.cmd','') === 'catl_result'){
    debug(`load data from config =====`);
    callback(config.catlmysqldata);
  }
  else{
    getcatlmysql((data)=>{
      config.catlmysqldata = data;
      callback(data);
    })
  }
}

// exports.getcatl_working =  getcatl_working;
// exports.getcatl_cycle =  getcatl_cycle;
// exports.getcatl_celltemperature =  getcatl_celltemperature;
// exports.getcatl_cyclecount =  getcatl_cyclecount;
// exports.getcatl_dxtemperature =  getcatl_dxtemperature;

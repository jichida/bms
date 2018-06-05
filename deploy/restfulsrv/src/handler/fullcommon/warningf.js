const mysqldb = require('./dbconnection');
const _ = require('lodash');
const getcatl_warningf = (maxcount,callback)=>{
  const sql = `SELECT DATE_FORMAT(update_time,'%Y-%m-%d %H:%i:%S') AS update_time,deviceid AS DeviceId,type FROM MA_WARNING_F ORDER BY update_time DESC LIMIT ${maxcount}`;
  mysqldb.load(sql).then((rows)=>{
    callback(null,rows);
  });
};


exports.catl_warningf =  (actiondata,ctx,callback)=>{
  const maxcount = _.get(actiondata,'maxcount',8);
  getcatl_warningf(maxcount,(err,result)=>{
    callback({
      cmd:'catl_warningf_result',
      payload:result
    });
  });
}

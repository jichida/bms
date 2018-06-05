const mysqldb = require('./dbconnection');

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
  const sql = `SELECT 电芯最高温度-电芯最低温度 as name,sum(电芯最高温度-电芯最低温度) as value FROM MA_CATL_WORKING  group by (电芯最高温度-电芯最低温度)`;
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

const getcatl_dxtemperature = (callback)=>{//运行等效温差
  const sql = `SELECT 运行等效温差 as name,count(运行等效温差) as value FROM MA_CATL_WORKING  group by 运行等效温差`;
  mysqldb.load(sql).then((rows)=>{
    callback(null,rows);
  });
};

exports.catl_working =  (actiondata,ctx,callback)=>{
  getcatl_working((err,result)=>{
    callback({
      cmd:'catl_working_result',
      payload:result
    });
  });
}

exports.catl_cycle =  (actiondata,ctx,callback)=>{
  getcatl_cycle((err,result)=>{
    callback({
      cmd:'catl_cycle_result',
      payload:result
    });
  });
}

exports.catl_celltemperature =  (actiondata,ctx,callback)=>{
  getcatl_celltemperature((err,result)=>{
    callback({
      cmd:'catl_celltemperature_result',
      payload:result
    });
  });
}

exports.catl_cyclecount =  (actiondata,ctx,callback)=>{
  getcatl_cyclecount((err,result)=>{
    callback({
      cmd:'catl_cyclecount_result',
      payload:result
    });
  });
}

exports.catl_dxtemperature =  (actiondata,ctx,callback)=>{
  getcatl_dxtemperature((err,result)=>{
    callback({
      cmd:'catl_dxtemperature_result',
      payload:result
    });
  });
}

exports.getcatl_working =  getcatl_working;
exports.getcatl_cycle =  getcatl_cycle;
exports.getcatl_celltemperature =  getcatl_celltemperature;
exports.getcatl_cyclecount =  getcatl_cyclecount;
exports.getcatl_dxtemperature =  getcatl_dxtemperature;

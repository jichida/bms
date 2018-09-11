const nodeid = process.env.NodeID || 1;
let config =  {
  mongodburl:process.env.MONGO_URL || 'mongodb://localhost/bms',
  mongos:process.env.mongos==='true'?true:false,
  issendtoredis:process.env.issendtoredis==='false'?false:true,
  redisdevicesetname:process.env.redisdevicesetname||`bmsrdbset`,
  redisdevicequeuename:process.env.redisdevicequeuename||`bmsrdbq`,
  srvredis:{
    host:process.env.srvredis_host||'afn.i2u.top',
    port: process.env.srvredis_port|| 6379,
  },
  kafka_cconfig1:{
      'group.id': process.env.GroupId ||'bmsgroup',
      'metadata.broker.list': process.env.KAFKA_HOST || '192.168.1.20:9092,192.168.1.114:9092,192.168.1.136:9092',
      'client.id':`c${process.pid}_${nodeid}`,
      'partition.assignment.strategy':'roundrobin',
      'enable.auto.commit': false
  },
  kafka_cconfig2:{
    'auto.offset.reset':'smallest'
  },
  kafka_pconfig1:{
    'metadata.broker.list': process.env.KAFKA_HOST || '192.168.1.20:9092,192.168.1.114:9092,192.168.1.136:9092',
  },
  kafka_pconfig2:{
  },
  istest:process.env.istest==='true'?true:false,
  mapdict:{},
  SpecialCurDayTime:process.env.SpecialCurDayTime || '18:00:00',//默认是23:59:59
  NodeID:nodeid,
  logdir:process.env.logdir ||'../../dist/log',
  kcmsg:!!process.env.kcmsg?parseInt(process.env.kcmsg):10,
  partitionnumber:!!process.env.partitionnumber?parseInt(process.env.partitionnumber):48,
  kafka_pushalaramtopic_app:'bmspush.alarmapp',
  kafka_pushalaramtopic_pc:'bmspush.alarmpc',
  kafka_dbtopic_historydevices:'bmsdb.historydevices',
  kafka_dbtopic_devices:'bmsdb.devices',
  kafka_dbtopic_historytracks:'bmsdb.historytracks',
  kafka_dbtopic_realtimealarms:'bmsdb.realtimealarms',
  kafka_dbtopic_realtimealarmraws:'bmsdb.realtimealarmraws',
  kafka_dbtopic_index:process.env.IndexTopic ||'bmsindex',
  kafka_dbtopic_current:process.env.CurrentTopic ||'bmsindex',
  version:'5.3.4(build0905)',
  globalhistorydevicetable:{},
  globalalarmdevicetable:{},
  globalalarmrawdevicetable:{},
  globaldevicetable:{},
  globalhistorytracktable:{},
  gloabaldevicealarmstat_realtime:{}
  // consumertopics:['BMS.Data']
};



module.exports = config;

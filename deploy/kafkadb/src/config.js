const nodeid = process.env.NodeID || 1;
let config =  {
  mongodburl:process.env.MONGO_URL || 'mongodb://localhost/bms',
  mongos:process.env.mongos==='true'?true:false,
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
  mapdict:{},
  NodeID:nodeid,
  partitionnumber:!!process.env.partitionnumber?parseInt(process.env.partitionnumber):48,
  jpush_appkey:process.env.jpush_appkey || '630950d8101fe73d19d64aaf',
  jpush_mastersecret:process.env.jpush_mastersecret || 'dd52bf9de919a2a53441fce3',
  kafka_pushalaramtopic_app:'bmspush.alarmapp',
  kafka_pushalaramtopic_pc:'bmspush.alarmpc',
  kafka_dbtopic_historydevices:'bmsdb.historydevices',
  kafka_dbtopic_devices:'bmsdb.devices',
  kafka_dbtopic_historytracks:'bmsdb.historytracks',
  kafka_dbtopic_realtimealarms:'bmsdb.realtimealarms',
  kafka_dbtopic_realtimealarmraws:'bmsdb.realtimealarmraws',
  kafka_dbtopic_index:process.env.IndexTopic ||'bmsdb.index',
  version:'1.2.1'
  // consumertopics:['BMS.Data']
};



module.exports = config;

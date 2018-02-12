let config =  {
  mongodburl:process.env.MONGO_URL || 'mongodb://localhost/bms',
  mongos:process.env.mongos==='true'?true:false,
  kafka_cconfig1:{
      'group.id': 'bmsgroup',
      'metadata.broker.list': process.env.KAFKA_HOST || '192.168.1.20:9092,192.168.1.114:9092,192.168.1.136:9092',
      'client.id':'c1',
      'partition.assignment.strategy':'roundrobin',
      'enable.auto.commit': true
  },
  kafka_cconfig2:{
    'auto.offset.reset':'largest'
  },
  kafka_pconfig1:{
    'metadata.broker.list': '192.168.1.20:9092,192.168.1.114:9092,192.168.1.136:9092',
  },
  kafka_pconfig2:{
  },
  mapdict:{},
  NodeID:process.env.NodeID || 1,
  partitionnumber:!!process.env.partitionnumber?parseInt(process.env.partitionnumber):48,
  jpush_appkey:process.env.jpush_appkey || '630950d8101fe73d19d64aaf',
  jpush_mastersecret:process.env.jpush_mastersecret || 'dd52bf9de919a2a53441fce3',
  kafka_pushalaramtopic_app:'push.alarmapp',
  kafka_pushalaramtopic_pc:'push.alarmpc',
  kafka_bmslogtopic:'log.bms',
  kafka_dbtopic_historydevices:'db.historydevices',
  kafka_dbtopic_devices:'db.devices',
  kafka_dbtopic_historytracks:'db.historytracks',
  kafka_dbtopic_realtimealarms:'db.realtimealarms',
  kafka_dbtopic_realtimealarmraws:'db.realtimealarmraws',
  kafka_dbtopic_index:'bms.index',
  version:'1.1.0'
  // consumertopics:['BMS.Data']
};



module.exports = config;

let config =  {
  mongodburl:process.env.MONGO_URL || 'mongodb://localhost/bms',
  mongos:process.env.mongos==='true'?true:false,
  consumerOptions:{
    host: process.env.KAFKA_HOST ||'118.31.41.232:2181',
    groupId: 'bmsdb',
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'earliest' // equivalent of auto.offset.reset valid values are 'none', 'latest', 'earliest'
  },
  mastergroupId:'bmsmaster',
  mapdict:{},
  NodeID:process.env.NodeID || 1,
  partitionnumber:!!process.env.partitionnumber?parseInt(process.env.partitionnumber):48,
  kafka_pushalaramtopic:'push.alarm',
  kafka_bmslogtopic:'log.bms',
  kafka_dbtopic_historydevices:'db.historydevices',
  kafka_dbtopic_devices:'db.devices',
  kafka_dbtopic_historytracks:'db.historytracks',
  kafka_dbtopic_realtimealarms:'db.realtimealarms',
  kafka_dbtopic_realtimealarmraws:'db.realtimealarmraws',
  kafka_dbtopic_index:'bms.index',
  kafka_maintopic:'BMS.Data',
  ismaster:process.env.ismaster==='true'?true:false,
  version:'1.0.1'
  // consumertopics:['BMS.Data']
};



module.exports = config;

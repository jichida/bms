let config =  {
  consumerOptions:{
    host: process.env.KAFKA_HOST ||'118.31.41.232:2181',
    mongos:process.env.mongos==='true'?true:false,
    groupId: 'BMSLogRecv',
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'earliest' // equivalent of auto.offset.reset valid values are 'none', 'latest', 'earliest'
  },
  kafka_pushalaramtopic:'push.alarm',
  kafka_bmslogtopic:'log.bms',
  consumertopics:['BMS.Data']
};



module.exports = config;

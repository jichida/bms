let config =  {
  consumerOptions:{
    host: process.env.KAFKA_HOST ||'118.31.41.232:2181',
    groupId: process.env.groupId || 'BMSLogRecv',
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'earliest' // equivalent of auto.offset.reset valid values are 'none', 'latest', 'earliest'
  },
  kafka_pushalaramtopic:'push.alarm',
  kafka_bmslogtopic:'log.bms',
  consumertopics:[process.env.topic || 'BMS.Data'],
  NodeID:process.env.NodeID || 1,
};



module.exports = config;

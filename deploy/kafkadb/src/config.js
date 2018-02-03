let config =  {
  mongodburl:process.env.MONGO_URL || 'mongodb://localhost/bms',
  consumerOptions:{
    host: process.env.KAFKA_HOST ||'118.31.41.232:2181',
    mongos:process.env.mongos==='true'?true:false,
    groupId: 'BMSRecvGroup',
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'earliest' // equivalent of auto.offset.reset valid values are 'none', 'latest', 'earliest'
  },
  mapdict:{},
  NodeID:process.env.NodeID || 1,
  kafka_pushalaramtopic:'push.alarm',
  consumertopics:['BMS.Data']
};



module.exports = config;

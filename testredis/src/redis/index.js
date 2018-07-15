const redis = require("redis");
const moment = require('moment');
const config = require('../config.js');
const  client = redis.createClient(config.srvredis);

const startsender = ()=>{
  client.on("error", (err)=> {
      console.log("Error " + err);
  });
  // const key = "dv0713";
  // client.sadd(key, ['123','abc'],(err, replies)=> {
  //   console.log(err)
  //   console.log(replies)
  // })
  // // client.sadd('alldevices0713', ['124','bcd']);
  // // client.sadd('alldevices0713', '243');
  // // client.delete(key);
  // client.sadd(key, "a member",(err, replies)=> {
  //   console.log(err)
  //   console.log(replies)
  // })
  // client.sadd(key, "another member",(err, replies)=> {
  //   console.log(err)
  //   console.log(replies)
  // })
// srv:redis setkey->bmsdeviceset20180714-->lpushkey201807141201010873
  const key = 'bmsrdbset.20180715';
  client.smembers(key,(err, replies)=> {
    console.log(err)
    console.log(replies)
  })

  // client.lpush('123',{id:1},(err,result)=>{
  //   console.log(err)
  //   console.log(result)
  // })
  //
  // client.lpush('123',{id:2},(err,result)=>{
  //   console.log(err)
  //   console.log(result)
  // })
  //
  // client.lpush('123',{id:3},(err,result)=>{
  //   console.log(err)
  //   console.log(result)
  // })

  client.lrange('bmsrdbq.20180715.1815201072', 0, -1, function (error, messages) {
      console.log(messages)
  })

}

module.exports = startsender;

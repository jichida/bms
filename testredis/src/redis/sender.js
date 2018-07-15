const redis = require("redis");
const config = require('../config.js');
const  client = redis.createClient(config.srvredis);

const startsender = ()=>{
  client.on("error", (err)=> {
      console.log("Error " + err);
  });
  const key = "dv0713";
  client.sadd(key, ['123','abc'],(err, replies)=> {
    console.log(err)
    console.log(replies)
  })
  // client.sadd('alldevices0713', ['124','bcd']);
  // client.sadd('alldevices0713', '243');
  // client.delete(key);
  client.sadd(key, "a member",(err, replies)=> {
    console.log(err)
    console.log(replies)
  })
  client.sadd(key, "another member",(err, replies)=> {
    console.log(err)
    console.log(replies)
  })

  client.smembers(key,(err, replies)=> {
    console.log(err)
    console.log(replies)
  })

  client.lpush('123',{id:1},(err,result)=>{
    console.log(err)
    console.log(result)
  })

  client.lpush('123',{id:2},(err,result)=>{
    console.log(err)
    console.log(result)
  })

  client.lpush('123',{id:3},(err,result)=>{
    console.log(err)
    console.log(result)
  })

  client.lrange('123', 0, -1, function (error, messages) {
      console.log(messages)
  })


  // client.multi()
  //     .scard("alldevices0713")
  //     .smembers("alldevices0713")
  //     .keys("*", function (err, replies) {
  //         // NOTE: code in this callback is NOT atomic
  //         // this only happens after the the .exec call finishes.
  //         client.mget(replies, redis.print);
  //     })
  // client.get('alldevices0713', (err, reply)=> {
  //     console.log(reply);
  //     console.log(err); // => 'The connection has already been closed.'
  // });

}

module.exports = startsender;

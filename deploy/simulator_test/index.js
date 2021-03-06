// const update_device = require('./src/update_device');
const config = require('./src/config');
const testquery = require('./src/testquery');
const mongoose     = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodburl,{
    useMongoClient: true,
    // This options is 1 second by default, its possible the ha
    // takes longer than 30 seconds to recover.
    reconnectInterval: 5000,
    // This options is 30 by default, why not make it 60
    reconnectTries: Number.MAX_VALUE
  });


console.log(`mongodburl:${config.mongodburl}`);

mongoose.connection.on("connected",function(){
  console.log("mongoose connect sucess");
  setTimeout(()=>{
    testquery.do_test_query_skip();
  },2000);

})


// testquery.do_test_query_skip();

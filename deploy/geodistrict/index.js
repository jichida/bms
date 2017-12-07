const mongoose     = require('mongoose');
const config = require('./src/config');
const entry = require('./src/getgeodatas');

mongoose.Promise = global.Promise;
mongoose.connect(config.mongodburl,{
    useMongoClient: true,
    // This options is 1 second by default, its possible the ha
    // takes longer than 30 seconds to recover.
    reconnectInterval: 5000,
    // This options is 30 by default, why not make it 60
    reconnectTries: Number.MAX_VALUE
});

entry.start();

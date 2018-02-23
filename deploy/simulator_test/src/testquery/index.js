const db = require('../db/models.js');
const mongoose     = require('mongoose');
const moment = require('moment');
const schmodel = {
  urlname:'/historydevice',
  schema:db.HistoryDeviceSchema,
  collectionname:'historydevice',
};

const do_test_query_paginate = ()=>{
  const organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
  const dbModel = mongoose.model(schmodel.collectionname, schmodel.schema);
  let query = {};
  query['organizationid'] = organizationid;

  const options = {"sort":{"SN64":-1},"page":1,"limit":100};
  const querynew = query;
  console.log(`do_test_query_paginate==>[${schmodel.collectionname}]query start==>${JSON.stringify(querynew)}--->\n \
  optionst==>${JSON.stringify(options)}\n-->${moment().format('HH:mm:ss')}`);
  dbModel.paginate(querynew, options,(err,result)=>{
    console.log(`do_test_query_paginate==>[${schmodel.collectionname}]query end--->${moment().format('HH:mm:ss')}`);
  });

};

const do_test_query_skip = ()=>{
  const organizationid = mongoose.Types.ObjectId("599af5dc5f943819f10509e6");
  const dbModel = mongoose.model(schmodel.collectionname, schmodel.schema);
  let query = {};
  query['organizationid'] = organizationid;

  const options = {"sort":{"SN64":-1},"page":1,"limit":100};
  const querynew = query;
  console.log(`[do_test_query_skip==>${schmodel.collectionname}]query start==>${JSON.stringify(querynew)}--->\n \
  optionst==>${JSON.stringify(options)}\n-->${moment().format('HH:mm:ss')}`);
  const queryexec = dbModel.find(querynew).select({}).limit(100).skip(0);
  queryexec.exec((err,list)=>{
     console.log(`[do_test_query_skip==>${schmodel.collectionname}]query end--->${moment().format('HH:mm:ss')}`);
  });

};


exports.do_test_query_paginate = do_test_query_paginate;
exports.do_test_query_skip = do_test_query_skip;

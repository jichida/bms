const _ = require('lodash');
const csvwriter = require('csvwriter');
const DBModels = require('./models.js');
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('UTF-8', 'GBK');
const moment  = require('moment');
const async = require('async');
const config = require('../config');
const fs = require('fs');
const debug = require('debug')('srvinterval:export');
const winston = require('../log/log.js');

const startexport = ({filename,csvfields,messages,fn_convert},callbackfn)=>{
  const filepath = `${filename}`;
  // debug(`start filepath--->${filepath}`);
  const res = fs.createWriteStream(filepath,{
    encoding:'ascii',
    autoClose: false
  });
  // console.log(iconv.convert(csvfields));
  res.write(iconv.convert(csvfields));
  res.write(iconv.convert('\n'));

  let fnsz = [];
  for(let i = 0 ;i < messages.length ;i ++){
    fnsz.push((callbackfn2)=>{
      const doc = messages[i];
      fn_convert(doc,(newdoc)=>{
        csvwriter(newdoc, {header: false, fields: csvfields}, (err, csv)=> {
          if (!err && !!csv ) {
             res.write(iconv.convert(csv));
           }
           process.nextTick(()=>{
             callbackfn2(null,true);//这里可能是同步方法，导致async RangeError: Maximum call stack size exceeded
           });
         });
      });
    });
  }
  async.series(fnsz,(err,result)=>{
    res.end('',()=>{
      debug(`close filepath--->${filepath}`);
      callbackfn(null,true);
    });
  });
};


module.exports= startexport;

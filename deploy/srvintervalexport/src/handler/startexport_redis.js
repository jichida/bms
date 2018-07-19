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
  let res;
  if(!fs.existsSync(filepath)){
    debug(`文件不存在,则新建 filepath--->${filepath},个数:${messages.length}`);
    //文件不存在,则新建
    res = fs.createWriteStream(filepath,{
      encoding:'ascii',
      autoClose: false,
      flags: 'w'
    });
    res.write(iconv.convert(csvfields));
    res.write(iconv.convert('\n'));
  }
  else{
    debug(`追加方式写文件 filepath--->${filepath},个数:${messages.length}`);
    //打开，追加的方式写
    res = fs.createWriteStream(filepath,{
      encoding:'ascii',
      autoClose: false,
      flags: 'a+'
    });
      //https://nodejs.org/docs/latest-v6.x/api/fs.html#fs_fs_createwritestream_path_options
      //Modifying a file rather than replacing it may require a flags mode of r+ rather than the default mode w.     });
  }
  // console.log(iconv.convert(csvfields));

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
      debug(`文件写完filepath--->${filepath}`);
      callbackfn(null,true);
    });
  });
};


module.exports= startexport;

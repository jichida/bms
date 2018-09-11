const _ = require('lodash');
const csvwriter = require('csvwriter');
const DBModels = require('./models.js');
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('UTF-8', 'GBK');
const moment  = require('moment');
const config = require('../config');
const fs = require('fs');
const debug = require('debug')('srvinterval:export');
const winston = require('../log/log.js');

const startexport = ({filename,dbModel,sort,fields,csvfields,fn_convert,query},callbackfn)=>{
  // const filename = 'db-data-' + new Date().getTime() + '.csv';
  // res.set({'Content-Disposition': 'attachment; filename=\"' + filename + '\"', 'Content-type': 'text/csv;charset=GBK'});
  // write BOM
  // res.write('\ufeff');
  // res.write(new Buffer('\xEF\xBB\xBF','binary'));

  const filepath = `${filename}`;

  debug(`start filepath--->${filepath}`);
  const res = fs.createWriteStream(filepath,{
    encoding:'ascii',
    autoClose: false
  });
  // console.log(iconv.convert(csvfields));
  try{
    res.write(iconv.convert(csvfields));
  }
  catch(e){
    res.write(csvfields);
    winston.getlog().info(`${filename}非法:${csvfields}`);
  }
  res.write(iconv.convert('\n'));
  // const res = fs.createWriteStream(filepath,{
  //   autoClose: false
  // });
  // res.write(csvfields);
  // res.write('\n');
  let icount = 0;
  // 'timeout: true' gets translated by the mongodb driver into a `noCursorTimeout` http://mongodb.github.io/node-mongodb-native/2.0/api/Cursor.html#addCursorFlag
  const cursor = dbModel.find(query,fields,{ timeout: true }).sort(sort).lean().cursor();
  cursor.on('error', (err)=> {
    winston.getlog().info(`${filename}游标关闭,iserr:${!!err}`);
    if(!!err){
      winston.getlog().info(`${filename}游标关闭,ERR:${JSON.stringify(err)}`);
    }
    res.end('',()=>{
      debug(`end file--->${filename}`);
      if(icount === 0){
        //delete file
        fs.unlinkSync(filename);
      }
      debug(`end file--->${filename}`);
      callbackfn(null,true);
    });
  });

  cursor.on('data', (doc)=>
  {
      icount++;
      // doc = JSON.parse(JSON.stringify(doc));
      // debug(`get record->${doc.DataTime}`)
      fn_convert(doc,(newdoc)=>{
        csvwriter(newdoc, {header: false, fields: csvfields}, (err, csv)=> {
         if (!err && !!csv ) {
           try{
             res.write(iconv.convert(csv));
           }
           catch(e){
             res.write(csv);
             winston.getlog().info(`${filename}非法:${csv}`);
           }
         }
         });
      });
  }).
  on('end', ()=> {
      res.end('',()=>{
        debug(`end file--->${filename}`);
        if(icount === 0){
          //delete file
          fs.unlinkSync(filename);
        }
        callbackfn(null,true);
      });
  });
};


module.exports= startexport;

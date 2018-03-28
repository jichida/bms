const _ = require('lodash');
const csvwriter = require('csvwriter');
const DBModels = require('./models.js');
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('UTF-8', 'GBK');
const moment  = require('moment');
const config = require('../config');
const fs = require('fs');
const debug = require('debug')('srvinterval');

const startexport = ({filename,dbModel,sort,fields,csvfields,fn_convert,query})=>{
  // const filename = 'db-data-' + new Date().getTime() + '.csv';
  // res.set({'Content-Disposition': 'attachment; filename=\"' + filename + '\"', 'Content-type': 'text/csv;charset=GBK'});
  // write BOM
  // res.write('\ufeff');
  // res.write(new Buffer('\xEF\xBB\xBF','binary'));

  const filepath = `${config.exportdir}/${filename}`;

  debug(`start filepath--->${filepath}`);
  const res = fs.createWriteStream(filepath,{
    encoding:'ascii',
    autoClose: false
  });
  // console.log(iconv.convert(csvfields));
  res.write(iconv.convert(csvfields));
  res.write(iconv.convert('\n'));

  const cursor = dbModel.find(query,fields).sort(sort).lean().cursor();
  cursor.on('error', (err)=> {
    // console.log(`算结束了啊..............`);
    res.end('');
    debug(`end file--->${filename}`);
  });

  cursor.on('data', (doc)=>
  {
      // doc = JSON.parse(JSON.stringify(doc));
      // debug(`get record->${doc.DataTime}`)
      fn_convert(doc,(newdoc)=>{
        csvwriter(newdoc, {header: false, fields: csvfields}, (err, csv)=> {
         if (!err && !!csv ) {
             res.write(iconv.convert(csv));
           }
         });
      });
  }).
  on('end', ()=> {
    setTimeout(()=> {
      res.end('');
      debug(`end file--->${filename}`);
    }, 2000);
  });
};


module.exports= startexport;

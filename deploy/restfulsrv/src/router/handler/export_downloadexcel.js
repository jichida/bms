const _ = require('lodash');
const csvwriter = require('csvwriter');
const uuid = require('uuid');
const getdevicesids = require('../../handler/getdevicesids');
const DBModels = require('../../db/models.js');
const Iconv = require('iconv').Iconv;
const iconv = new Iconv('UTF-8', 'GBK');
const PubSub = require('pubsub-js');
const moment  = require('moment');
const requestIp = require('request-ip');

const startdownload = ({req,res,dbModel,fields,csvfields,fn_convert,query})=>{
  const filename = 'db-data-' + new Date().getTime() + '.csv';
  res.set({'Content-Disposition': 'attachment; filename=\"' + filename + '\"', 'Content-type': 'text/csv;charset=GBK'});
  // write BOM
  // res.write('\ufeff');
  // res.write(new Buffer('\xEF\xBB\xBF','binary'));
  //console.log(iconv.convert(csvfields));
  res.write(iconv.convert(csvfields));
  res.write(iconv.convert('\n'));

  let cancelRequest = false;
  req.on('close', (err)=>{
     cancelRequest = true;
  });

  const cursor = dbModel.find(query,fields).cursor();
  cursor.on('error', (err)=> {
    //console.log(`算结束了啊..............`);
    res.end('');
  });

  cursor.on('data', (doc)=>
  {
    if(cancelRequest){
      cursor.close();
      //console.log(`取消下载了..............`);
    }
    else{
      doc = JSON.parse(JSON.stringify(doc));
      fn_convert(doc,(newdoc)=>{
        csvwriter(newdoc, {header: false, fields: csvfields}, (err, csv)=> {
         if (!err && !!csv && !cancelRequest) {
             //console.log(csv);
             //console.log(iconv.convert(csv));
             res.write(iconv.convert(csv));
           }
         });
       });
    }
  }).
  on('end', ()=> {
    setTimeout(()=> {
      res.end('');
    }, 2000);
  });
};

const export_downloadexcel = ({req,res,dbModel,fields,csvfields,fn_convert,name})=>{
  let query = {};

  const tokenid = req.body.tokenid;
  const dbExportModel = DBModels.ExportTokenModel;
  dbExportModel.findOneAndUpdate({tokenid}, {$set:{
    tokenid:uuid.v4()
  }},{new: true}).lean().exec((err,tokenobj)=>{
    if(!err && !!tokenobj){
      try{
        query = JSON.parse(tokenobj.queryobjstring);
      }
      catch(e){
        //console.log(e);
      }

     getdevicesids(tokenobj.userid,({devicegroupIds,deviceIds,isall})=>{
         if(!query.DeviceId && !isall){
           query.DeviceId = {'$in':deviceIds};
         }
         const userlog = {
           remoteip:requestIp.getClientIp(req) || '',
           creator:tokenobj.userid,
           created_at:moment().format('YYYY-MM-DD HH:mm:ss'),
           logtxt:`用户导出${name}数据`
         };
         PubSub.publish('userlog_data',userlog);

         startdownload({req,res,dbModel,fields,csvfields,fn_convert,query});
       });
    }
  });

}

module.exports= export_downloadexcel;

const DBModels = require('../db/models.js');
const path = require('path');
const fs = require('fs');
const config = require('../config.js');
const moment  = require('moment');
const middlewareauth = require('./middlewareauth.js');
const formidable = require('formidable');
const util = require('util');
const importexcel_device = require('./handler/importexcel_device.js');
const importexcel_user = require('./handler/importexcel_user.js');
const debug = require('debug')('srvapp:uploadexcel');

const startuploader = (app)=>{
  app.get('/uploadexcel/:resourcename',(req,res)=>{
    const resourcename = req.params.resourcename;
    debug(`请使用Post方式上传${resourcename}`);
    res.status(200)
        .json({
          result:`请使用Post方式上传${resourcename}`,
        });
  });
  app.post('/uploadexcel/:resourcename',middlewareauth,(req,res)=>{
    //console.log("userid:" + req.userid);
    const resourcename = req.params.resourcename;
    debug(`Post方式上传${resourcename},请等待...`);

    let importexcel;
    if(resourcename === 'device'){
      importexcel = importexcel_device;
    }
    else if(resourcename === 'user'){
      importexcel = importexcel_user;
    }
    else{
      res.status(200)
          .json({
            result:'Error',
          });
      return;
    }
    // let data = req.body;
    // data.userid = req.userid;
    // let userModel = mongoose.model('UserRider', DBModels.UserRiderSchema);

     const form = new formidable.IncomingForm();
     form.uploadDir = path.join(__dirname,config.uploaddir);
     form.keepExtensions = true;

     form.parse(req, (err, fields, files)=> {
      //  //console.log('file name:' + util.inspect({fields: fields, files: files}));
      //  //console.log('file name:' + files['file'].path);
       let basename = path.basename(files['file'].path);
       let extname = path.extname(fields['filename']);
       let filename = basename + extname;
       const targetfile = `${files['file'].path}${extname}`;
       fs.rename(files['file'].path,targetfile,(err)=>{
         if(err){
           res.status(200)
               .json({
                 result:'Error',
               });
         }
         else{
           importexcel(targetfile,req.userid,(resultjson)=>{
              res.status(200)
                  .json({
                    result:'OK',
                    data:resultjson
                  });
           });
         }
       })

     });
    //  form.on('file', (name, file)=> {
    //    ////console.log("file name:" + name);
    //    ////console.log("file file:" + JSON.stringify(file));
    //  });
     form.on('progress', (bytesReceived, bytesExpected)=> {
      //  //console.log('已接受:' + bytesReceived);
      //  //console.log('一共:' + bytesExpected);
     });

  });

}

module.exports= startuploader;

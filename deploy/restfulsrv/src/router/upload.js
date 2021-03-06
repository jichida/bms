const DBModels = require('../db/models.js');
const path = require('path');
const fs = require('fs');
const config = require('../config.js');
const moment  = require('moment');
const middlewareauth = require('./middlewareauth.js');
const formidable = require('formidable');
const util = require('util');

const startuploader = (app)=>{
  app.post('/upload',middlewareauth,(req,res)=>{
    ////console.log("userid:" + req.userid);
    // let data = req.body;
    // data.userid = req.userid;
    // let userModel = mongoose.model('UserRider', DBModels.UserRiderSchema);

     var form = new formidable.IncomingForm();
     form.uploadDir = config.uploaddir;
     //form.keepExtensions = true;

     form.parse(req, (err, fields, files)=> {
       ////console.log('file name:' + util.inspect({fields: fields, files: files}));
       ////console.log('file name:' + files['file'].path);
       let basename = path.basename(files['file'].path);
       let extname = path.extname(fields['filename']);
       let filename = basename + extname;
       fs.rename(files['file'].path,files['file'].path+extname,(err)=>{
         if(err){
           res.status(200)
               .json({
                 result:'Error',
               });
         }
         else{
           res.status(200)
               .json({
                 result:'OK',
                 data:{
                   url:config.uploadurl + '/' + filename
                 }
               });
         }
       })

     });
    //  form.on('file', (name, file)=> {
    //    ////console.log("file name:" + name);
    //    ////console.log("file file:" + JSON.stringify(file));
    //  });
     form.on('progress', (bytesReceived, bytesExpected)=> {
       ////console.log('已接受:' + bytesReceived);
       ////console.log('一共:' + bytesExpected);
     });

  });

}

module.exports= startuploader;

const path = require('path');
const fs = require('fs');
const config = require('../config.js');
const moment  = require('moment');
const middlewareauth = require('./middlewareauth.js');
const formidable = require('formidable');
const util = require('util');
const importexcel = require('./handler/importexcel');
const upload = require('jquery-file-upload-middleware');
const startuploader = (app)=>{
  const uploaddir = path.join(__dirname,config.uploaddir);

  console.log('uploaddir:' + uploaddir);
  upload.configure({
    accessControl: {
        allowOrigin: '*',
        allowMethods: 'POST'
    },
  });

  upload.on("begin", function(fileInfo){
    fileInfo.name = `${uuid.v4()}.xls`;
    console.log(`开始上传文件:${JSON.stringify(fileInfo)}`);
  });

  upload.on('error', function(e, req, res){
      console.log(e.message);
  });

  upload.on('end', function(fileInfo, req, res) {
    console.log(`文件上次完成:${JSON.stringify(fileInfo)}`);
  });

  app.use('/importexcel',middlewareauth,function(req, res, next ){

    console.log(`开始处理上传文件`);
    upload.fileHandler({
      uploadDir: uploaddir,
      uploadUrl: config.uploadurl,
    })(req,res, next);
  });
}

module.exports= startuploader;

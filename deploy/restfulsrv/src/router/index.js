const startrouter = (app)=>{
  require('./excelupload.js')(app);
  require('./useradmin.js')(app);
  require('./useradmincustom.js')(app);
  require('./m2mgw.js')(app);
  require('./deviceextimport.js')(app);
};


exports.startrouter = startrouter;

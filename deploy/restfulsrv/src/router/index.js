let startrouter = (app)=>{
  require('./upload.js')(app);
  require('./useradmin.js')(app);
  require('./useradmincustom.js')(app);
  require('./test.js')(app);
};


exports.startrouter = startrouter;

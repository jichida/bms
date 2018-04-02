const winston = require('./log/log.js');
const config = require('./config.js');
const handleuserpc = require('./handler/pc/index.js');
const handleuserapp = require('./handler/app/index.js');
const PubSub = require('pubsub-js');
const usersubfn = require('./handler/socketsubscribe');
const uuid = require('uuid');
const srvsystem = require('./srvsystem.js');

const startwebsocketsrv = (http)=>{
  let io = require('socket.io')(http);

  io.on('connection', (socket)=>{
    //console.log('a user connected');

    let ctx = {
      connectid:uuid.v4()
    };//for each connection
    usersubfn(socket,ctx);
    //ctx.tokensubscribe = PubSub.subscribe('allmsg', ctx.userSubscriber);

    socket.on('pc',(payload)=>{
      if(!ctx.usertype){
        ctx.usertype = 'pc';
      }
      // //console.log('\npc get message:' + JSON.stringify(payload));
      winston.getlog().info('ctx:', JSON.stringify(ctx));
      handleuserpc(socket,payload,ctx);
    });

    socket.on('app',(payload)=>{
      if(!ctx.usertype){
        ctx.usertype = 'app';
      }
      // //console.log('\napp get message:' + JSON.stringify(payload));
      winston.getlog().info('ctx:', JSON.stringify(ctx));
      handleuserapp(socket,payload,ctx);
    });


    socket.on('error',(err)=>{
      if(!!ctx.userid){
        srvsystem.loginuser_remove(ctx.userid,ctx.connectid);//开始监听
      }
      PubSub.unsubscribe( ctx.userDeviceSubscriber );
      socket.disconnect(true);
    });

    socket.on('disconnect', ()=> {
      if(!!ctx.userid){
        srvsystem.loginuser_remove(ctx.userid,ctx.connectid);//开始监听
      }
      PubSub.unsubscribe( ctx.userDeviceSubscriber );
    });
  });

};

exports.startsrv = startwebsocketsrv;

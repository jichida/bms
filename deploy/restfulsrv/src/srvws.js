const winston = require('./log/log.js');
const config = require('./config.js');
const handleuserpc = require('./handler/pc/index.js');
const handleuserapp = require('./handler/app/index.js');
const handlefullpc = require('./handler/fullpc/index.js');
const handlefullapp = require('./handler/fullapp/index.js');
const handleuserpcall = require('./handler/pcall/index.js');

const PubSub = require('pubsub-js');
const usersubfn = require('./handler/socketsubscribe');
const uuid = require('uuid');
const srvsystem = require('./srvsystem.js');
const debug = require('debug')('srvapp:ws');
const startwebsocketsrv = (http)=>{
  let io = require('socket.io')(http,{pingTimeout:180000});

  io.on('connection', (socket)=>{
    ////console.log('a user connected');
    debug(`socket connected`)
    let ctx = {
      socket:socket,
      connectid:uuid.v4(),
      remoteip:socket.handshake.headers['x-forwarded-for'] || socket.handshake.address.address
    };//for each connection
    usersubfn(socket,ctx);
    //ctx.tokensubscribe = PubSub.subscribe('allmsg', ctx.userSubscriber);

    socket.on('pc',(payload)=>{
      if(!ctx.usertype){
        ctx.usertype = 'pc';
      }
      handleuserpc(socket,payload,ctx);
    });

    socket.on('pcall',(payload)=>{
      if(!ctx.usertype){
        ctx.usertype = 'pcall';
      }
      handleuserpcall(socket,payload,ctx);
    });


    socket.on('app',(payload)=>{
      if(!ctx.usertype){
        ctx.usertype = 'app';
      }
      handleuserapp(socket,payload,ctx);
    });

    socket.on('fullpc',(payload)=>{
      if(!ctx.usertype){
        ctx.usertype = 'fullpc';
      }
      handlefullpc(socket,payload,ctx);
    });

    socket.on('fullapp',(payload)=>{
      if(!ctx.usertype){
        ctx.usertype = 'fullapp';
      }
      handlefullapp(socket,payload,ctx);
    });


    socket.on('error',(err)=>{
      debug(`err:${ctx.userid},${ctx.connectid}`);
      if(!!ctx.userid){
        srvsystem.loginuser_remove(ctx.userid,ctx.connectid);//开始监听
      }
      PubSub.unsubscribe( ctx.userDeviceSubscriber );
      socket.disconnect(true);
    });

    socket.on('disconnect', (reason)=> {
      debug(`disconnect:${ctx.userid},${ctx.connectid}:${reason}`);
      if(!!ctx.userid){
        srvsystem.loginuser_remove(ctx.userid,ctx.connectid);//开始监听
      }
      PubSub.unsubscribe( ctx.userDeviceSubscriber );
    });
  });

};

exports.startsrv = startwebsocketsrv;

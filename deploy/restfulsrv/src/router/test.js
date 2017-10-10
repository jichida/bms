const map = require('lodash.map');
const device = require('../handler/common/device.js');
const historytrack = require('../handler/common/historytrack');

let startmodule = (app)=>{
  //获取所有地理位置
  app.get('/api/getdevicegeo',(req,res)=>{
    device.querydevice({
      query:{},
      fields:{
        'DeviceId':1,
        'LastHistoryTrack':1,
        'imagetype':1,
        'TPData':1,
        'updated_at':1,
      }
    },{},(result)=>{
      if(result.cmd === 'querydevice_result'){
        res.status(200).json({list:result.payload.list});
      }
      else{
        callback({list:[]});
      }
    });
  });

  //设置设备数据(地理位置\胎压）
  app.post('/api/setdevicegeo',(req,res)=>{
      console.log(`get data:${JSON.stringify(req.body)}`);
      const data = req.body;
      map(data,(item,index)=>{
        let Speed = item.Speed;
        let Course = item.Course;
        try{
          if(typeof item.Speed === 'string'){
            Speed = parseFloat(item.Speed);
          }
        }
        catch(e){
          Speed = 0;
        }
        try{
          if(typeof item.Course === 'string'){
            Course = parseFloat(item.Course);
          }
        }
        catch(e){
          Course = 0;
        }
        let item2 = {};
        item2.imagetype = '0';
        item2.DeviceId = item.deviceid;
        item2.LastHistoryTrack = {
          Latitude:parseFloat(item.Latitude),
          Longitude:parseFloat(item.Longitude),
          GPSStatus:item.GPSStatus,
          Speed: Speed,
          Course: Course,
        };
        item2.TPData = {
          "DataTime": item.DataTime,
          "TP1":item.TP1,
          "TP2":item.TP2,
          "TP3":item.TP3,
          "TP4":item.TP4,
          "TP5":item.TP5,
        }
        device.savedevice(item2,{},(err,result)=>{

        });
      });

      res.status(200).json({result:'OK'});
  });

  //获取轨迹回放数据
  app.post('/api/gethistorytrack',(req,res)=>{
    const actiondata = req.body;
    historytrack.queryhistorytrack(actiondata,{},(result)=>{
      if(result.cmd === 'queryhistorytrack_result'){
        res.status(200).json({list:result.payload.list});
      }
      else{
        callback({list:[]});
      }
    });
  });




};

module.exports=  startmodule;

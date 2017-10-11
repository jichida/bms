const map = require('lodash.map');
const device = require('../handler/common/device.js');

const tydata = [
  {
    "deviceid": "1707200001",
    "GPSStatus": "A",
    "Longitude": "121.777376",
    "Latitude": "31.107271",
    "Speed": "0",
    "Course": "0",
    "DataTime": "2017/9/21 13:33:59",
    "TP1": "255",
    "TP2": "29",
    "TP3": "255",
    "TP4": "255",
    "TP5": "0"
},
{
    "deviceid": "1707200016",
    "GPSStatus": "A",
    "Longitude": "121.777424",
    "Latitude": "31.107333",
    "Speed": "0",
    "Course": "0",
    "DataTime": "2017/9/21 12:08:09",
    "TP1": "255",
    "TP2": "29",
    "TP3": "255",
    "TP4": "255",
    "TP5": "0"
},
{
    "deviceid": "1707200020",
    "GPSStatus": "A",
    "Longitude": "121.572675",
    "Latitude": "31.222501",
    "Speed": "26",
    "Course": "342",
    "DataTime": "2017/9/29 17:01:11",
    "TP1": "25",
    "TP2": "23",
    "TP3": "27",
    "TP4": "27",
    "TP5": "0"
}];

let jsondata = [];
map(tydata,(item,index)=>{
  // item = {...jsondataexport[index],...item};
  let item2 = {};
  item2.imagetype = '0';
  item2.DeviceId = item.deviceid;
  item2.LastHistoryTrack = {
    Latitude:parseFloat(item.Latitude),
    Longitude:parseFloat(item.Longitude),
    GPSStatus:item.GPSStatus,
    Speed: item.Speed,
    Course: item.Course,
  };
  item2.TPData = {
    "DataTime": item.DataTime,
    "TP1":item.TP1,
    "TP2":item.TP2,
    "TP3":item.TP3,
    "TP4":item.TP4,
    "TP5":item.TP5,
  }
  jsondata.push(item2);
});

exports.getjsondata = (callback)=>{
   device.querydevice({
     query:{},
     fields:{
       'DeviceId':1,
       'LastHistoryTrack':1,
       'imagetype':1,
       'TPData':1
     }
   },{},(result)=>{
     if(result.cmd === 'querydevice_result'){
       callback(result.payload.list);
     }
     else{
       callback([]);
     }
   });
}

exports.setjsondata = (data)=>{
  // jsondata = [];
  map(data,(item,index)=>{
    let item2 = {};
    item2.imagetype = '0';
    item2.DeviceId = item.deviceid;
    item2.LastHistoryTrack = {
      Latitude:parseFloat(item.Latitude),
      Longitude:parseFloat(item.Longitude),
      GPSStatus:item.GPSStatus,
      Speed: item.Speed,
      Course: item.Course,
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
}

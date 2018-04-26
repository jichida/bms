const _ = require('lodash');

let config_globalhistorydevicetable = {};
const datasin = [
  {
    "DataTime" : "2018-04-02 15:30:43",
     "DeviceId" : "1727101117",
  },
  {
    "DataTime" : "2018-04-02 15:32:43",
     "DeviceId" : "1727101117",
  },
  {
    "DataTime" : "2018-04-02 15:33:43",
     "DeviceId" : "1727101117",
  },
  {
    "DataTime" : "2018-04-02 15:30:43",
     "DeviceId" : "1727101117",
  },
  {
    "DataTime" : "2018-04-02 15:30:43",
     "DeviceId" : "1727101117",
  },
];

let datas = [];
_.map(datasin,(o)=>{
  if(!config_globalhistorydevicetable[o.DeviceId]){
    //找不到
    datas.push(o);
    config_globalhistorydevicetable[o.DeviceId] = o.DataTime;
  }
  else{
    if(config_globalhistorydevicetable[o.DeviceId] !== o.DataTime){
      datas.push(o);
      config_globalhistorydevicetable[o.DeviceId] = o.DataTime;
    }
  }
});
console.log(`datas===>${JSON.stringify(datas)}`);

const _ = require('lodash');
const config = require('../config.js');

const getalarmfieldtotxt = (alarmfield)=>{
    const mapdict = config.mapdict;
    if(_.startsWith(alarmfield, 'AL_') || _.startsWith(alarmfield, 'F[')){
      if(_.startsWith(alarmfield, 'AL_')){
        if(!!mapdict[alarmfield]){
           if(!!mapdict[alarmfield].showname){
             return mapdict[alarmfield].showname;
           }
        }
      }
      // console.log(alarmfield);
      return alarmfield;
    }
    return undefined;
};

const getalarmtxt = (alarminfo)=>{
  let alarmtxt = '';
  let alarminfotmp = _.clone(alarminfo);
  let rest = _.omit(alarminfotmp,['_id','CurDay','DeviceId','__v','DataTime','warninglevel','Longitude','Latitude']);
  // console.log(`rest===>${JSON.stringify(rest)}`);
  _.map(rest,(v,key)=>{
    let keytxt = getalarmfieldtotxt(key);
    if(!!keytxt){
      alarmtxt += `${keytxt} ${v}次|`
    }
  });
  return alarmtxt;
}

const bridge_alarminfo = (alarminfo)=>{
  // //console.log(`alarminfo===>${JSON.stringify(alarminfo)}`);
  let alarmtxt = '';
  let alarminfonew = {};
  alarminfonew[`key`] = alarminfo._id;
  alarminfonew[`车辆ID`] = alarminfo[`DeviceId`];
  alarminfonew[`报警时间`] = alarminfo[`DataTime`];
  alarminfonew[`报警等级`] = alarminfo[`warninglevel`];

  let alarminfotmp = _.clone(alarminfo);
  let rest = _.omit(alarminfotmp,['_id','CurDay','DeviceId','__v','DataTime','warninglevel','Longitude','Latitude']);
  // //console.log(`rest===>${JSON.stringify(rest)}`);
  _.map(rest,(v,key)=>{
    let keytxt = getalarmfieldtotxt(key);
    if(!!keytxt){
      alarmtxt += `${keytxt} ${v}次|`
    }

  });

  alarminfonew[`报警信息`] = alarmtxt;
  // //console.log(`alarminfonew===>${JSON.stringify(alarminfonew)}`);
  return alarminfonew;
}

exports.getalarmfieldtotxt = getalarmfieldtotxt;
exports.getalarmtxt = getalarmtxt;
exports.bridge_alarminfo = bridge_alarminfo;

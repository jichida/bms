import { fetchJson } from '../../util/fetch.js';
import config from '../../env/config';
import _ from 'lodash';

let deviceoptions = [];
let mapdevices = {};
let mapdevices_r = {};
const startLoadDeviceOptions = (callbackfn)=>{
  const query = {};
  const label = 'DeviceId';
  const value = '_id';
  const url = `${config.admincustomapi}/device`;
  const token = localStorage.getItem('admintoken');
  let fields = {};
  fields[label] = 1;
  fields[value] = 1;
  const options = {
    method:'POST',
    headers: new Headers({
     'Accept': 'application/json',
     'Content-Type': 'application/json',
     'Authorization': `Bearer ${token}`
    }),
    body: JSON.stringify({
      query,
      fields
    })
  };

  fetchJson(url,options).then(({json})=>{
     console.log(json);
     deviceoptions = [];
      _.map(json,(v)=>{
        deviceoptions.push({
          label:v[label],
          value:v[value]
        });
        mapdevices[v[value]] = v[label];
        mapdevices_r[v[label]] = v[value];
      });
      callbackfn(deviceoptions);
  }).catch((e)=>{
    callbackfn([]);
  });

}

const getDeviceOptions = ()=>{
 return (input,callback) => {
      if(deviceoptions.length > 0){
        callback(null, { options: deviceoptions ,complete: true});
      }
      else{
        startLoadDeviceOptions((options)=>{
            callback(null, { options ,complete: true});
        });
      }
  };
}


export {startLoadDeviceOptions,getDeviceOptions,mapdevices,mapdevices_r};

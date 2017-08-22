export const getgroupnamebydevice = (deviceinfo)=>{
  let groupinfo = {
    _id:'0',
    name:`未分组`
  };
  if(typeof deviceinfo.DeviceId === 'string'){
    let devid = parseInt(deviceinfo.DeviceId);
    groupinfo = {
      _id:`${devid%200}`,
      name:`分组${devid%200}`
    }
  }
  return groupinfo;
}

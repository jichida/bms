import _ from 'lodash';

//地图上点图标的样式【图标类型】
export const getgroupStyleMap = ()=>{
  let groupsz = [
    {
      name:'0',
      image:`${process.env.PUBLIC_URL}/images/bike.png`,
      width: 16,
      //高度
      height: 16,
      //定位点为中心
      offset: ['-50%', '-50%'],
      fillStyle: null,
    },
    {
      name:'1',
      image:`${process.env.PUBLIC_URL}/images/people.png`,
      width: 16,
      //高度
      height: 16,
      //定位点为中心
      offset: ['-50%', '-50%'],
      fillStyle: null,
    },
    {
      name:'2',
      image:`${process.env.PUBLIC_URL}/images/truck.png`,
      width: 16,
      //高度
      height: 16,
      //定位点为中心
      offset: ['-50%', '-50%'],
      fillStyle: null,
    },
    {
      name:'3',
      image:`${process.env.PUBLIC_URL}/images/taxi.png`,
      width: 16,
      //高度
      height: 16,
      //定位点为中心
      offset: ['-50%', '-50%'],
      fillStyle: null,
    },
  ];
  return groupsz;
}

//弹出窗口样式
// adcode
// :
// "150782"
// city
// :
// "呼伦贝尔市"
// district
// :
// "牙克石市"
// formattedAddress
// :
export const getpopinfowindowstyle = (deviceitem)=>{
  let DeviceId = _.get(deviceitem,'DeviceId','');
  let txtLatitude = _.get(deviceitem,'LastHistoryTrack.Latitude','');
  let txtLongitude = _.get(deviceitem,'LastHistoryTrack.Longitude','');
  let adcode = _.get(deviceitem,'adcode','');
  let province = _.get(deviceitem,'province','');
  let city = _.get(deviceitem,'city','');
  let district = _.get(deviceitem,'district','');
  let formattedAddress = _.get(deviceitem,'formattedAddress','');

  return {
      infoTitle: `<p>设备id:<span class='color_warning'>${DeviceId}</span></p>`,
      infoBody: `<p>位置:纬度<span class='color_warning'>${txtLatitude}</span>,经度:<span class='color_warning'>${txtLongitude}</span> </p>
      <p>行政编码:<span class='color_warning'>${adcode}</span></p>
      <p>省市区:<span class='color_warning'>${province}${city}${district}</span></p>
      <p>地址:<span class='color_warning'>${formattedAddress}</span></p>`
  };
}

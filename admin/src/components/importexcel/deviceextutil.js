import _ from 'lodash';
const mapkeydeviceext1 = {
  "RDB编号": "DeviceId",
  "客服packno": "packnocs",
  "车工号（BUS）/VIN（CAR）": "buscarvin",
  "类型":"type",
  "容量": "capacity",
  "串联数": "serialnumber",
  "并联数": "parallelnumber",
  "电芯类型": "typeelectriccore",
  "CATL项目名称":"catlprojectname",
  "项目PN": "projectpn",
  "电池系统流水号": "batterysystemflownumber",
  "BMU硬件版本": "BMUhardwareversion",
  "CSC硬件版本": "CSChardwareversion",
  "BMU软件版本":"BMUsoftwareversion",
  "CSC软件版本": "CSCsoftwareversion",
  "电池入库日期":"datebatterystorage",
  "电池出货日期":"datebatterydelivery",
  "车辆生产厂": "vehicleproductionplant",
  "车辆型号": "vehiclemodel",
  "装车日期":"dateloading",
  "整车出厂日期":"datevehiclefactory",
  "省份": "province",
  "地区": "area",
  "里程(暂无，保留)": "mileage",
  "客户名称": "customername",
  "客户联系地址":"customercontactaddress",
  "客户联系人": "customercontact",
  "客户联系电话":"customercontactphone",
  "客户移动电话": "customermobilephone",
  "用途": "purpose",
  "购买日期": "datepurchase",
  "新车上牌日期": "datenewcar",
  "车牌号":"licenseplatenumber",
  "售后外服姓名": "nameaftersaleservice",
  "开始使用年份":"usedyear",
};
const mapkeydeviceext2 = {
  "DeviceId": "RDB编号",
  "buscarvin":"车工号（BUS）/VIN（CAR）",
  "packnocs":"客服packno",
  "type":"类型",
  "capacity":"容量" ,
  "serialnumber":"串联数" ,
  "parallelnumber":"并联数",
  "typeelectriccore":"电芯类型",
  "catlprojectname":"CATL项目名称",
  "projectpn":"项目PN" ,
  "batterysystemflownumber": "电池系统流水号",
  "BMUhardwareversion":"BMU硬件版本",
  "CSChardwareversion":"CSC硬件版本",
  "BMUsoftwareversion":"BMU软件版本",
  "CSCsoftwareversion":"CSC软件版本",
  "datebatterystorage":"电池入库日期",
  "datebatterydelivery":"电池出货日期",
  "vehicleproductionplant": "车辆生产厂",
  "vehiclemodel":"车辆型号",
  "dateloading": "装车日期",
  "datevehiclefactory":"整车出厂日期",
  "province": "省份",
  "area": "地区",
  "mileage": "里程(暂无，保留)",
  "customername": "客户名称",
  "customercontact": "客户联系人",
  "customercontactphone":"客户联系电话",
  "customermobilephone":"客户移动电话",
  "purpose":"用途",
  "datepurchase":  "购买日期",
  "datenewcar":"新车上牌日期" ,
  "licenseplatenumber":"车牌号",
  "nameaftersaleservice": "售后外服姓名",
  "usedyear":"开始使用年份"
};

const requiredlistfield = [
  "DeviceId",
  // "packnocs","buscarvin","type","capacity","serialnumber",
  // "parallelnumber",	"typeelectriccore","catlprojectname","projectpn","batterysystemflownumber",
  // "BMUhardwareversion",	"CSChardwareversion","BMUsoftwareversion","CSCsoftwareversion","datebatterystorage",
  // "datebatterydelivery","vehicleproductionplant","vehiclemodel","dateloading","datevehiclefactory",
  // "province","area","mileage","customername","customercontactaddress",
  // "customercontact","customercontactphone","purpose","datepurchase","datenewcar",
  // "licenseplatenumber","nameaftersaleservice","usedyear"
];

const getfieldname = (key)=>{
  if(!!mapkeydeviceext1[key]){
    return mapkeydeviceext1[key];
  }
  return null;
}

const convertjson = (json)=>{
  let retjson = {};
  _.map(json,(v,k)=>{
    const newkey = getfieldname(k);
    if(!!newkey){
      retjson[newkey] = v;
    }
  });
  return retjson;
}

const isvaildjson = (jsonlist)=>{
  let errstring = '';
  if(jsonlist.length === 0){
    return '至少应导入一条记录';
  }
  const jsonv = jsonlist[0];
  _.map(requiredlistfield,(fieldname)=>{
    if(!jsonv[fieldname]){
      errstring += `${mapkeydeviceext2[fieldname]}必填`;
    }
  });
  if(errstring !== ''){
    return errstring;
  }
}
export {convertjson,isvaildjson};

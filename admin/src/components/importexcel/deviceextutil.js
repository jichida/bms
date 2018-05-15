import lodashmap from 'lodash.map';
const mapkeydeviceext1 = {
  "RDB编号": "DeviceId",
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
  "省份": "provice",
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
};

const getfieldname = (key)=>{
  if(!!mapkeydeviceext1[key]){
    return mapkeydeviceext1[key];
  }
  return key;
}

const convertjson = (json)=>{
  let retjson = {};
  lodashmap(json,(k,v)=>{
    retjson[getfieldname(k)] = v;
  })
  return retjson;
}

export {convertjson};

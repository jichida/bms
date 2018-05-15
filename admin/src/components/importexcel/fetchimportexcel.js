import ajv from 'ajv';
import convertjson from './deviceextutil';
//
const schemadevices =
{
  "type" : "array",
  "items" : { // "items" represents the items within the "users" array
				"type" : "object",
				"properties" : {
          	"DeviceId":  { "type" : "string" },
          	"buscarvin": { "type" : "string" },
          	"type": { "type" : "string" },
          	"capacity":  { "type" : "string" },
          	"serialnumber":  { "type" : "string" },
          	"parallelnumber":  { "type" : "string" },
          	"typeelectriccore": { "type" : "string" },
          	"catlprojectname": { "type" : "string" },
          	"projectpn": { "type" : "string" },
          	"batterysystemflownumber": { "type" : "string" },
          	"BMUhardwareversion": { "type" : "string" },
          	"CSChardwareversion": { "type" : "string" },
          	"BMUsoftwareversion":{ "type" : "string" },
          	"CSCsoftwareversion": { "type" : "string" },
          	"datebatterystorage": { "type" : "string" },
          	"datebatterydelivery":{ "type" : "string" },
          	"vehicleproductionplant": { "type" : "string" },
          	"vehiclemodel": { "type" : "string" },
          	"dateloading": { "type" : "string" },
          	"datevehiclefactory": { "type" : "string" },
          	"provice": { "type" : "string" },
          	"area": { "type" : "string" },
          	"mileage": { "type" : "string" },
          	"customername": { "type" : "string" },
          	"customercontactaddress":{ "type" : "string" },
          	"customercontact": { "type" : "string" },
          	"customercontactphone":{ "type" : "string" },
          	"customermobilephone": { "type" : "string" },
          	"purpose": { "type" : "string" },
          	"datepurchase": { "type" : "string" },
          	"datenewcar": { "type" : "string" },
          	"licenseplatenumber":{ "type" : "string" },
          	"nameaftersaleservice": { "type" : "string" },
          }
      }
};


const fetchimportfile = (jsondata)=>{
  console.log(jsondata);
  const retjson = convertjson(jsondata);
  console.log(retjson);
  // console.log(ajv.errors);
  // console.log(JSON.stringify(jsondata));
  return new Promise((resolve,reject) => {
      // const validation = ajv.validate(jsondata, schemadevices);
      // if (!validation) {
      //   resolve({
      //     issuccess:false,
      //     errmsg:ajv.errors
      //   });
      //   return;
      // }

    setTimeout(()=>{
      // i++;
      const result = {
        issuccess:false,
        successlist:[`1`,`2`,`3`],
        failedlist:[`4`,`5`],
        errmsg:`导入失败,无法辨识文件`
      };

      resolve(result);
    },5000);
  });
}

export default fetchimportfile;

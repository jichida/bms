// import Ajv from 'ajv';
import _ from 'lodash';
import {convertjson,isvaildjson} from './deviceextutil';
import {requestpostwithtoken, apiget} from '../../util/util.js';
// const ajv = new Ajv();
// //
// const schemadeviceext =
// {
//   "type" : "array",
//   "items" : { // "items" represents the items within the "users" array
// 				"type" : "object",
// 				"required": [ 
// 					"DeviceId","buscarvin","type","capacity","serialnumber",
// 					"parallelnumber",	"typeelectriccore","catlprojectname","projectpn","batterysystemflownumber",
// 					"BMUhardwareversion",	"CSChardwareversion","BMUsoftwareversion","CSCsoftwareversion","datebatterystorage",
// 					"datebatterydelivery","vehicleproductionplant","vehiclemodel","dateloading","datevehiclefactory",
// 					"province","area","mileage","customername","customercontactaddress",
// 					"customercontact","customercontactphone","purpose","datepurchase","datenewcar",
// 					"licenseplatenumber","nameaftersaleservice",
// 			],
// 				"properties" : {
//           	"DeviceId":  { "type" : "string" },
//           	"buscarvin": { "type" : "string" },
//           	"type": { "type" : "string" },
//           	"capacity":  { "type" : "string" },
//           	"serialnumber":  { "type" : "string" },
//           	"parallelnumber":  { "type" : "string" },
//           	"typeelectriccore": { "type" : "string" },
//           	"catlprojectname": { "type" : "string" },
//           	"projectpn": { "type" : "string" },
//           	"batterysystemflownumber": { "type" : "string" },
//           	"BMUhardwareversion": { "type" : "string" },
//           	"CSChardwareversion": { "type" : "string" },
//           	"BMUsoftwareversion":{ "type" : "string" },
//           	"CSCsoftwareversion": { "type" : "string" },
//           	"datebatterystorage": { "type" : "string" },
//           	"datebatterydelivery":{ "type" : "string" },
//           	"vehicleproductionplant": { "type" : "string" },
//           	"vehiclemodel": { "type" : "string" },
//           	"dateloading": { "type" : "string" },
//           	"datevehiclefactory": { "type" : "string" },
//           	"province": { "type" : "string" },
//           	"area": { "type" : "string" },
//           	"mileage": { "type" : "string" },
//           	"customername": { "type" : "string" },
//           	"customercontactaddress":{ "type" : "string" },
//           	"customercontact": { "type" : "string" },
//           	"customercontactphone":{ "type" : "string" },
//           	"customermobilephone": { "type" : "string" },
//           	"purpose": { "type" : "string" },
//           	"datepurchase": { "type" : "string" },
//           	"datenewcar": { "type" : "string" },
//           	"licenseplatenumber":{ "type" : "string" },
//           	"nameaftersaleservice": { "type" : "string" },
//           }
//       }
// };
// const validate = ajv.compile(schemadeviceext);

const fetchimportfile = (jsondata)=>{
	let listdeviceext = [];
	_.map(jsondata,(v)=>{
		listdeviceext.push(convertjson(v));
	});
	console.log(listdeviceext);
	return new Promise((resolve,reject) => {
		let errmsg = isvaildjson(listdeviceext);
		if(!!errmsg){
			resolve({
					issuccess:false,
					errmsg
			});
			return;
		}
		const token = localStorage.getItem('admintoken');
		requestpostwithtoken('/deviceextimport2',token,listdeviceext,(issuccess,msg)=>{
			if(issuccess){
				resolve({
					issuccess,
					id: msg.id
				})
			}
			if(!issuccess){
				resolve({
					issuccess:false,
					msg
				});
				return;
			}
			resolve(msg);
		});
		//<<----开始POST到服务器
			// const validation = validate(listdeviceext);
			// validation.then((validdata)=>{
			// 		const result = {
			// 			issuccess:true,
			// 			successlist:[`1`,`2`,`3`],
			// 			failedlist:[`4`,`5`],
			// 		};
			// 		resolve(result);
			// }).catch(function (err) {
			// 	if (!(err instanceof Ajv.ValidationError)) throw err;
			// 		// data is invalid
			// 		console.log('Validation errors:', err.errors);
			// 		resolve({
			// 				issuccess:false,
			// 				errmsg:err.errors
			// 		});
			// });
		});

}

const getPercent = (current, total) => {
    // Math.round(num / total * 10000) / 100.00
	let percent = Math.round(current/total * 100) ;
	let msg = current === total ? '数据导入成功' : `导⼊数据: ${current}/${total}`;

    return {
        percent,
        msg
    }
}

export const fetchimportpercent = (id) => {
	return new Promise((resolve,reject) => {
		apiget(`/getdeviceextimportstatus/${id}`, ({current, total, status})=>{
			if(status === 'error'){
				resolve({
					msg: '网络连接错误！'
				})
				return;
			}
			let { percent, msg } = getPercent(current, total);
			resolve({
				percent,
				msg
			});
		});
	})
}

export default fetchimportfile;

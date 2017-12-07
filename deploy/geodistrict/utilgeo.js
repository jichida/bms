const request = require("request");
const _ = require('lodash');

const key = "604128e90f0f7ca695c811e7ccf5d6f0";

const get_provice = (callback)=>{
  const options = {
     method: 'GET',
     url: `http://restapi.amap.com/v3/config/district?key=${key}&subdistrict=3&keywords=100000`,
     headers:
      {
        'content-type': 'application/json',
         'accept': 'application/json'
      }
    };

   request(options, function (error, response, body) {
     if (error) throw new Error(error);

       try{
         let resultobj = body;
         if(typeof resultobj === 'string'){
             resultobj= JSON.parse(body);
         }
        //  console.log(`resultobj:${JSON.stringify(resultobj)}`);
         if(resultobj.status == 1){
           let province = [];
           _.map(resultobj.districts[0].districts,(district)=>{
             province.push({
               adcode:district.adcode,
               name:district.name,
             });
           });
           callback(null,province);
         }

       }
       catch(e){
         console.log(`返回结果e:${JSON.stringify(e)}`);
       }
   });
}

get_provice((err,provinces)=>{
  console.log(`所有省份:${JSON.stringify(provinces)}`);
});


exports.get_provice = get_provice;

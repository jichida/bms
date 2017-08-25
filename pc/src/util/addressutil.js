import jsondataprovinces from './provinces.json';
import jsondatacities from './cities.json';
import jsondataareas from './areas.json';
import _ from 'lodash';

export const getadcodeinfo = (adcodei)=>{
  let adcode = adcodei + '';
  let resultobj = _.find(jsondataareas,(o)=>{return o.code === adcode;});
  if(!!resultobj){
    let resultobjcity = _.find(jsondatacities,(o)=>{return o.code === resultobj.parent_code;});
    if(!!resultobjcity){
      if(resultobjcity.name === '市辖区'){
        //直辖市特殊处理！！兼容目前方式
        return {
          level:'city',
          parent_code:parseInt(resultobjcity.parent_code)
        }
      }
    }
    return {
      level:'district',
      parent_code:parseInt(resultobj.parent_code)
    };
  }

  resultobj = _.find(jsondatacities,(o)=>{return o.code === adcode;});
  if(!!resultobj){
    return {
      level:'city',
      parent_code:parseInt(resultobj.parent_code)
    };
  }

  resultobj = _.find(jsondataprovinces,(o)=>{return o.code === adcode;});
  if(!!resultobj){
    return {
      level:'provice',
      parent_code:parseInt(resultobj.parent_code)
    };
  }
  
  return {
    level:'error',
    parent_code:100000
  }
}

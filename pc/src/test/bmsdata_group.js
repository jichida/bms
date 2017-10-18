import _ from 'lodash';
import jsondataprovinces from '../util/provinces.json';
import config from '../env/config';
const getrandom=(min,max)=>{
  return parseInt(Math.random()*(max-min+1)+min,10);
}

let groups = [];
if(config.softmode === 'pc'){
  _.map(jsondataprovinces,(v,index)=>{
    groups.push({
      _id:`${v.code}`,
      name:`${v.name}`
    });
  });
}
else{
  groups = [];
  for(let i=0;i<20;i++){
    let item = {
      _id:i+'',
      name:`ZZT_${getrandom(100,1000)}KWH`
    };
    groups.push(item);
  }
}

const test_dccs_text=['新能源科技','乐金化学','比亚迪','宁德时代','三星视界','力神电池','哈尔滨光宇','沃特玛电池','天贸电池'];
const test_djcs_text=['卧龙控股','佳木斯电机','南阳防爆','山东华力电机','湘潭电机','六安江淮电机'];
const test_dkcs_text=['北京电控','山西电控','宁德电控','上海电控','江苏电控'];
_.map(groups,(item,index)=>{
  item['key'] = index;
  item['电池厂商'] = test_dccs_text[getrandom(0,test_dccs_text.length-1)];
  item['电机厂商'] = test_djcs_text[getrandom(0,test_djcs_text.length-1)];
  item['电控厂商'] = test_dkcs_text[getrandom(0,test_dkcs_text.length-1)];
});
export {groups};

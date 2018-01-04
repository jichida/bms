import restClient from '../../restClient.js';
import config from '../../env/config';
import _ from 'lodash';

const getOptions = (resourcename,label,value)=>{
  return (input,callback) => {
    restClient('GET_LIST',resourcename,{
      pagination:{
        page:1,
        perPage:100
      },
      sort:{
        field:"id",
        order:'DESC'
      }
    }).then((json)=>{
      let options = [];
      if(!!json.data){
        _.map(json.data,(v)=>{
          options.push({
            label:v[label],
            value:v[value]
          });
        });
      }
      callback(null, { options: options ,complete: true});
    });
  }
}

export {getOptions};

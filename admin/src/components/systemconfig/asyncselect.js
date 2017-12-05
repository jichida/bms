import React, { Component } from 'react';
import { Async } from 'react-select';
import restClient from '../../restClient.js';
import config from '../../env/config';
import 'react-select/dist/react-select.css';
import _ from 'lodash';
// {"type":"GET_LIST","params":{"pagination":{"page":1,"perPage":100},"sort":{"field":"id","order":"DESC"},"filter":{"name_q":"AL_"}}}
const getOptions = (input,callback) => {
  restClient('GET_LIST','datadict',{
    // filter:{
    //   name_q:"AL_"
    // },
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
          label:v.showname,
          value:v.name
        });
      });
    }
    callback(null, { options: options ,complete: true});
  });
}

const renderSelect = ({ meta: { touched, error } = {}, input: { ...inputProps }, ...props }) =>{
  console.log(`renderSelect form ==>inputProps:${JSON.stringify(inputProps)},props:${JSON.stringify(props)}`)
  let onChange = (values)=>{
    let sz = values.split(',');
    inputProps.onChange(sz);
  }

  return (<Async
        multi
        onChange={onChange}
        value={inputProps.value}
        {...props}
        simpleValue
        loadOptions={getOptions}
    />);
}

// closeOnSelect={true}
// multi
// onChange={this.onSelectChange.bind(this)}
// options={this.props.selectoptions}
// placeholder="选择报警字段"
// simpleValue
// value={this.state.selectedvalue}
export default renderSelect;

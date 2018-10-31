import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import EditTable from './material-ui-table-edit.js';
import { Fields } from 'redux-form';
import Divider from 'material-ui/Divider';
import _ from 'lodash';

const renderAlaramRuleEdit = ({ meta: { touched, error } = {}, input: { ...inputProps }, ...props }) =>{
  console.log(`renderAlaramRuleEdit form ==>inputProps:${JSON.stringify(inputProps)},props:${JSON.stringify(props)}`);
  let vsz = inputProps.value;
  if(typeof vsz === 'string'){
    vsz = [];
  }
  let onDelete =(values)=>{
    console.log(`onDelete :${JSON.stringify(values)}`);
    let index = _.get(values,'rowId',-1);

    console.log(`onDelete index:${index}`);

    let newv = [];
    if(index !== -1 && index < vsz.length ){
      for(let i = 0;i < vsz.length; i++){
        if(i !== index){
          newv.push(vsz[i]);
        }
      }
    }
    else{
      newv = _.clone(vsz);
    }
    console.log(`onDelete newv:${JSON.stringify(newv)}`);
    inputProps.onChange(newv);
    // onDelete :{"rowId":0,"row":{"columns":[{"value":"GPS信息","selected":false,"rowId":0,"id":0,"width":150},{"value":["ChargeACVoltage","AL_Under_Ucell","AL_Over_Tcell"],"selected":false,"rowId":0,"id":1,"width":150}],"id":0}}
  };
  let onChange = (values)=>{
    console.log(`onChange :${JSON.stringify(values)}`);
    console.log(`onChange :${typeof vsz}`);
    let newv = _.clone(vsz);
    let index = _.get(values,'id',-1);
    if(index != -1 && index < vsz.length ){
      const errorcode = values["columns"][0].value;
      const id = values["columns"][1].value;
      const warninglevel = values["columns"][2].value;
      const description = values["columns"][3].value;
      // let content = values["columns"][3].value;
      newv[index] = {errorcode,id,warninglevel,description};
    }
    else if(index >= vsz.length){
      if(index != -1 && index < vsz.length ){
        const errorcode = values["columns"][0].value;
        const id = values["columns"][1].value;
        const warninglevel = values["columns"][2].value;
        const description = values["columns"][3].value;
      // let content = values["columns"][3].value;
        newv.push( {errorcode,id,warninglevel,description});
      }
    }
    else{
      return;
    }

    console.log(`onChange newv:${JSON.stringify(newv)}`);
    inputProps.onChange(newv);
  }
  let rows = [];
  let headers = [
     {value: '故障码', type: 'TextField', width: 150},
     {value: '字段名', type: 'TextField', width: 450},
     {value: '派单级别', type: 'Select', width: 150,multi:false,options:[
       { value: 1, label: '1' },
       { value: 2, label: '2' },
       { value: 3, label: '3' },
     ]},
     {value: '描述', type: 'TextField', width: 150},
  ];

  _.map(vsz,(v)=>{
    rows.push(
      {
        columns: [
        {value: v.errorcode},
        {value: v.id},
        {value: v.warninglevel},
        {value: v.description},
        // {value: v.content},
      ]}
    );
  });

  return (<EditTable
    enableNew={true}
    onDelete={onDelete}
    onChange={onChange}
    rows={rows}
    enableDelete={true}
    headerColumns={headers}
  />);
};

export default renderAlaramRuleEdit;

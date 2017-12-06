import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import EditTable from './material-ui-table-edit.js';
import { Fields } from 'redux-form';
import Divider from 'material-ui/Divider';
import _ from 'lodash';

const renderGroupEdit = ({ meta: { touched, error } = {}, input: { ...inputProps }, ...props }) =>{
  console.log(`renderGroupEdit form ==>inputProps:${JSON.stringify(inputProps)},props:${JSON.stringify(props)}`);

  let onChange = (values)=>{
    console.log(`onChange :${JSON.stringify(values)}`);
    // let sz = values.split(',');
    // inputProps.onChange(sz);
  }
  let rows = [];
  let headers = [
     {value: '分组名', type: 'TextField', width: 200},
     {value: '字段列表', type: 'ReactSelect', width: 200},
  ];
  let vsz = inputProps.value;
  _.map(vsz,(v)=>{
    rows.push(
      {columns: [
      {value: v.groupname},
      {value: v.fieldslist},
      ]}
    );
  });

  return (<EditTable
    onChange={onChange}
    rows={rows}
    headerColumns={headers}
  />);
};

export default renderGroupEdit;

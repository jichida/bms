import React  from 'react';
import PropTypes from 'prop-types';
import {DateInput,NumberInput} from 'admin-on-rest/lib/mui';
import TextField from 'material-ui/TextField';
import get from 'lodash.get';
import FieldTitle from 'admin-on-rest/lib/util/FieldTitle';
import moment from 'moment';

//=====================================================================

const DateInputFilter = (props) => {
  let {input:{onChange,value,...restinput},...rest} = props;
  const onChangeNew = (newdate)=>{
    const newv = moment(newdate).format('YYYY-MM-DD');
    onChange(newv);
  }
  if(!value){
    value = moment().toDate();
  }
  if(typeof value === 'string'){
    value = moment(value).toDate();
  }
  let inputnew = {
    onChange:onChangeNew,
    value,
    ...restinput
  };
  return(
    <DateInput {...rest} input={inputnew} elStyle={{width:'100%'}}/>
  );
}

DateInputFilter.defaultProps = {
  addField: true,
  options: {},
  step: 'any',
};



export  {DateInputFilter};

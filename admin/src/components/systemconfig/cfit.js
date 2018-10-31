import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'redux-form';
import renderAlaramRuleEdit from './alarmruleit';


const CfAlaramRuleItInput = ({source,label}) => {
  return(
      <span>
        <Field
            name={source}
            component={renderAlaramRuleEdit}
            label={label}
        />
    </span>
  )
}

CfAlaramRuleItInput.defaultProps = {
    addLabel: true,
};
export  {CfAlaramRuleItInput};

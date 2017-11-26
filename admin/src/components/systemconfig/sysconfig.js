import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { propTypes, reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import compose from 'recompose/compose';

import { Card, CardActions } from 'material-ui/Card';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

import { Notification, translate, } from 'admin-on-rest';
import {systemLoadAction,systemSaveAction} from './action';

import lodashget from 'lodash.get';
// see http://redux-form.com/6.4.3/examples/material-ui/
const renderInput = ({ meta: { touched, error } = {}, input: { ...inputProps }, ...props }) =>
    <TextField
        errorText={touched && error}
        {...inputProps}
        {...props}
        fullWidth
    />;

class SystemConfig extends Component {

    componentWillMount () {
      const {dispatch} = this.props;
      systemLoadAction({},dispatch);
    }

    systemSave = (values) => {
        const {dispatch} = this.props;
        systemSaveAction(values,dispatch);
    }

    render() {
        const { handleSubmit, submitting, translate } = this.props;
        return (
                <div >
                    <Card >
                        <form onSubmit={handleSubmit(this.systemSave)}>
                            <div >
                                <div  >
                                    <Field
                                        name="warningrulelevel0"
                                        component={renderInput}
                                        floatingLabelText={`报警规则设置(高)`}
                                    />
                                </div>
                                <div >
                                    <Field
                                        name="warningrulelevel1"
                                        component={renderInput}
                                        floatingLabelText={`报警规则设置(中)`}
                                    />
                                </div>
                                <div >
                                    <Field
                                        name="warningrulelevel2"
                                        component={renderInput}
                                        floatingLabelText={`报警规则设置(低)`}
                                    />
                                </div>
                            </div>
                            <CardActions>
                                <RaisedButton type="submit" primary disabled={submitting} label={`保存`} fullWidth />
                            </CardActions>
                        </form>
                    </Card>
                    <Notification />
                </div>
        );
    }
}


//==========================================
let SystemconfigForm = reduxForm({
    form: 'systemconfig',
})(SystemConfig);

SystemconfigForm = connect(
  ({systemconfig},props)=>{
      console.log(`systemconfig form ==>${JSON.stringify(systemconfig)}`)
      return {
        initialValues:{
            warningrulelevel0:lodashget(systemconfig,'warningrulelevel0',''),
            warningrulelevel1:lodashget(systemconfig,'warningrulelevel1',''),
            warningrulelevel2:lodashget(systemconfig,'warningrulelevel2',''),
        },
      }
  }
)(SystemconfigForm);


// const enhance = compose(
//     translate,
//     SystemconfigForm,
// );

export default SystemconfigForm;

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import config from '../../env/config.js';
import { showNotification,translate } from 'admin-on-rest';
import TextField from 'material-ui/TextField';
/**
 * Dialogs can be nested. This example opens a Date Picker from within a Dialog.
 */
class ResetPassword extends React.Component {
  state = {
    open: false,
    pwdvalue: '123456',
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };
  handleChange = (event) => {
    this.setState({
      pwdvalue: event.target.value,
    });
  };
  handleSubmit = (record) =>{
    console.log(`发送重置密码记录:${JSON.stringify(record)}`);
    const {id} = record;
    const data = {
      userid:id,
      password:this.state.pwdvalue
    }
    const { showNotification }= this.props;
    const token = localStorage.getItem('admintoken');
    fetch(`${config.serverurl}/adminapi/resetuserpassword`, {
      method: 'POST',
      headers: {
       'Accept': 'application/json',
       'Content-Type': 'application/json',
       'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(data)
    })
          .then((res) => {
              res.json().then((data)=>{
                console.log(data);
                if(data.result){
                  showNotification('resources.user.notification.resetuserpassword_success');
                  this.setState({open: false});
                }
                else{
                  showNotification('resources.user.notification.resetuserpassword_failed', 'warning');
                  this.setState({open: false});
                }
              });
          })
          .catch((e) => {
              console.error(e);
              showNotification('resources.user.notification.resetuserpassword_failed', 'warning')
          });
  }

  render() {
    console.log(this.props);
    const {record} = this.props;
    const actions = [
      <FlatButton
        label="取消"
        primary={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="重置"
        primary={true}
        keyboardFocused={true}
        onClick={()=>{this.handleSubmit(record)}}
      />,
    ];

    return (
      <div>
        <FlatButton label="重置密码" primary={true} onClick={this.handleOpen} />
        <Dialog
          title="重置密码"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <TextField
          id="text-field-controlled"
          value={this.state.pwdvalue}
          onChange={this.handleChange}
        />
        </Dialog>
      </div>
    );
  }
}


ResetPassword.propTypes = {
    showNotification: PropTypes.func,
};

const enhance = compose(
    connect(
        null,
        {
          showNotification: showNotification,
        },
    ),
    translate,
);

export default enhance(ResetPassword);

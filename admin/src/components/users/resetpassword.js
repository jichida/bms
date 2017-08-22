import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import config from '../../env/config.js';
import { showNotification,translate } from 'admin-on-rest';
/**
 * Dialogs can be nested. This example opens a Date Picker from within a Dialog.
 */
class ResetPassword extends React.Component {
  state = {
    open: false,
  };

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  handleSubmit = (record) =>{
    console.log(`发送重置密码记录:${JSON.stringify(record)}`);
    // const { push, showNotification }= this.props;
    // fetch(`${config.serverurl}/createmycouponsbatch`, {
    //   method: 'POST',
    //   headers: {
    //    'Accept': 'application/json',
    //    'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify(record) })
    //       .then(() => {
    //           showNotification('批量新建优惠券成功');
    //           push('/mycoupon');
    //       })
    //       .catch((e) => {
    //           console.error(e);
    //           showNotification('批量新建优惠券失败', 'warning')
    //       });
  }

  render() {
    console.log(this.props);
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
        onClick={this.handleSubmit}
      />,
    ];

    return (
      <div>
        <RaisedButton label="重置密码" onClick={this.handleOpen} />
        <Dialog
          title="重置密码"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          这里加一个密码输入框.
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

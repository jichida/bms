import React from 'react';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import config from '../../env/config.js';
import IconGetBtn from 'material-ui/svg-icons/navigation/refresh';
import IconSetBtn from 'material-ui/svg-icons/navigation/refresh';
import PageForm from './formsetting';
import _ from 'lodash';
import { refreshView } from 'admin-on-rest';
import { Modal } from 'antd';
import fetchgwsetting from './fetchgwsetting';
import { showNotification } from 'admin-on-rest';

class GetSetButton extends React.Component {
  constructor(props) {
      super(props);
  }
  state = { visible: false }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  hideModal = () => {
    this.setState({
      visible: false,
    });
    this.props.dispatch(refreshView({}));
  }

  onClick_Get = ()=>{
    const {record} = this.props;
    fetchgwsetting(`/gwget`,{DeviceId:record['DeviceId']}).then(({issuccess,errmsg})=>{
      if(issuccess){
        this.props.dispatch(refreshView({}));
      }
      else{
        this.props.dispatch(showNotification(errmsg));
      }
    });
  }
  onClick_Set = ()=>{
    this.showModal();
  }
  onClick_SetOK = (values)=>{
    const {record} = this.props;
    const postdata = {
      DeviceId:record['DeviceId'],
      DataInterval:values.DataInterval,
      SendInterval:values.SendInterval,
    }
    fetchgwsetting(`/gwset`,postdata).then(({issuccess,errmsg})=>{
      if(issuccess){
        this.props.dispatch(refreshView({}));
        this.hideModal();
      }
      else{
        this.props.dispatch(showNotification(errmsg));
      }
    });

  }

  render() {
    const {record} = this.props;
    const gwset = {
      DataInterval:_.get(record,'GWSetting.DataInterval',1),
      SendInterval:_.get(record,'GWSetting.SendInterval',1),
    }

    let formname = 'GWSettingForm';
    let formvalues = gwset;
    return (
      <div className="clearfix">
        <RaisedButton primary={true} label="获取" onClick={()=>{
          this.onClick_Get();
        }} style={{margin: 12}}/>

        <RaisedButton secondary={true} label="设置" onClick={()=>{
          this.onClick_Set();
        }} style={{margin: 12}}>
        <Modal
          destroyOnClose={true}
          title="配置网关参数"
          width={800}
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
          footer={null}
        >
          <PageForm onClickSubmit={this.onClick_SetOK}
                formname={formname}
                formvalues={formvalues}
            />
        </Modal>
      </RaisedButton>
      <div></div>
      </div>
    );
  }
}
GetSetButton = connect()(GetSetButton);

let GetSetBtn = (props) => {
  const {source,...rest} = props;
  return(
    <span>
      <Field name={source} component={GetSetButton} {...rest}/>
    </span>
  )
}

GetSetBtn.defaultProps = {
    addLabel: false,
};

export  {GetSetBtn};

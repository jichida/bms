import React from 'react';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import config from '../../env/config.js';
import IconGetBtn from 'material-ui/svg-icons/navigation/refresh';
import IconSetBtn from 'material-ui/svg-icons/navigation/refresh';
import PageForm from './formsetting';
import _ from 'lodash';
import { refreshView } from 'admin-on-rest';
import { Modal } from 'antd';
import fetchgwsetting from './fetchgwsetting';

class GetSetButton extends React.Component {
  constructor(props) {
      super(props);
      console.log('PicturesWall===>' + JSON.stringify(props));

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
    console.log(`Click Btn Get :${record['DeviceId']},${JSON.stringify(record['GWSetting'])}`)
    fetchgwsetting(`/gwget`,{DeviceId:record['DeviceId']}).then((result)=>{
      this.props.dispatch(refreshView({}));
      console.log(`refresh------>`)
    });
  }
  onClick_Set = ()=>{
    this.showModal();
  }
  onClick_SetOK = (values)=>{
    console.log(`onClick_SetOK===>${JSON.stringify(values)}`);
    const {record} = this.props;
    fetchgwsetting(`/gwset`,{DeviceId:record['DeviceId'],GWSetting:values}).then((result)=>{
      this.props.dispatch(refreshView({}));
    });
    this.hideModal();
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
        <FlatButton primary label="获取" onClick={()=>{
          this.onClick_Get();
        }} icon={<IconGetBtn />} />

        <FlatButton primary label="设置" onClick={()=>{
          this.onClick_Set();
        }} icon={<IconSetBtn />} >
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
      </FlatButton>
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

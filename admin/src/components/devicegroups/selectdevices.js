import React, { Component } from 'react';
import { Async } from 'react-select';
import { Field } from 'redux-form';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import _ from 'lodash';
import '../controls/react-select.css';
import "react-virtualized/styles.css";
import "react-virtualized-select/styles.css";
import VirtualizedSelect from 'react-virtualized-select';
import {mapdevices,mapdevices_r} from './devicealloptions';

const customContentStyle = {
  width: '50%',
  maxWidth: 'none',
};

class SelectDeviceExt extends Component {
   constructor(props) {
      super(props);
      const {input: { ...inputProps }} = props;

      this.state = {
        open: false,
        inputvaluesz:inputProps.value
      }
    }


    handleOpen = () => {
      this.setState({open: true});
    };

    handleClose = () => {
      //restore
      this.setState({open: false});
      const {input: { ...inputProps }} = this.props;
      this.setState({
        inputvaluesz:inputProps.value
      });
    };

    handleCloseOK = ()=>{
      //update
      this.setState({open: false});
      const {input: { ...inputProps }} = this.props;
      inputProps.onChange(this.state.inputvaluesz);
    }

    onChange = (values)=>{
      const {input: { ...inputProps }} = this.props;
      const sz = values.split(',');
      inputProps.onChange(sz);
      this.setState({
        inputvaluesz:sz
      });
    }

    InputOnChange=(e)=>{
      const values = e.target.value;
      const {input: { ...inputProps }} = this.props;
      const sz = values.split(',');
      let szret = [];
      _.map(sz,(DeviceId)=>{
        if(!!mapdevices_r[DeviceId]){
          szret.push(mapdevices_r[DeviceId]);
        }
      })
      this.setState({
        inputvaluesz:szret
      });
    }
    render() {
      const actions = [
        <FlatButton
          label="取消"
          primary={true}
          onClick={()=>{this.handleClose();}}
        />,
        <FlatButton
          label="确定导入"
          primary={true}
          keyboardFocused={true}
          onClick={()=>{this.handleCloseOK();}}
        />,
      ];
      const { meta: { touched, error } = {}, input: { ...inputProps }, ...props } = this.props;
      let inputvaluesz = '';
      _.map(this.state.inputvaluesz,(v)=>{
        inputvaluesz += mapdevices[v];
        inputvaluesz += ',';
      });
      return (
        <div>
            <span style={{display:'inline-block'}}>
                <VirtualizedSelect
                  async
                  multi
                  matchProp={"label"}
                  onChange={this.onChange}
                  value={inputProps.value}
                  {...props}
                  backspaceToRemoveMessage={'按退格键删除'}
                  clearAllText={'删除所有'}
                  clearValueText={'删除'}
                  noResultsText={'找不到记录'}
                  placeholder={'请选择'}
                  searchPromptText={'输入查询'}
                  loadingPlaceholder={'加载中...'}
                  simpleValue
              />
            </span>
            <span style={{display:'inline-block'}}>
              <RaisedButton label="批量导入" onClick={this.handleOpen} />
            </span>
          <Dialog
            title="批量导入设备"
            actions={actions}
            modal={false}
            open={this.state.open}
            contentStyle={customContentStyle}
            onRequestClose={this.handleClose}
          >
          <TextField
              hintText="粘贴所有的设备ID,用逗号分隔."
              floatingLabelText="所有设备ID列表,粘贴所有的设备ID,用逗号分隔"
              multiLine={true}
              value={inputvaluesz}
              onChange={this.InputOnChange}
              fullWidth={true}
            />
        </Dialog>
      </div>);

    }

}
const SelectDevices = ({source,label,loadOptions}) => {
  // console.log(loadOptions)
  return(
      <span>
        <Field
            name={source}
            component={SelectDeviceExt}
            label={label}
            loadOptions={loadOptions}
        />
    </span>
  )
}

SelectDevices.defaultProps = {
    addLabel: true,
};


export  {SelectDevices};

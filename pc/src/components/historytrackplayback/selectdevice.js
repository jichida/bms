import React from 'react';
import { connect } from 'react-redux';
import map from 'lodash.map';
import filter from 'lodash.filter';

import { Select } from 'antd';
const Option = Select.Option;

class SelectDevice extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            options: []
        }
    }

    componentWillMount(){

    }

    onChange = (value) => {
        this.getdata(value);
    }

    getdata =(value)=>{
        let options=[];
        let optionsarr=[];
        let {deviceidlist} = this.props;

        if (!!deviceidlist) {
            optionsarr = filter(deviceidlist,function(o) {
              if(!!o){
                return o.indexOf(value)!==-1;
              }
              return false;
            })
            if(optionsarr.length>100){optionsarr.length=100}
            options = map(optionsarr,(deviceid,index)=>{
                return <Option key={deviceid}>{deviceid}</Option>;
            });
        }
        this.setState({ options });
        this.props.onSelDeviceid(value);
    }

  render() {

    return (
      <Select
        mode="combobox"
        style={{ width: 160 }}
        onChange={this.onChange}
        filterOption={false}
        placeholder={this.props.placeholder}
        defaultValue={this.props.initdeviceid}
        >
          {this.state.options}
      </Select>

    );
  }
}
const mapStateToPropsSelectDevice = ({device}) => {
    const {g_devicesdb} = device;
    return {g_devicesdb};
}
export default connect(mapStateToPropsSelectDevice)(SelectDevice);

import React from 'react';
import { connect } from 'react-redux';
import map from 'lodash.map';
import filter from 'lodash.filter';
import lodashget from 'lodash.get';

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
        let {deviceidlist,g_devicesdb} = this.props;

        if (!!deviceidlist) {
            optionsarr = filter(deviceidlist,function(o) {
              const deviceItem = g_devicesdb[o];
              if(!!o){
                 if(o.indexOf(value)!==-1){
                   return true;
                 };
              }
              const PackNo_BMU = lodashget(deviceItem,'PackNo_BMU','');
              if(PackNo_BMU !== ''){
                 if(PackNo_BMU.indexOf(value)!==-1){
                   return true;
                 }
              }
              return false;
            })
            if(optionsarr.length>100)
            {
              optionsarr.length=100;
            }
            options = map(optionsarr,(deviceid,index)=>{
                let value = deviceid;
                const deviceItem = g_devicesdb[deviceid];
                const PackNo_BMU = lodashget(deviceItem,'PackNo_BMU','');
                if(PackNo_BMU !== ''){
                  value = `${deviceid}(${PackNo_BMU})`;
                }
                return <Option key={deviceid}>{value}</Option>;
            });
        }
        this.setState({ options });
        this.props.onSelDeviceid(value);
    }

  render() {
    const {g_devicesdb,initdeviceid,placeholder} = this.props;
    let initvalue = initdeviceid;
    const deviceItem = g_devicesdb[initdeviceid];
    const PackNo_BMU = lodashget(deviceItem,'PackNo_BMU','');
    if(PackNo_BMU !== ''){
      initvalue = `${initdeviceid}(${PackNo_BMU})`;
    }
    return (
      <Select
        mode="combobox"
        style={{ width: 200 }}
        onChange={this.onChange}
        filterOption={false}
        placeholder={placeholder}
        defaultValue={initvalue}
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

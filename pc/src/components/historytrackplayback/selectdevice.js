import React from 'react';
import { connect } from 'react-redux';
import { TreeSelect } from 'antd';
import map from 'lodash.map';

const TreeNode = TreeSelect.TreeNode;

class SelectDevice extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        value:props.initdeviceid
      }
  }

  onChange = (value) => {
    console.log(arguments);
    this.setState({ value });
    this.props.onSelDeviceid(value);
  }
  render() {
    const treeData = [];
    let {g_devicesdb,deviceidlist} = this.props;
    deviceidlist = deviceidlist || [];
    map(deviceidlist,(deviceid)=>{
      let item = g_devicesdb[deviceid];
      let data = {
          label: `${item.DeviceId}`,
          value: `${item.DeviceId}`,
          key: `${item.DeviceId}`,
      };
      treeData.push(data);
    });
    return (
      <TreeSelect
        showSearch
        style={{ width: '100%',fontSize: "16px"}}
        value={this.state.value}
        dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
        placeholder={this.props.placeholder}
        allowClear
        treeDefaultExpandAll
        onChange={this.onChange}
        treeData={treeData}
        placeholder={this.props.placeholder}

        />

    );
  }
}
const mapStateToPropsSelectDevice = ({device}) => {
    const {g_devicesdb} = device;
    return {g_devicesdb};
}
export default connect(mapStateToPropsSelectDevice)(SelectDevice);

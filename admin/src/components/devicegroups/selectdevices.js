import React, { Component } from 'react';
import { Async } from 'react-select';
import { Field } from 'redux-form';
import '../controls/react-select.css';
import "react-virtualized/styles.css";
import "react-virtualized-select/styles.css";
import VirtualizedSelect from 'react-virtualized-select';

class SelectDeviceExt extends Component {
    componentDidMount() {
    }
    onChange = (values)=>{
      const {input: { ...inputProps }} = this.props;
      const sz = values.split(',');
      inputProps.onChange(sz);
    }
    render() {
      const { meta: { touched, error } = {}, input: { ...inputProps }, ...props } = this.props;
      return (
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
        />);
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

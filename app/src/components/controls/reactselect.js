import React from 'react';
// import {connect} from 'react-redux';
import Select from 'react-select';

import 'react-select/dist/react-select.css';

class SelectDevice extends React.Component {

    // constructor(props) {
    //     super(props);
    // }

    onChange = (newv)=>{
      const sz = newv.split(',');
      this.props.onChange(sz);
    }

    render(){
      const {options,value,onChange,...rest} = this.props;

      return (
         <span>
          <Select
            multi
            value={value}
            onChange={this.onChange}
            options={options}
            {...rest}
            backspaceToRemoveMessage={'按退格键删除'}
            clearAllText={'删除所有'}
            clearValueText={'删除'}
            noResultsText={'找不到记录'}
            placeholder={'请选择'}
            searchPromptText={'输入查询'}
            loadingPlaceholder={'加载中...'}
            simpleValue
            style={{width: "200px",}}
            />
          </span>
      );
    }

}

export default  SelectDevice;
// const mapStateToProps = ({device:{ g_devicesdb }}) => {
//     return { g_devicesdb };
// }
// export default connect(mapStateToProps)(SelectDevice);

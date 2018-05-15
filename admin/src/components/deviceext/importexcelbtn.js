import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import ActionDelete from 'material-ui/svg-icons/action/delete';
import ContentAdd from 'material-ui/svg-icons/content/add';
import ActionBack from 'material-ui/svg-icons/navigation/arrow-back';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import config from '../../env/config.js';
import { Modal, Button } from 'antd';
import ImportExcel from '../../components/importexcel';
import { refreshView } from 'admin-on-rest';
import {uploadExcelAction} from './action';

import { ListButton, DeleteButton } from 'admin-on-rest';
const cardActionStyle = {
    zIndex: 2,
    display: 'inline-block',
    float: 'right',
};


class App extends Component {
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
  render() {
    // const data = [
    //       {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
    //       {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
    //       {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
    //       {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
    //       {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
    //       {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
    //       {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
    // ];
    return (
      <FlatButton
       primary
       label="导入Excel"
       onClick={this.showModal}
       icon={<ActionBack />}
       style={{ overflow: 'inherit' }}  >
        <Modal
          destroyOnClose={true}
          title="导入EXCEL"
          width={800}
          visible={this.state.visible}
          onOk={this.hideModal}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="取消"
          footer={null}
        >
          <ImportExcel onClose={this.hideModal}/>
        </Modal>
       </FlatButton>
    );
  }
}

App = connect()(App);
export default App;
//
// let ImportExcelButton = (props) => {
//
//   const fileChange = (event)=>{
//     const {dispatch,resource} = props;
//     uploadExcelAction({event,resource},dispatch);
//   }
//   return (
//         <FlatButton
//          primary
//          label="导入Excel"
//          icon={<ActionBack />}
//          style={{ overflow: 'inherit' }}  >
//          <input type="file" id="cpic" name="cpic" onChange={fileChange}
//                                style={
//                                {
//                                    filter:"alpha(opacity=0)","MozOpacity":"0.0",
//                                    "KhtmlOpacity":0.0,opacity:0.0,position:"absolute",
//                                    right: 0,top:0,zIndex:"9",
//                                    height:"63px",
//                                    left:0,width:"100%"
//                                }
//                            }
//                            />
//        </FlatButton>
//   );
// };
// ImportExcelButton = connect()(ImportExcelButton);
// export default ImportExcelButton;

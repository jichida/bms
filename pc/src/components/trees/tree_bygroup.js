import React from 'react';
import {connect} from 'react-redux';
import {Treebeard,decorators} from '../controls/react-treebeard-ex/src/index.js';
import treestyle from '../treestyle.js';
import HeaderCo from './treeheader';
import {
    mapmain_selgroup,
    ui_selcurdevice_request,
} from '../../actions';

const treeviewstyle = 'bygroup';
decorators.Header = HeaderCo;


class Tree extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(node, toggled){
        if(this.state.cursor){this.state.cursor.active = false;}
        node.active = true;
        if(!!node.children){
            node.toggled = toggled;
            let groupid = node.id;
            //选择当前group<-----
            this.props.dispatch(mapmain_selgroup({groupid,forcetoggled:false}));

        }else{
            // node.toggled = toggled;
            let deviceid = node.name;
            const {g_devicesdb} = this.props;
            const deviceitem = g_devicesdb[deviceid];
            if(!!deviceitem && toggled){
              this.props.dispatch(ui_selcurdevice_request({DeviceId:deviceitem.DeviceId,deviceitem}));
            }

        }
        this.setState({ cursor: node });
    }
    render(){
        const {datatree} = this.props;
        return (
          <Treebeard
              id="treebygroup"
              data={datatree}
              onToggle={this.onToggle}
              decorators={decorators}
              style={treestyle.default}
              treeviewstyle={treeviewstyle}
          />
      );
  }
}

const mapStateToProps = ({device:{datatreegroup:datatree,g_devicesdb}}) => {
  return {datatree,g_devicesdb};
}

export default connect(mapStateToProps)(Tree);

import React from 'react';
import {connect} from 'react-redux';
import {Treebeard,decorators} from '../controls/react-treebeard-ex/src/index.js';
import treestyle from './treestyle.js';
import HeaderCo from './treeheader';
import {
    mapmain_seldistrict,
    getdevicestatcities_request,
    getdevicestatareas_request,
    getdevicestatareadevices_request,
    ui_selcurdevice_request,
} from '../../actions';

const treeviewstyle = 'byloc';
decorators.Header = HeaderCo;


class Tree extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.onToggle = this.onToggle.bind(this);
    }

    onToggle(node, toggled){
        if(!!this.state.cursor){
          this.setState({
            cursor:{
              active:false
            }
          })
          // this.state.cursor.active = false;
        }
        node.active = true;
        if(!!node.children){
            node.toggled = toggled;

            if(node.adcode === 100000){
              node.toggled = true;
            }

            let id = node.adcode;
            if(typeof id === 'string'){
              id = parseInt(id,10);
            }
            console.log(node);
            if(node.type === "group_province"){
              //<-----//{adcode: 640000, name: "宁夏回族自治区", loading: false, type: "group_province"
              this.props.dispatch(getdevicestatcities_request({provinceinfo:{name:node.name,adcode:id}}));
            }
            else if(node.type === 'group_city'){
              this.props.dispatch(getdevicestatareas_request({cityinfo:{provinceadcode:node.provinceadcode,citycode:node.citycode,adcode:id}}));
            }
            else if(node.type === 'group_area'){
              //getdevicestatareadevices_result
              this.props.dispatch(getdevicestatareadevices_request({provinceadcode:node.provinceadcode,cityadcode:node.cityadcode,adcode:id}));

            }
            console.log(node);

        }else{
            // node.toggled = toggled;
            let deviceid = node.name;
            const {g_devicesdb} = this.props;
            const deviceitem = g_devicesdb[deviceid];
             if(!!deviceitem ){//&& toggled
              this.props.dispatch(ui_selcurdevice_request({DeviceId:deviceitem.DeviceId,deviceitem,src:'tree_byloc'}));
            }
        }
        this.setState({ cursor: node });
    }
    render(){
        const {datatree} = this.props;
        return (
          <Treebeard
              id="treebyloc"
              data={datatree}
              onToggle={this.onToggle}
              decorators={decorators}
              style={treestyle.default}
              treeviewstyle={treeviewstyle}
          />
      );
  }
}

const mapStateToProps = ({device:{datatreeloc:datatree,g_devicesdb}}) => {
  return {datatree,g_devicesdb};
}

export default connect(mapStateToProps)(Tree);

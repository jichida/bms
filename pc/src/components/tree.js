/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {Treebeard} from 'react-treebeard';
import _ from 'lodash';
import {ui_selcurdevice} from '../actions';

class TreeExample extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.onToggle = this.onToggle.bind(this);
    }
    onToggle(node, toggled){
        if(this.state.cursor){this.state.cursor.active = false;}
        node.active = true;
        if(node.children){
            node.toggled = toggled;
        }else{
            let deviceid = node.name;
            const {devices} = this.props;
            const deviceitem = devices[deviceid];
            this.props.dispatch(ui_selcurdevice({DeviceId:deviceitem.DeviceId,deviceitem}));
            console.log(node);
        }
        this.setState({ cursor: node });
    }
    render(){
        const {datatree} = this.props;
        return (
            <div style={{paddingTop:"20px", background:"rgb(33, 37, 43)"}}>
            <Treebeard
                id="lefttree"
                data={datatree}
                onToggle={this.onToggle}
            />
            </div>
        );
    }
}
const mapStateToProps = ({device:{datatree,devices}}) => {

  return {datatree,devices};
}

export default connect(mapStateToProps)(TreeExample);

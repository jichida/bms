/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {Treebeard} from 'react-treebeard';
import _ from 'lodash';
import {
  mapmain_seldistrict,
  ui_selcurdevice
} from '../actions';

class TreeExample extends React.Component {
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
            let id = node.adcode;
            if(typeof id === 'string'){
              id = parseInt(id);
            }
            // if(id !== 100000){
            //选择一个文件夹
            let level = id%10 === 0?'':'district';
            this.props.dispatch(mapmain_seldistrict({adcodetop:id,toggled,level}));
            console.log(id);//选择一个文件夹
            // }

        }else{
            // node.toggled = toggled;
            let deviceid = node.name;
            const {devices} = this.props;
            const deviceitem = devices[deviceid];
            if(!!deviceitem && toggled){
              this.props.dispatch(ui_selcurdevice({DeviceId:deviceitem.DeviceId,deviceitem}));
            }
            console.log(deviceitem);//选择一个设备
        }
        this.setState({ cursor: node });
    }


    onFilterMouseUp(e) {
        const filter = e.target.value.trim();
        if (!filter) {
            console.log(filter);
        }
    }

    render(){
        const {datatree} = this.props;
        return (
            <div style={{paddingTop:"20px", background:"rgb(33, 37, 43)"}}>
                <div>
                    <div className="input-group">
                        <span className="input-group-addon">
                          <i className="fa fa-search"/>
                        </span>
                        <input className="form-control"
                               onKeyUp={this.onFilterMouseUp.bind(this)}
                               placeholder="Search the tree..."
                               type="text"/>
                    </div>
                </div>
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

/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {Treebeard,decorators} from './controls/react-treebeard-ex/src/index.js';
import RaisedButton from 'material-ui/RaisedButton';
import Search from "./search";
import _ from 'lodash';
import {
    mapmain_seldistrict,
    ui_selcurdevice_request,
    ui_changetreestyle,
    md_ui_settreefilter,
    mapmain_areamountdevices_request
} from '../actions';
import {filterTree,expandFilteredNodes} from '../util/filter';
import treestyle from './treestyle.js';
import '../css/treestyle.css';

let HeaderCo = (props) => {
    let title = props.node.name || '';
    if(props.node.type !== 'device'){
      const name = props.gmap_treename[props.node.adcode];
      title = `${name}`;
      const count = props.gmap_acode_treecount[props.node.adcode];
      if(!!count){
        title = `${name}(${count})`;
      }
    }

    const active = props.node.active;
    const iconType = props.node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginRight: '5px'};
    const treeseled = active ? "seled" : "";

    return (
        <div style={props.style.base} className={treeseled}>
            <div style={props.style.title}>
                {title}
            </div>
        </div>
    );
  };

const mapStateToPropsHeaderCo = ({device:{gmap_treename,gmap_acode_treecount}}) => {
  return {gmap_treename,gmap_acode_treecount};
}
decorators.Header = connect(mapStateToPropsHeaderCo)(HeaderCo);


class TreeExample extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
        this.onToggle = this.onToggle.bind(this);
    }
    onChangeTreeStyle(stylename){
      this.props.dispatch(ui_changetreestyle(stylename));
    }
    onToggle(node, toggled){
        if(this.state.cursor){this.state.cursor.active = false;}
        node.active = true;
        if(!!node.children){
            node.toggled = toggled;
            if(node.adcode === 100000){
              node.toggled = true;
            }

            let id = node.adcode;
            if(typeof id === 'string'){
              id = parseInt(id);
            }
            const {treeviewstyle} = this.props;
            if(treeviewstyle === 'byloc'){
              this.props.dispatch(mapmain_seldistrict({adcodetop:id,forcetoggled:false}));
            }
            else{

            }

        }else{
            // node.toggled = toggled;
            let deviceid = node.name;
            const {g_devicesdb} = this.props;
            const deviceitem = g_devicesdb[deviceid];
            if(!!deviceitem && toggled){
              this.props.dispatch(ui_selcurdevice_request({DeviceId:deviceitem.DeviceId,deviceitem}));
            }
            //console.log(deviceitem);//选择一个设备
        }
        this.setState({ cursor: node });
    }


    onFilterMouseUp(e) {
        const filter = e.target.value.trim();
        if(!!filter){
          if(filter.length <= 3){
            return;
          }
        }
        this.props.dispatch(md_ui_settreefilter({inputtreevalue:filter}));
    }

    render(){
        const {datatree} = this.props;
        return (
            <div className="treePage">
                <div className="treehead">
                    地理位置
                </div>
                <div className="searchbox">
                    <div className="input-group">
                        <span className="input-group-addon">
                            <i className="fa fa-search"/>
                        </span>
                        <input className="form-control"
                               onKeyUp={this.onFilterMouseUp.bind(this)}
                               placeholder="根据设备id搜索(至少两位)"
                               type="text"/>
                    </div>
                </div>
                <Search />
                <Treebeard
                    id="lefttree"
                    data={datatree}
                    onToggle={this.onToggle}
                    decorators={decorators}
                    style={treestyle.default}
                />
            </div>
        );
    }
}
const mapStateToProps = ({device:{datatree:datatreeloc,treeviewstyle,treefilter,datatreegroup,g_devicesdb}}) => {
  let datatree = treeviewstyle === 'byloc'?datatreeloc:datatreegroup;
  if(!!treefilter){
      const filtered = filterTree(datatree, treefilter);
      datatree = expandFilteredNodes(filtered, treefilter);
  }
  return {datatree,g_devicesdb,treeviewstyle};
}

export default connect(mapStateToProps)(TreeExample);

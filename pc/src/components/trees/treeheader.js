import React from 'react';
import {connect} from 'react-redux';
import {Treebeard,decorators} from '../controls/react-treebeard-ex/src/index.js';

const HeaderCo = (props) => {
    let title = props.node.name || '';
    if(props.node.type !== 'device'){
      if(props.treeviewstyle === 'byloc'){
        const name = props.gmap_acode_treename[props.node.adcode];
        title = `${name}`;
        const count = props.gmap_acode_treecount[props.node.adcode];
        if(!!count){
          title = `${name}(${count})`;
        }
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

const mapStateToPropsHeaderCo = ({device:{gmap_acode_treename,gmap_acode_treecount}}) => {
  return {gmap_acode_treename,gmap_acode_treecount};
}


export default connect(mapStateToPropsHeaderCo)(HeaderCo);

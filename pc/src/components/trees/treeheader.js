import React from 'react';
import {connect} from 'react-redux';
import {Treebeard,decorators} from '../controls/react-treebeard-ex/src/index.js';
import icon_car1 from './icon_car1.png';
import icon_car2 from './icon_car2.png';
import icon_car3 from './icon_car3.png';

const HeaderCo = (props) => {
    let title = props.node.name || '';
    let icon = false;
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
    else{
      icon = props.treeviewstyle === 'byloc';
    }

    const active = props.node.active;
    const iconType = props.node.children ? 'folder' : 'file-text';
    const iconClass = `fa fa-${iconType}`;
    const iconStyle = {marginRight: '5px'};
    const treeseled = active ? "seled" : "";


    if(!icon){
      return (
          <div style={props.style.base}  className={treeseled}>
              <div style={props.style.title}>
                  {title}
              </div>
          </div>
      );
    }
    let iconname = '';

    //icon_car1   严重警报
    //icon_car2   紧急警报
    //icon_car3   一般警报

    return (
        <div style={props.style.base}  className={treeseled}>
            <div style={props.style.title}>
                <div style={{
                    display: "-webkit-box",
                    display: "-ms-flexbox",
                    display: "flex",
                    display: "-webkit-flex",
                    alignItems: "center",
                }}>
                    <img src={icon_car1} style={{width: "20px",marginRight: "5px", marginLeft : "5px"}} />{title}
                </div>
            </div>
        </div>
    );
  };

const mapStateToPropsHeaderCo = ({device:{gmap_acode_treename,gmap_acode_treecount}}) => {
  return {gmap_acode_treename,gmap_acode_treecount};
}


export default connect(mapStateToPropsHeaderCo)(HeaderCo);

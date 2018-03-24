/**`
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import './overview.css';
import NavBar from "../tools/nav.js";
import {
    carmapshow_createmap,
    carmapshow_destorymap,
} from '../../actions';
const divmapid = 'mapmain';
class Page extends React.Component {
    componentWillMount () {
        console.log('地图---->componentWillMount---------');
      }
      componentWillUnmount(){
        console.log('地图---->componentWillUnmount---------');
        this.props.dispatch(carmapshow_destorymap({divmapid}));
      }
      componentDidMount () {
        console.log('地图---->componentDidMount---------');
        this.props.dispatch(carmapshow_createmap({divmapid}));
     }

    render() {
        // const {showmenu,showhistoryplay,showdistcluster,showhugepoints,p} = this.props;
        return (
            <div className="overviewPage AppPage">
                <NavBar title="总览" back={true} />
                <div className="content">
                    <div id={divmapid} style={{height:`${window.innerHeight-68}px`}}/>
                </div>
            </div>
        );
    }
}

export default connect()(Page);

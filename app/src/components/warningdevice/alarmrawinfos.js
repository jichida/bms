/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
// import map from 'lodash.map';
//
// import Button  from 'antd/lib/button';
// import {
//     ui_index_addcollection,
//     ui_index_unaddcollection,
//     ui_alarm_selcurdevice,
// } from '../../actions';

import Datalist from "./datalist_rawinfos";
// let g_showdata = false;
let g_usecachealarm = false;
let resizetimecontent;
class Page extends React.Component {
  constructor(props) {
      super(props);
      let deviceid =  this.props.match.params.deviceid;
      let query = this.getquery({deviceid});

      this.state = {
        query: query,
        innerHeight: window.innerHeight,
      };
    }

    componentDidMount() {
        g_usecachealarm = false;
        window.addEventListener('resize', this.onWindowResize);
    }
    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize=()=> {
        window.clearTimeout(resizetimecontent);
        resizetimecontent = window.setTimeout(()=>{
            this.setState({
                innerHeight: window.innerHeight,
            });
        },10)
    }



    getquery({deviceid}){
      let query = {};
      if(deviceid !== ''){
        query.DeviceId = deviceid;
      }
      //无TimeKey
      query['warninglevel'] = {
        $in:['高','中','低']
      };
      return query;
    }


    onClickRow = (id)=>{
      // g_showdata = this.state.showdata;
      g_usecachealarm = true;
      // this.props.history.push(`/alarminfo/${id}`);
    }
    render() {

        // const formstyle={width:"100%",flexGrow:"1"};
        // const textFieldStyle={width:"100%",flexGrow:"1"};
        // const height =  window.innerHeight - 65 - 209;
        const deviceid = this.props.match.params.deviceid;
        return (
            <div className="playbackPage AppPage warningmessagePage"
                style={{
                    height : `${this.state.innerHeight}px`,
                    overflow: "hidden",
                    paddingBottom:"0",

                }}
                >
                <div className="navhead">
                    <div onClick={()=>{this.props.history.goBack()}} className="back"></div>
                    <span className="title" style={{paddingRight : "30px"}}>{`车辆${deviceid}的报警信息`}</span>
                    <div className="moresetting"></div>
                </div>

                <Datalist
                  usecachealarm={g_usecachealarm}
                  seltype={this.state.seltype}
                  tableheight={window.innerHeight-76-40}
                  query={this.state.query}
                  ref='alarmrawdataslist'
                  onClickRow={this.onClickRow}
                />
            </div>
        );
    }
}

// const mapStateToProps = ({device,alarmpop}) => {
//     const {carcollections} = device;
//     const {alaramraws} = alarmpop;
//     return {carcollections,alaramraws};
// }

export default connect()(Page);

/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
// import NavigationClose from 'material-ui/svg-icons/navigation/close';
// import IconButton from 'material-ui/IconButton';
// import {grey900} from 'material-ui/styles/colors';
// import NavBar from "../tools/nav.js";
// import Map from './map';
import "./map.css";
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Searchimg from '../../img/13.png';
import Searchimg2 from '../../img/14.png';
// import Searchimg3 from '../../img/15.png';
// import Searchimg4 from '../../img/23.png';
import Car from '../../img/5.png';

import Footer from "../index/footer.js";
import Datalist from "./datalist_infos";

// import DatePicker from 'react-mobile-datepicker';
// import moment from 'moment';

let g_showdata = false;
let g_warninglevel;
let g_usecachealarm = false;

class Page extends React.Component {
    constructor(props) {
        super(props);
        let deviceid =  this.props.match.params.deviceid;
        if(deviceid === '0'){
          deviceid = '';
        }
        this.state = {
            warninglevel:g_warninglevel || -1,
            showdata : g_showdata,
            deviceid,
        };
    }

    componentWillMount () {
      const {warninglevel,deviceid} = this.state;
      let query = this.getquery({warninglevel,deviceid});
      this.setState({
        query
      });
    }
    componentDidMount () {
      g_showdata = true;
      g_usecachealarm = false;
      g_warninglevel = null;
    }

    getquery({warninglevel,deviceid}){
      let query = {};
      if(deviceid !== ''){
        query.DeviceId = deviceid;
      }

      if(warninglevel !== -1){
        if(warninglevel === 0){
          query.warninglevel = '高';
        }
        else if(warninglevel === 1){
          query.warninglevel = '中';
        }
        else if(warninglevel === 2){
          query.warninglevel = '低';
        }
      }
      return query;
    }
    onSearch(v){

      const {warninglevel,deviceid} = this.state;
      let query = this.getquery({warninglevel,deviceid});

      this.setState({
        query
      });
      window.setTimeout(()=>{
        console.log(this.refs.alarmdatalist);
        this.refs.alarmdatalist.getWrappedInstance().refs.alarmlist.getWrappedInstance().onRefresh();
          // this.refs.alarmdatalist.getWrappedInstance().onRefresh();
      },0);
    }
    onClickSearch(e){
      e.stopPropagation();
      this.setState({showdata: false});

      this.onSearch(this.state.seltype);
    }
    onChangeWarninglevel(event, index, value){
      this.setState({
        warninglevel:value
      });
    }

    onClickRow = (id)=>{
      g_showdata = this.state.showdata;
      g_usecachealarm = true;
      g_warninglevel = this.state.warninglevel;
      this.props.history.push(`/alarminfo/${id}`);
    }
    render() {

        // const formstyle={width:"100%",flexGrow:"1"};
        // const textFieldStyle={width:"100%",flexGrow:"1"};
        // const height =  window.innerHeight - 65 - 209;
        return (
            <div className="playbackPage AppPage warningmessagePage"
                style={{
                    height : `${window.innerHeight}px`,
                    overflow: "hidden",
                    paddingBottom:"0",

                }}
                >
                <div className="navhead">
                    <span className="title" style={{paddingLeft : "30px"}}>报警信息</span>
                    <a className="searchlnk" onClick={()=>{this.setState({showdata: !this.state.showdata})}} ><img src={Searchimg} alt=""/></a>
                </div>
                {
                    this.state.showdata &&
                    <div className="set warningmessageset">
                        <div className="title">报警车辆搜索</div>
                        <div className="formlist ">
                            <div className="seltimecontent selcarts" onClick={()=>{
                              g_showdata = this.state.showdata;
                              g_warninglevel = this.state.warninglevel;
                              g_usecachealarm = true;
                              this.props.history.replace(`/selcart/warningdevice/${this.props.match.params.deviceid}`)
                            }}>
                                <img src={Car} width={30} alt=""/>
                                {this.state.deviceid !== ''?
                                <span className="txt2">车辆信息:{`${this.state.deviceid}`}</span>:
                                <span className="txt2">选择车辆</span>}
                            </div>
                            <div className="li" style={{borderBottom: "1px solid #EEE"}}>
                                <img src={Searchimg2} width={26} alt=""/>
                                <SelectField
                                    value={this.state.warninglevel}
                                    onChange={this.onChangeWarninglevel.bind(this)}
                                    fullWidth={true}
                                    style={{flexGrow: "1",marginLeft: "10px"}}
                                    underlineStyle={{border: "none"}}
                                    labelStyle={{textAlign: "right", paddingRight: "36px", color: "#666"}}
                                    listStyle={{textAlign:"center"}}
                                    >
                                    <MenuItem value={-1} primaryText="报警等级" />
                                    <MenuItem value={0} primaryText="高" />
                                    <MenuItem value={1} primaryText="中" />
                                    <MenuItem value={2} primaryText="低" />
                                </SelectField>
                            </div>

                            <RaisedButton
                                onClick={(e)=>{this.onClickSearch(e);}}
                                label="搜索"
                                backgroundColor={"#5cbeaa"}
                                labelStyle={{fontSize: "16px",color : "#FFF"}}
                                style={{ margin: "0 15px 20px 15px", width: "auto", height: "50px", lineHeight: "50px"}}
                                />
                        </div>
                        <div style={{flexGrow: 1}} onClick={()=>{this.setState({showdata: !this.state.showdata})}}></div>
                    </div>
                }

                <Datalist
                  usecachealarm={g_usecachealarm}
                  seltype={this.state.seltype}
                  tableheight={window.innerHeight-58-65-50}
                  query={this.state.query}
                  ref='alarmdatalist'
                  onClickRow={this.onClickRow}
                />
                <Footer sel={1} />
            </div>
        );
    }
}
// const mapStateToProps= ({device}) => {
//     const {g_devicesdb} = device;
//     return {g_devicesdb};
// }
export default connect()(Page);

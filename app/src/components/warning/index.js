/**`
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import './warning.css';
import NavBar from "../tools/nav.js";
import Avatars from "../../img/2.png"; 
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import DatePicker from 'material-ui/DatePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';

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
        const {mapseldeviceid,devices} = this.props;
        let DeviceId;
        const formstyle={width:"100%",flexGrow:"1"};
        const textFieldStyle={width:"100%",flexGrow:"1"};
        return (
            <div className="warningPage AppPage"
                style={{
                    minHeight : `${window.innerHeight}px`,
                }}
                >
                <NavBar back={true} title="预警信息" />
                <div className="set">
                    <div>设备编号：{DeviceId || '23423-24cdc-wef'}</div>
                    <div className="formlist">
                        <SelectField value={0} fullWidth={true} style={{height:"58px"}}>
                            <MenuItem value={0} primaryText="警告等级" />
                            <MenuItem value={1} primaryText="严重" />
                            <MenuItem value={2} primaryText="一般" />
                        </SelectField>
                        <DatePicker hintText="开始时间" style={formstyle} textFieldStyle={textFieldStyle} />
                        <DatePicker hintText="结束时间" style={formstyle} textFieldStyle={textFieldStyle} />
                    </div>
                    <div className="btnlist">
                        <RaisedButton onTouchTap={()=>{}} label="查询" primary={true} fullWidth={true}  buttonStyle={{background:"#3479e1",color:"#FFF"}} />
                    </div>
                </div>
                <div className="content">
                    <ListItem
                        value={1}
                        primaryText="Brendan Lim"
                        leftAvatar={<Avatar src={`${Avatars}`} />}
                    />
                    <ListItem
                        value={1}
                        primaryText="Brendan Lim"
                        leftAvatar={<Avatar src={`${Avatars}`} />}
                    />
                    <ListItem
                        value={1}
                        primaryText="Brendan Lim"
                        leftAvatar={<Avatar src={`${Avatars}`} />}
                    />
                </div>
            </div>
        );
    }
}

export default connect()(Page);

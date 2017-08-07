/**
 * Created by jiaowenhui on 2017/7/28.
    设备详情
 */
import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';
import {ui_showhistoryplay,ui_showmenu} from '../actions';

class Page extends React.Component {
    onClickMenu(menuitemstring){
        this.props.dispatch(ui_showmenu(menuitemstring));
    }
    showhistoryplay(){
      this.props.dispatch(ui_showhistoryplay(true));
    }
    render(){
      const data = {
            "设备名称" : "123XG设备",
            "最高单体温度" : "80",
            "最低单体温度" : "0",
            "最高单体电压" : "100V",
            "最低单体电压" : "30V",
            "真实SOC" : "SOC",
            "箱体电流" : "20A",
        }
      const {mapseldeviceid,devices} = this.props;
      let deviceitem = devices[mapseldeviceid];
      if(!!deviceitem){
        data[`设备Id`] = deviceitem.DeviceId;
      }


      return (
            <div className="warningPage devicePage">
                <div className="tit">设备详情</div>
                <div className="devicebtnlist">
                    <RaisedButton label="轨迹回放" primary={true} onTouchTap={this.showhistoryplay.bind(this)} className="showDeviceInfo" />
                    <RaisedButton label="历史警告" primary={true} onTouchTap={this.onClickMenu.bind(this,"warningbox")} className="showDeviceInfo" />
                </div>
                <div className="lists">
                    {_.map(data, (d, key)=>{
                        return (
                            <div className="li" key={key}>
                                <div className="name">{key}</div><div className="text">{d}</div>
                            </div>
                        )
                    })}
                </div>
               
            </div>
        );
    }
}

const mapStateToProps = ({device:{mapseldeviceid,devices}}) => {
  return {mapseldeviceid,devices};
}
export default connect(mapStateToProps)(Page);


/**
 * Created by jiaowenhui on 2017/7/28.
    车辆详情
 */
import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import RaisedButton from 'material-ui/RaisedButton';
import {
  ui_showhistoryplay,
  ui_showmenu,
  searchbatteryalarm_request,
  ui_btnclick_devicemessage,
  ui_clickplayback
} from '../actions';
import translate from 'redux-polyglot/translate';
import TableComponents from "./table.js";
import TreeSearchmessage from './search/searchmessage';
import { Button } from 'antd';


class Page extends React.Component {
    onClickMenu(menuitemstring){
        this.props.dispatch(ui_showmenu(menuitemstring));
    }
    showhistoryplay(){
      this.props.dispatch(ui_showhistoryplay(true));
    }
    onClickQuery(query){
      this.props.dispatch(searchbatteryalarm_request(query));
    }
    render(){
      // const datasz = [
      //   {
      //     groupname:'基本参数',
      //     fieldnames:[
      //       {name:'RealtimeAlarm.SN'},
      //       {name:'RealtimeAlarm.BAT_U_Out_HVS'},
      //       {name:'RealtimeAlarm.BAT_U_TOT_HVS'},
      //       {name:'RealtimeAlarm.BAT_I_HVS'},
      //       {name:'RealtimeAlarm.BAT_SOC_HVS'},
      //       {name:'RealtimeAlarm.BAT_SOH_HVS'},
      //     ]
      //   },
      //   {
      //     groupname:'电压参数',
      //     fieldnames:[
      //       {name:'RealtimeAlarm.BAT_Ucell_Max'},
      //       {name:'RealtimeAlarm.BAT_Ucell_Min'},
      //       {name:'RealtimeAlarm.BAT_Ucell_Max_CSC'},
      //       {name:'RealtimeAlarm.BAT_Ucell_Max_CELL'},
      //       {name:'RealtimeAlarm.BAT_Ucell_Min_CSC'},
      //       {name:'RealtimeAlarm.BAT_Ucell_Min_CELL'},
      //     ]
      //   },
      //   {
      //     groupname:'温度参数',
      //     fieldnames:[
      //       {name:'RealtimeAlarm.BAT_T_Max'},
      //       {name:'RealtimeAlarm.BAT_T_Min'},
      //       {name:'RealtimeAlarm.BAT_T_Avg'},
      //       {name:'RealtimeAlarm.BAT_T_Max_CSC'},
      //       {name:'RealtimeAlarm.BAT_T_Min_CSC'},
      //     ]
      //   },
      //   {
      //     groupname:'继电器状态',
      //     fieldnames:[
      //       {name:'RealtimeAlarm.ST_AC_SW_HVS'},
      //       {name:'RealtimeAlarm.ST_Aux_SW_HVS'},
      //       {name:'RealtimeAlarm.ST_Main_Neg_SW_HVS'},
      //       {name:'RealtimeAlarm.ST_Pre_SW_HVS'},
      //       {name:'RealtimeAlarm.ST_Main_Pos_SW_HVS'},
      //     ]
      //   },
      //   {
      //     groupname:'位置参数',
      //     fieldnames:[
      //       {name:'LastHistoryTrack.Longitude'},
      //       {name:'LastHistoryTrack.Latitude'},
      //       {name:'LastHistoryTrack.Speed'},
      //       {name:'LastHistoryTrack.Course'},
      //       {name:'LastHistoryTrack.DeviceStatus'},
      //     ]
      //   },
      //   {
      //     groupname:'地理参数',
      //     fieldnames:[
      //       {name:'LastHistoryTrack.Province'},
      //       {name:'LastHistoryTrack.City'},
      //       {name:'LastHistoryTrack.County'},
      //     ]
      //   },
      // ];

      const {mapseldeviceid,g_devicesdb,p, columns, alaram_data} = this.props;
      let deviceitem = g_devicesdb[mapseldeviceid];
      let datadevice = {

          "基本信息" :[ {
                  name:'采集时间',
                  value:_.get(deviceitem,'采集时间'),
              },
              {
                  name:'车速(km/h)',
                  value: _.get(deviceitem,'车速(km/h)'),
              },
              {
                name:'驱动有效',
                value: _.get(deviceitem,'驱动有效'),
              },
              {
                name:'制动有效',
                value: _.get(deviceitem,'制动有效'),
              },
              {
                name:'里程(km)',
                value: _.get(deviceitem,'里程(km)'),
              },
              {
                name:'空调温度(℃)',
                value: _.get(deviceitem,'空调温度(℃)'),
              },
              {
                name:'档位',
                value:_.get(deviceitem,'档位'),
              },
              {
                name:'加速踏板行程值(%)',
                value:_.get(deviceitem,'加速踏板行程值(%)'),
              },
              {
                name:'制动踏板行程值(%)',
                value:_.get(deviceitem,'制动踏板行程值(%)'),
              },
              {
                name:'充放电状态',
                value: _.get(deviceitem,'充放电状态'),
              },
              {
                name:'驱动电机控制器温度(℃)',
                value:  _.get(deviceitem,'驱动电机控制器温度(℃)'),
              },
              {
                name:'驱动电机转速(r/min)',
                value:  _.get(deviceitem,'驱动电机转速(r/min)'),
              },
              {
                name:'驱动电机温度(℃)',
                value:_.get(deviceitem,'驱动电机温度(℃)'),
              },
              {
                name:'电机控制器输入电压',
                value: _.get(deviceitem,'电机控制器输入电压'),
              },
              {
                name:'电机控制器直流母线电流',
                value: _.get(deviceitem,'电机控制器直流母线电流'),
              },
            ],
            "GPS信息" : [
              {
                name:'定位状态',
                value: _.get(deviceitem,'定位状态'),
              },
              {
                name:'纬度信息',
                value: _.get(deviceitem,'纬度信息'),
              },
              {
                name:'经度信息',
                value:_.get(deviceitem,'经度信息'),
              },
              {
                name:'经度',
                value: _.get(deviceitem,'经度'),
              },
              {
                name:'纬度',
                value: _.get(deviceitem,'纬度'),
              },
              {
                name:'GPS速度(km/h)',
                value: _.get(deviceitem,'GPS速度(km/h)'),
              },
              {
                name:'方向',
                value: _.get(deviceitem,'方向'),
              },
          ],
          "车辆状态" : [
              {
                name:'动力系统就绪',
                value:  _.get(deviceitem,'动力系统就绪'),
              },
              {
                name:'紧急下电请求',
                value:  _.get(deviceitem,'紧急下电请求'),
              },
              {
                name:'电池均衡激活',
                value:  _.get(deviceitem,'电池均衡激活'),
              }
        ],

        "电池类信息" : [

            {
                name:'总电压(V)',
                value: _.get(deviceitem,'总电压(V)'),
            },
            {
                name:'SOC(%)',
                value: _.get(deviceitem,'SOC(%)'),
            },
            {
                name:'总电流(A)',
                value: _.get(deviceitem,'总电流(A)'),
            },
            {
                name:'电池绝缘电阻(KΩ)',
                value:_.get(deviceitem,'电池绝缘电阻(KΩ)'),
            },
            {
                name:'最高电压动力蓄电池包序号',
                value: _.get(deviceitem,'最高电压动力蓄电池包序号'),
            },
            {
                name:'最高电压单体蓄电池序号',
                value: _.get(deviceitem,'最高电压单体蓄电池序号'),
            },
            {
                name:'电池单体最高电压值(V)',
                value: _.get(deviceitem,'电池单体最高电压值(V)'),
            },
            {
                name:'最低电压动力蓄电池包序号',
                value: _.get(deviceitem,'最低电压动力蓄电池包序号'),
            },
            {
                name:'最低电压单体蓄电池序号',
                value: _.get(deviceitem,'最低电压单体蓄电池序号'),
            },


            {
                name:'电池单体最低电压值(V)',
                value: _.get(deviceitem,'电池单体最低电压值(V)'),
            },
            {
                name:'最高温度动力蓄电池包序号',
                value:_.get(deviceitem,'最高温度动力蓄电池包序号'),
            },
            {
                name:'最高温度探针序号',
                value:_.get(deviceitem,'最高温度探针序号'),
            },
            {
                name:'最高温度值(℃)',
                value: _.get(deviceitem,'最高温度值(℃)'),
            },
            {
                name:'最低温度动力蓄电池包序号',
                value: _.get(deviceitem,'最低温度动力蓄电池包序号'),
            },
            {
                name:'最低温度探针序号',
                value: _.get(deviceitem,'最低温度探针序号'),
            },


            {
                name:'最低温度值(℃)',
                value:_.get(deviceitem,'最低温度值(℃)'),
            },
            {
                name:'剩余能量(KW*h)',
                value: _.get(deviceitem,'剩余能量(KW*h)'),
            },
            {
                name:'最高电压电池总数',
                value:_.get(deviceitem,'最高电压电池总数'),
            },
            {
                name:'最低电压电池总数',
                value: _.get(deviceitem,'最低电压电池总数'),
            },
            {
                name:'最高温度探针总数',
                value:_.get(deviceitem,'最高温度探针总数'),
            },
            {
                name:'最低温度探针总数',
                value: _.get(deviceitem,'最低温度探针总数'),
            },
            {
                name:'单体蓄电池总数',
                value: _.get(deviceitem,'最低电压单体蓄电池序号'),
            },
            {
                name:'动力蓄电池包总数(单体)',
                value: _.get(deviceitem,'动力蓄电池包总数(单体)'),
            },
            {
                name:'温度探针总数',
                value: _.get(deviceitem,'温度探针总数'),
            },
            {
                name:'动力蓄电池包总数(动力)',
                value: _.get(deviceitem,'动力蓄电池包总数(动力)'),
            },
          ]
      };
      let datadeviceclone = {...datadevice};
      datadevice = [];
      _.map(datadeviceclone,(v,k)=>{
        datadevice = datadevice.concat(v);
      });
      // datadevice = _.flattenDeep(datadevice);
      // const datadevice = [
      //   {
      //       name:'采集时间',
      //       value: "2017-09-13 18:16:57",
      //   },
      //   {
      //       name:'车速(km/h)',
      //       value: "14.0",
      //   },
      //   {
      //       name:'驱动有效',
      //       value: "驱动有效",
      //   },
      //   {
      //       name:'制动有效',
      //       value: "制动有效",
      //   },
      //   {
      //       name:'里程(km)',
      //       value: "27196",
      //   },
      //   {
      //       name:'空调温度(℃)',
      //       value: "23",
      //   },
      //   {
      //       name:'档位',
      //       value: "自动档/D",
      //   },
      //   {
      //       name:'加速踏板行程值(%)',
      //       value: "缺省值",
      //   },
      //   {
      //       name:'充放电状态',
      //       value: "放电",
      //   },
      //   {
      //       name:'驱动电机控制器温度(℃)',
      //       value: "51",
      //   },
      //   {
      //       name:'驱动电机转速(r/min)',
      //       value: "991",
      //   },
      //   {
      //       name:'驱动电机温度(℃)',
      //       value: "49",
      //   },
      //   {
      //       name:'电机控制器输入电压',
      //       value: "371.0",
      //   },
      //   {
      //       name:'电机控制器直流母线电流',
      //       value: "-7.0",
      //   },
      //
      //   {
      //       name:'定位状态',
      //       value: "有效定位",
      //   },
      //   {
      //       name:'纬度信息',
      //       value: "北纬",
      //   },
      //   {
      //       name:'经度信息',
      //       value: "东经",
      //   },
      //   {
      //       name:'经度',
      //       value: "118.159387",
      //   },
      //   {
      //       name:'纬度',
      //       value: "24.499292",
      //   },
      //   {
      //       name:'GPS速度(km/h)',
      //       value: " 14.0",
      //   },
      //   {
      //       name:'方向',
      //       value: " 西偏北 76.0°",
      //   },
      //
      //   {
      //       name:'动力系统就绪',
      //       value: "活跃亮灯",
      //   },
      //   {
      //       name:'紧急下电请求',
      //       value: "正常",
      //   },
      //   {
      //       name:'电池均衡激活',
      //       value: "无均衡",
      //   },
      //
      //
      //
      //   {
      //       name:'总电压(V)',
      //       value: "374.0",
      //   },
      //   {
      //       name:'SOC(%)',
      //       value: "76.0",
      //   },
      //   {
      //       name:'总电流(A)',
      //       value: "-5.4",
      //   },
      //   {
      //       name:'电池绝缘电阻(KΩ)',
      //       value: "3015",
      //   },
      //
      //
      //   {
      //       name:'最高电压动力蓄电池包序号',
      //       value: "1",
      //   },
      //   {
      //       name:'最高电压单体蓄电池序号',
      //       value: "93",
      //   },
      //   {
      //       name:'电池单体最高电压值(V)',
      //       value: "3.870",
      //   },
      //   {
      //       name:'最低电压动力蓄电池包序号',
      //       value: "1",
      //   },
      //   {
      //       name:'最低电压单体蓄电池序号',
      //       value: "82",
      //   },
      //
      //
      //   {
      //       name:'电池单体最低电压值(V):',
      //       value: "3.830",
      //   },
      //   {
      //       name:'最高温度动力蓄电池包序号',
      //       value: "1",
      //   },
      //   {
      //       name:'最高温度探针序号',
      //       value: "1",
      //   },
      //   {
      //       name:'最高温度值(℃)',
      //       value: "39",
      //   },
      //   {
      //       name:'最低温度动力蓄电池包序号',
      //       value: "1",
      //   },
      //   {
      //       name:'最低温度探针序号',
      //       value: "4",
      //   },
      //
      //
      //   {
      //       name:'最低温度值(℃)',
      //       value: "37",
      //   },
      //   {
      //       name:'剩余能量(KW*h)',
      //       value: "30.2",
      //   },
      //   {
      //       name:'最高电压电池总数',
      //       value: "0",
      //   },
      //   {
      //       name:'最低电压电池总数',
      //       value: "0",
      //   },
      //   {
      //       name:'最高温度探针总数',
      //       value: "3",
      //   },
      //   {
      //       name:'最低温度探针总数',
      //       value: "13",
      //   },
      //   {
      //       name:'单体蓄电池总数',
      //       value: "97",
      //   },
      //   {
      //       name:'动力蓄电池包总数(单体)',
      //       value: "1",
      //   },
      //   {
      //       name:'温度探针总数',
      //       value: "34",
      //   },
      //   {
      //       name:'动力蓄电池包总数(动力)',
      //       value: "1",
      //   },
      //
      //
      // ];
      return (

            <div className="warningPage devicePage deviceinfoPage">

                <div className="appbar">
                    <i className="fa fa-angle-left back" aria-hidden="true" onClick={()=>{this.props.history.goBack()}}></i>
                    <div className="title">车辆详情</div>
                    <div className="devicebtnlist">
                        <Button type="primary" icon="play-circle-o" onClick={
                          ()=>
                          {
                            this.props.dispatch(ui_clickplayback(mapseldeviceid));
                          }

                        }>车辆轨迹监控</Button>
                        <Button type="primary" icon="clock-circle-o" onClick={()=>{
                          const id = this.props.match.params.id;
                          this.props.dispatch(ui_btnclick_devicemessage({DeviceId:id}));
                          //this.props.history.push(`/devicemessage/${mapseldeviceid}`)
                        }}>历史警告</Button>
                    </div>
                </div>

                <div className="lists deviceinfolist"
                    style={{
                        flexGrow: 1,
                        overflow: "scroll"
                    }}
                    >
                    {
                      _.map(datadevice,(item,i)=>{
                          return (
                              <div className="li" key={i}>
                                  <div>
                                  <div className="name">{item.name}</div><div className="text">{item.value}</div>
                                  </div>
                              </div>
                          )
                      })
                  }
                </div>

            </div>
        );
    }
}

const mapStateToProps = ({device:{mapseldeviceid,g_devicesdb}}) => {
    return {mapseldeviceid,g_devicesdb, };
}
const DeviceComponentWithPProps = translate('showdevice')(Page);
export default connect(mapStateToProps)(DeviceComponentWithPProps);

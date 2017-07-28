import React  from 'react';
import PropTypes from 'prop-types';
import { translate } from 'admin-on-rest';

import SystemconfigIcon from 'material-ui/svg-icons/action/settings-brightness';//系统设置
import DeviceIcon from 'material-ui/svg-icons/device/battery-charging-full';//设备
import DeviceGroupIcon from 'material-ui/svg-icons/device/devices';//设备分组
import UserIcon from 'material-ui/svg-icons/action/account-circle';//用户
import UserLogIcon from 'material-ui/svg-icons/action/book';//用户登陆日志
import PermissionIcon from 'material-ui/svg-icons/action/info';//权限
import RealtimeAlarmIcon from 'material-ui/svg-icons/action/alarm';//实时报警
import HistoryTrackIcon from 'material-ui/svg-icons/action/history';//历史轨迹
import CanrowDataIcon from 'material-ui/svg-icons/action/timeline';//历史轨迹



export default [
        { name: 'systemconfig', icon: <SystemconfigIcon /> },
        { name: 'device', icon: <DeviceIcon /> },
        { name: 'devicegroup', icon: <DeviceGroupIcon /> },
        { name: 'user', icon: <UserIcon /> },
        { name: 'permission', icon: <PermissionIcon /> },
        { name: 'realtimealaram', icon: <RealtimeAlarmIcon /> },
        { name: 'historytrack', icon: <HistoryTrackIcon /> },
        { name: 'historydevice', icon: <SystemconfigIcon /> },
        { name: 'canrowdata', icon:<CanrowDataIcon />},
        { name: 'userlog', icon: <UserLogIcon /> },
];

import React  from 'react';
import PropTypes from 'prop-types';
import { translate } from 'admin-on-rest';

import SystemconfigIcon from 'material-ui/svg-icons/action/settings-brightness';//系统设置

export default [
        { name: 'systemconfig', icon: <SystemconfigIcon /> },
        { name: 'device', icon: <SystemconfigIcon /> },
        { name: 'devicegroup', icon: <SystemconfigIcon /> },
        { name: 'user', icon: <SystemconfigIcon /> },
        { name: 'permission', icon: <SystemconfigIcon /> },
        { name: 'realtimealaram', icon: <SystemconfigIcon /> },
        { name: 'historytrack', icon: <SystemconfigIcon /> },
        { name: 'historydevice', icon: <SystemconfigIcon /> },
        { name: 'userlog', icon: <SystemconfigIcon /> },
];

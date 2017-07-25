import { createAction } from 'redux-act';

//查询设备【首页上的高级搜索】
export const querydevice_request = createAction('querydevice_request');
export const querydevice_result = createAction('querydevice_result');
//查询告警信息
export const queryrealtimealarm_request = createAction('queryrealtimealarm_request');
export const queryrealtimealarm_result = createAction('queryrealtimealarm_result');
//查询历史轨迹数据
export const queryhistorytrack_request  = createAction('queryhistorytrack_request');
export const queryhistorytrack_result  = createAction('queryhistorytrack_result');

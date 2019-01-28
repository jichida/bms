import { createAction } from 'redux-act';
//获取车辆分组信息
export const getdevicestat_request = createAction('getdevicestat_request');
export const getdevicestat_result = createAction('getdevicestat_result');

export const getdevicestatprovinces_request = createAction('getdevicestatprovinces_request');
export const getdevicestatprovinces_result = createAction('getdevicestatprovinces_result');

export const getdevicestatcities_request = createAction('getdevicestatcities_request');
export const getdevicestatcities_result = createAction('getdevicestatcities_result');

export const getdevicestatareas_request = createAction('getdevicestatareas_request');
export const getdevicestatareas_result = createAction('getdevicestatareas_result');

export const getdevicestatcity_request = createAction('getdevicestatcity_request');
export const getdevicestatcity_result = createAction('getdevicestatcity_result');

export const refreshdevice = createAction('refreshdevice');

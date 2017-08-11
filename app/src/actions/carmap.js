import { createAction } from 'redux-act';

export const map_setmapinited = createAction('map_setmapinited');
export const mapmain_setmapcenter = createAction('mapmain_setmapcenter');
export const mapmain_setzoomlevel = createAction('mapmain_setzoomlevel');
export const mapmain_setenableddrawmapflag = createAction('mapmain_setenableddrawmapflag');

export const carmapshow_createmap = createAction('carmapshow_createmap');
export const carmapshow_destorymap = createAction('carmapshow_destorymap');

export const ui_selcurdevice = createAction('ui_selcurdevice');
export const ui_selcurdevice_result = createAction('ui_selcurdevice_result');

//轨迹回放
export const mapplayback_start = createAction('mapplayback_start');
export const mapplayback_end = createAction('mapplayback_end');

//获取一个区域
export const mapmain_seldistrict_init = createAction('mapmain_seldistrict_init');
export const mapmain_seldistrict = createAction('mapmain_seldistrict');
export const mapmain_getdistrictresult_init = createAction('mapmain_getdistrictresult_init');
export const mapmain_getdistrictresult = createAction('mapmain_getdistrictresult');
export const mapmain_getdistrictresult_last = createAction('mapmain_getdistrictresult_last');
//获取地理位置【城市】
export const mapmain_getgeoresult = createAction('mapmain_getgeoresult');

export const mapmain_clusterMarkerClick = createAction('mapmain_clusterMarkerClick');

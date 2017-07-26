import { createAction } from 'redux-act';

export const carmap_setmapinited = createAction('carmap_setmapinited');

export const carmap_setmapcenter = createAction('carmap_setmapcenter');

export const carmap_setzoomlevel = createAction('carmap_setzoomlevel');
export const carmapshow_createmap = createAction('carmapshow_createmap');
export const carmapshow_destorymap = createAction('carmapshow_destorymap');
export const carmap_setenableddrawmapflag = createAction('carmap_setenableddrawmapflag');

export const carmap_resetmap = createAction('carmap_resetmap');
export const carmap_setcurlocation  = createAction('carmap_setcurlocation');
export const carmap_setdragging  = createAction('carmap_setdragging');

export const setcurlocation = createAction('setcurlocation');

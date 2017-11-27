import { UPDATE } from 'admin-on-rest';

export const SYSTEM_SAVE = 'SYSTEM_SAVE';
export const SYSTEM_SAVE_LOADING = 'SYSTEM_SAVE_LOADING';
export const SYSTEM_SAVE_FAILURE = 'SYSTEM_SAVE_FAILURE';
export const SYSTEM_SAVE_SUCCESS = 'SYSTEM_SAVE_SUCCESS';

export const systemSaveAction = (values,dispatch) =>{
  console.log(`systemSaveAction==>${JSON.stringify(values)}`);
  dispatch({type:SYSTEM_SAVE,payload:values});
}


export const SYSTEM_LOAD = 'SYSTEM_LOAD';
export const SYSTEM_LOAD_LOADING = 'SYSTEM_LOAD_LOADING';
export const SYSTEM_LOAD_FAILURE = 'SYSTEM_LOAD_FAILURE';
export const SYSTEM_LOAD_SUCCESS = 'SYSTEM_LOAD_SUCCESS';

export const systemLoadAction = (values,dispatch) =>{
  console.log(`systemLoadAction==>${JSON.stringify(values)}`);
  dispatch({type:SYSTEM_LOAD,payload:values});
}

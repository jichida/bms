export const UPLOADEXCEL = 'UPLOADEXCEL';
export const UPLOADEXCEL_LOADING = 'UPLOADEXCEL_LOADING';
export const UPLOADEXCEL_FAILURE = 'UPLOADEXCEL_FAILURE';
export const UPLOADEXCEL_SUCCESS = 'UPLOADEXCEL_SUCCESS';

export const uploadExcelAction = (values,dispatch) =>{
  // console.log(`uploadExcelAction==>${JSON.stringify(values)}`);
  dispatch({type:UPLOADEXCEL,payload:values});
}

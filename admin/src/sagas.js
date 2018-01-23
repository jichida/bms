import customSaga from './customSaga';
import singleDoucmentPageSaga from './components/singledocumentpage/saga.js';
import uploadExcelSaga from './components/devices/saga';

export default [
  singleDoucmentPageSaga,
  customSaga,
  uploadExcelSaga
];

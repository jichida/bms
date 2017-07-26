import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { routerReducer } from 'react-router-redux';

import weui from './weui';
import app from './app';
import device from './device';
import notifymessage from './messagecenter';
import userlogin from './userlogin';
import carmap from './carmap';

export default combineReducers({
  app,
  carmap,
  device,
  notifymessage,
  userlogin,
  weui,
  form: formReducer,
  router: routerReducer
});

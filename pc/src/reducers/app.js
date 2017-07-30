import { createReducer } from 'redux-act';
import {
  notify_socket_connected,
  getsystemconfig_result,
  ui_showmenu
} from '../actions';


const initial = {
  app: {
    showmenu:'',
    socketconnected:false,
  },
};

const app = createReducer({
  [ui_showmenu]:(state,payload)=>{
    let showmenu = payload;
    return {...state,showmenu};
  },
  [getsystemconfig_result]:(state,payload)=>{
    return {...state,...payload};
  },
  [notify_socket_connected]:(state,socketconnected)=>{
    return {...state,socketconnected};
  },
}, initial.app);

export default app;

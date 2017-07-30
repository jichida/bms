import { createReducer } from 'redux-act';
import {
  notify_socket_connected,
  getsystemconfig_result,
  ui_showmenu,
  ui_showhistoryplay
} from '../actions';


const initial = {
  app: {
    showhistoryplay:false,
    oldshowmenu:'powersearch',
    showmenu:'',
    socketconnected:false,
  },
};

const app = createReducer({
  [ui_showhistoryplay]:(state,payload)=>{
    let showhistoryplay = payload;
    return {...state,showhistoryplay};
  },
  [ui_showmenu]:(state,payload)=>{
    let showmenu = payload;
    let oldshowmenu = state.oldshowmenu;
    if(showmenu === "showdevice_no"){
      showmenu = oldshowmenu==='showdevice'?'powersearch':oldshowmenu;
    }
    else{
      oldshowmenu = state.showmenu;
    }
    return {...state,showmenu,oldshowmenu};
  },
  [getsystemconfig_result]:(state,payload)=>{
    return {...state,...payload};
  },
  [notify_socket_connected]:(state,socketconnected)=>{
    return {...state,socketconnected};
  },
}, initial.app);

export default app;

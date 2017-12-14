import { createReducer } from 'redux-act';
import {
    ui_showprompt,
    set_promptdata
} from '../actions';


const initial = {
    alarmpop: {
        //全局提示
        showprompt: false,
        promptdata: [
          {
            _id:'xxx',
          },
          {
            _id:'xxx'
          }
        ],
    },
};

const alarmpop = createReducer({
    [set_promptdata]:(state,payload)=>{
        return {...state, promptdata:payload };
    }

}, initial.alarmpop);

export default alarmpop;

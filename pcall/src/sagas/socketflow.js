import {takeLatest,put,select,fork,cancel,call} from 'redux-saga/effects';
import {delay} from 'redux-saga';
import {
  notify_socket_connected,
  getsystemconfig_request,
  loginwithtoken_request,
  md_login_result,
  login_result,
  querydevicegroup_request,
  querydevicegroup_result,
  getdevicestat_request,
  // querydevicegroup_request
} from '../actions';
import config from '../env/config';
let handletask;
let sendreqafterlogin = true;
//获取地理位置信息，封装为promise
export function* socketflow(){//仅执行一次
   yield takeLatest(`${notify_socket_connected}`, function*(action) {
      let {payload:issocketconnected} = action;
      if(issocketconnected){
        //如果已经登录成功就不发了
        const {loginsuccess} = yield select((state)=>{
          return {loginsuccess:state.userlogin.loginsuccess};
        });

        if(!loginsuccess){
          yield put(getsystemconfig_request({}));
        }
        else{
          sendreqafterlogin = false;
        }

        const token = localStorage.getItem(`bms_${config.softmode}_token`);
        if (!!token) {
          yield put(loginwithtoken_request({token}));
        }
      }
    });



      yield takeLatest(`${md_login_result}`, function*(action) {
          try{
          let {payload:result} = action;
            console.log(`md_login_result==>${JSON.stringify(result)}`);
            if(!!result){
                yield put(login_result(result));
                if(result.loginsuccess){
                  localStorage.setItem(`bms_${config.softmode}_token`,result.token);
                  console.log(`sendreqafterlogin==>${sendreqafterlogin}`);
                  if(sendreqafterlogin){
                    yield put(querydevicegroup_request({}));
                  }

                  if(config.softmode === 'pcall'){
                    if(!!handletask){
                      yield cancel(handletask);
                    }
                    handletask = yield fork(function*(){
                      while(true){
                        yield put(getdevicestat_request({}));
                        yield call(delay,10000);
                        console.log(`start getdevicestat_request`)
                      }
                    });

                    // yield put(queryamaptree({}));
                  }
                }
            }

          }
          catch(e){
            console.log(e);
          }

      });


}

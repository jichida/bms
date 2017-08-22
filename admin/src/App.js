// import 'babel-polyfill';
import React, { Component } from 'react';
import { Admin, Resource ,Delete} from 'admin-on-rest';
import themeReducer from './themeReducer';
import authClient from './authClient';

import logo from './logo.svg';
import './App.css';
import sagas from './sagas';
import Login from './Login';
import Layout from './Layout';
import Menu from './Menu';
//import { Dashboard } from './dashboard';
import CustomRoutes from './routes';
import translations from './i18n';
import restClient from './restClient';

import {SystemconfigList,SystemconfigShow,SystemconfigEdit,SystemconfigCreate} from './components/systemconfig/index.js';
import {CanRawDataList,CanRawDataShow} from './components/canrowdatas/index.js';
import {DeviceGroupCreate,DeviceGroupList,DeviceGroupEdit} from './components/devicegroups/index.js';
import {DeviceCreate,DeviceList,DeviceEdit} from './components/devices/index.js';
import {HistoryTrackList,HistoryTrackShow} from './components/historytracks/index.js';
import {RealtimeAlarmList,RealtimeAlarmShow} from './components/realtimealarms/index.js';
import {UserCreate,UserList,UserEdit} from './components/users/index.js';
import {UserlogList} from './components/userlogs/index.js';
import {PermissionCreate,PermissionList,PermissionEdit} from './components/permissions/index.js';
import {UserAdminCreate,UserAdminList,UserAdminEdit} from './components/useradmins/index.js';
import {UserGroupCreate,UserGroupList,UserGroupEdit} from './components/usergroups/index.js';
import {OrganizationCreate,OrganizationEdit,OrganizationList} from './components/organization/index.js';

class App extends Component {

    render() {
        return (
            <Admin
                title="电池包监控平台"
                restClient={restClient}
                customReducers={{ theme: themeReducer }}
                customSagas={sagas}
                customRoutes={CustomRoutes}
                authClient={authClient}
                loginPage={Login}
                appLayout={Layout}
                menu={Menu}
                locale="cn"
                messages={translations}
            >
            <Resource name="devicegroup" list={DeviceGroupList} edit={DeviceGroupEdit} create={DeviceGroupCreate} />
            <Resource name="device" list={DeviceList} edit={DeviceEdit} create={DeviceCreate} />
            <Resource name="user" list={UserList} edit={UserEdit} create={UserCreate} />
            <Resource name="usergroup" list={UserGroupList} edit={UserGroupEdit} create={UserGroupCreate} />
            <Resource name="permission" list={PermissionList} edit={PermissionEdit} create={PermissionCreate} />

            <Resource name="systemconfig" list={SystemconfigList} show={SystemconfigShow} edit={SystemconfigEdit} create={SystemconfigCreate} />
            <Resource name="canrowdata" list={CanRawDataList} show={CanRawDataShow} />
            <Resource name="historytrack" list={HistoryTrackList} show={HistoryTrackShow} />
            <Resource name="realtimealarm" list={RealtimeAlarmList} show={RealtimeAlarmShow} />
            <Resource name="userlog" list={UserlogList} />
            <Resource name="useradmin" list={UserAdminList} edit={UserAdminEdit} create={UserAdminCreate} />
            <Resource name="organization" list={OrganizationList} edit={OrganizationEdit} create={OrganizationCreate} />
            </Admin>
        );
    }
}

export default App;

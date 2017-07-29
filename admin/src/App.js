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
import {UserCreate,UserList,UserEdit,UserShow} from './components/users';

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
            <Resource name="systemconfig" list={SystemconfigList} show={SystemconfigShow} edit={SystemconfigEdit} create={SystemconfigCreate} />
            <Resource name="user" list={UserList} edit={UserEdit} />


            </Admin>
        );
    }
}

export default App;

/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {Treebeard,decorators} from './controls/react-treebeard-ex/src/index.js';
import RaisedButton from 'material-ui/RaisedButton';
import Search from './search/searchtree.js';
import _ from 'lodash';

import treestyle from './treestyle.js';
import '../css/treestyle.css';
import { Tabs } from 'antd';
import "../css/antd.css";


import TreeByloc from './trees/tree_byloc';
import TreeBygroup from './trees/tree_bygroup';
import TreeBysearchresult from './trees/tree_bysearchresult';

const TabPane = Tabs.TabPane;

class TreeExample extends React.Component {


    onFilterMouseUp(e) {
        const filter = e.target.value.trim();
        if(!!filter){
          if(filter.length <= 3){
            return;
          }
        }
        // this.props.dispatch(md_ui_settreefilter({inputtreevalue:filter}));
    }

    render(){

        return (
            <div className="treePage">
                <div className="treehead">
                    地理位置
                </div>

                <Tabs
                  defaultActiveKey="1"
                  style={{ height: window.innerHeight-109 }}
                >
                    <TabPane tab="地址位置" key="1">
                        <TreeByloc
                        />
                    </TabPane>
                    <TabPane tab="分组" key="2">
                        <TreeBygroup
                        />
                    </TabPane>
                    <TabPane tab="搜索" key="3">
                        <div className="searchbox">
                            <div className="input-group">
                                <span className="input-group-addon">
                                    <i className="fa fa-search"/>
                                </span>
                                <input
                                    className="form-control"
                                    onKeyUp={this.onFilterMouseUp.bind(this)}
                                    placeholder="根据设备id搜索(至少两位)"
                                    type="text"
                                    />
                            </div>
                        </div>
                        <Search />
                        <TreeBysearchresult
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}

export default connect()(TreeExample);

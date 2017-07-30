/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import {Treebeard} from 'react-treebeard';
import _ from 'lodash';
import {ui_selcurdevice} from '../actions';

class TreeSearch extends React.Component {
    render(){
        return (
            <div className="treePage">
                <div className="treeSearch">
                    <div className="input-group">
                        <span className="input-group-addon">
                            <i className="fa fa-search"/>
                        </span>
                        <input 
                            className="form-control"
                            onKeyUp={()=>{console.log(this)}}
                            placeholder="请输入搜索关键词"
                            type="text"
                        />
                    </div>
                </div>
                
            </div>
        );
    }
}
export default connect()(TreeSearch);

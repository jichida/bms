/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import {connect} from 'react-redux';
import FileFolder from 'material-ui/svg-icons/file/folder';
import Avatar from 'material-ui/Avatar';

class Page extends React.Component {

    render(){

        return (
            <div className="warningPage messagePage">
                <div className="tit">新消息</div>
                <div className="lists">
                    <div className="li">
                        <Avatar icon={<i className="fa fa-bus" aria-hidden="true"></i>} style={{marginRight:"10px"}} />
                        <div className="licontent">
                            <div className="name">设备名称</div>
                            <div className="text">报警内容</div>
                        </div>
                    </div>
                    <div className="li">
                        <Avatar icon={<i className="fa fa-bus" aria-hidden="true"></i>} style={{marginRight:"10px"}} />
                        <div className="licontent">
                            <div className="name">设备名称</div>
                            <div className="text">报警内容</div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(Page);

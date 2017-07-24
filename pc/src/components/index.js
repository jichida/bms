/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';

class Page extends React.Component {
    componentWillMount() {
    }
    componentWillUnmount() {
    }
    handleTouchTap=()=>{
        console.log("handleTouchTap");
    }
    onTouchTap=()=>{
        console.log("onTouchTap");
    }
    render() {
        return (
            <div className="AppPage">
                
                <div>
                    <AppBar
                        title={<span>Title</span>}
                        onTitleTouchTap={()=>{console.log("onTitleTouchTap")}}
                        onLeftIconButtonTouchTap={()=>{console.log("onLeftIconButtonTouchTap")}}
                        iconElementLeft={<IconButton onTouchTap={()=>{console.log("click IconButton")}}><NavigationClose /></IconButton>}
                    />
                </div>
            </div>
        );
    }
}

export default connect()(Page);

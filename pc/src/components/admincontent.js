/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import _  from "lodash";
import AdminContent from "./admincontent";

class Page extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillMount() {
    }
    componentWillUnmount() {
    }


    render() {


        return (
            <div className="AdminContent">
                <div>这里是地图部分</div>
            </div>
        );
    }
}

export default connect()(Page);

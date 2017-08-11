/**`
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import './carlist.css';
import NavBar from "../tools/nav.js";
import Avatars from "../../img/2.png"; 
import {List, ListItem} from 'material-ui/List';
import Avatar from 'material-ui/Avatar';
import Swipeout from 'rc-swipeout';
import 'rc-swipeout/assets/index.css';

import {
    carmapshow_createmap,
    carmapshow_destorymap,
} from '../../actions';
const divmapid = 'mapmain';
class Page extends React.Component {
    componentWillMount () {
        console.log('地图---->componentWillMount---------');
    }
    componentWillUnmount(){
        console.log('地图---->componentWillUnmount---------');
        this.props.dispatch(carmapshow_destorymap({divmapid}));
    }
    componentDidMount () {
        console.log('地图---->componentDidMount---------');
        this.props.dispatch(carmapshow_createmap({divmapid}));
    }

    render() {
        const {showmenu,showhistoryplay,showdistcluster,showhugepoints,p} = this.props;

        const onShow = ()=> {
            this.props.history.push("./overview");
        };
        const onCollect = ()=> {
            console.log("收藏");
        };
        return (
            <div className="carlistPage AppPage"
                style={{
                    minHeight : `${window.innerHeight}px`,
                    background : "#EEE"
                }}
                >
                <NavBar back={true} title="我的设备" />
                <div className="content">
                    <Swipeout autoClose={true}
                        right={[
                            {
                                text: '查看',
                                onPress:onShow,
                                style: { backgroundColor: '#21ba45', color: 'white', fontSize:"16px" }
                            },
                            {
                                text: '收藏',
                                onPress:onCollect,
                                style: { backgroundColor: 'red', color: 'white', fontSize:"16px" }
                            }
                        ]}
                        onOpen={() => console.log('open')}
                        onClose={() => console.log('close')}
                    >
                        <ListItem
                            value={1}
                            primaryText="Brendan Lim"
                            leftAvatar={<Avatar src={`${Avatars}`} />}
                        />
                    </Swipeout>
                    <Swipeout autoClose={true}
                        right={[
                            {
                                text: '查看',
                                onPress:onShow,
                                style: { backgroundColor: '#21ba45', color: 'white', fontSize:"16px" }
                            },
                            {
                                text: '收藏',
                                onPress:onCollect,
                                style: { backgroundColor: 'red', color: 'white', fontSize:"16px" }
                            }
                        ]}
                        onOpen={() => console.log('open')}
                        onClose={() => console.log('close')}
                    >
                        <ListItem
                            value={1}
                            primaryText="Brendan Lim"
                            leftAvatar={<Avatar src={`${Avatars}`} />}
                        />
                    </Swipeout>
                    <Swipeout autoClose={true}
                        right={[
                            {
                                text: '查看',
                                onPress:onShow,
                                style: { backgroundColor: '#21ba45', color: 'white', fontSize:"16px" }
                            },
                            {
                                text: '收藏',
                                onPress:onCollect,
                                style: { backgroundColor: 'red', color: 'white', fontSize:"16px" }
                            }
                        ]}
                        onOpen={() => console.log('open')}
                        onClose={() => console.log('close')}
                    >
                        <ListItem
                            value={1}
                            primaryText="Brendan Lim"
                            leftAvatar={<Avatar src={`${Avatars}`} />}
                        />
                    </Swipeout>
                </div>
            </div>
        );
    }
}

export default connect()(Page);

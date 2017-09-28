/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import Devicestar from "../../img/16.png";
import { withRouter } from 'react-router-dom';
import {ui_selworkorder} from '../../actions';

class Page extends React.Component {

    render() {
        let data = [];
        const {carcollections,g_devicesdb} = this.props;
        _.map(carcollections,(id)=>{
          let item = g_devicesdb[id];
          data.push({name :`${id}`,id});
        });

        return (
            <div className="mydevicelist">
                {
                    _.map(data, (d, i)=>{
                        return (
                            <div className="li" key={i} onClick={()=>{
                              // this.props.history.push(`/deviceinfo/${d.id}`)}
                                this.props.dispatch(ui_selworkorder(d.id));
                              }
                            }><img src={Devicestar} />{d.name}</div>
                        )
                    })
                }<div></div>
            </div>
        );
    }
}

Page = withRouter(Page);

const mapStateToProps = ({device:{carcollections,g_devicesdb}}) => {
    return {carcollections,g_devicesdb};
}
export default connect(mapStateToProps)(Page);

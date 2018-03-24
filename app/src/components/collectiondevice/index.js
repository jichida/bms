/**
 * Created by jiaowenhui on 2017/3/15.
 */
import React from 'react';
import { connect } from 'react-redux';
import map from 'lodash.map';
import Devicestar from "../../img/16.png";
import { withRouter } from 'react-router-dom';
import {ui_selworkorder} from '../../actions';

class Page extends React.Component {

    render() {
        let data = [];
        const {carcollections,} = this.props;
        map(carcollections,(id)=>{
          // let item = g_devicesdb[id];
          data.push({name :`${id}`,id});
        });

        return (
            <div className="mydevicelist">
                {
                    map(data, (d, i)=>{
                        return (
                            <div className="li" key={i} onClick={()=>{
                              // this.props.history.push(`/deviceinfo/${d.id}`)}
                                this.props.dispatch(ui_selworkorder(d.id));
                              }
                            }><img src={Devicestar} alt=""/>{d.name}</div>
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

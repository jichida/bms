import React from 'react';
import './getmapstyle.css';
import lodashmap from 'lodash.map';
import { push,goBack,go  } from 'react-router-redux';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';

export class Page extends React.Component {

    clickfn_device = ()=>{
        // this.props.dispatch(push(`/deviceinfo/${}`));
    }

    getlist = ()=>{
        const { deviceitemlist } = this.props;
        return lodashmap(deviceitemlist,(deviceitem, i)=>{
            return (
                <p onclick={this.clickfn_device.bind(this, deviceitem.DeviceId)} key={i}>
                    <i className="t">车辆ID:{deviceitem.DeviceId}</i>
                    <i>{`总电流: ${deviceitem['总电流']},总电压:${deviceitem['总电压']},SOC:${deviceitem['SOC']},车速:${deviceitem['车速']},总里程:${deviceitem['总里程']},绝缘阻抗:${deviceitem['绝缘阻抗']},电池最高温度:${deviceitem['电池最高温度']},车辆当前位置:${deviceitem['车辆当前位置']},当前报警信息:${deviceitem['当前报警信息']}`}</i>
                </p>
            );
        });
    }
    render() {
        return (
            <div className="getmapstylepage">
                {this.getlist()}
            </div>
        );
    }
}

Page.propTypes = {
    deviceitemlist : PropTypes.array.isRequired
};
// Page = withRouter(Page);
export default Page;

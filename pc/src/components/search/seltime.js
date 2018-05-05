/**
 * Created by jiaowenhui on 2017/7/28.
    底部点击展开菜单栏
 */
import React from 'react';
import { DatePicker} from 'antd';
import cnLocale from 'antd/lib/date-picker/locale/zh_CN.js';

class DateRange extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          endOpen: false,
        }
    }

    disabledStartDate = (startValue) => {
        const endValue = this.props.endDate;
        if (!startValue || !endValue) {
            return false;
        }
        return startValue.valueOf() > endValue.valueOf();
    }

    disabledEndDate = (endValue) => {
        const startValue = this.props.startDate;
        if (!endValue || !startValue) {
            return false;
        }
        return endValue.valueOf() <= startValue.valueOf();
    }

    onChange = (field, value) => {
        let {startDate,endDate} = this.props;
        let obj = {startDate,endDate};
        obj[field] = value;
        if(!!this.props.onChangeSelDate){
          this.props.onChangeSelDate(obj.startDate,obj.endDate);
        }
    }

    onStartChange = (value) => {
        this.onChange('startDate', value);
    }

    onEndChange = (value) => {
        this.onChange('endDate', value);
    }

    handleStartOpenChange = (open) => {
        if (!open) {
            this.setState({ endOpen: true });
        }
    }

    handleEndOpenChange = (open) => {
        this.setState({ endOpen: open });
    }

    render() {
        const {endOpen} = this.state;
        const { startDate, endDate } = this.props;
        return (
            <div className="daterange">
                <DatePicker
                    locale={cnLocale}
                    disabledDate={this.disabledStartDate}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    value={startDate}
                    placeholder="开始日期和时间"
                    onChange={this.onStartChange}
                    onOpenChange={this.handleStartOpenChange}
                    style={{width: !!this.props.width?`${this.props.width}px`:"180px",marginRight : "10px"}}
                />
                <DatePicker
                    locale={cnLocale}
                    disabledDate={this.disabledEndDate}
                    showTime
                    format="YYYY-MM-DD HH:mm:ss"
                    value={endDate}
                    placeholder="结束日期和时间"
                    onChange={this.onEndChange}
                    open={endOpen}
                    onOpenChange={this.handleEndOpenChange}
                    style={{width: !!this.props.width?`${this.props.width}px`:"180px"}}
                />
            </div>
        );
    }
}

export default DateRange;

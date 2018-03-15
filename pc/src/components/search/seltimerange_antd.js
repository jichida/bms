import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const { RangePicker } = DatePicker;

class DateRange extends React.Component {

  constructor(props) {
      super(props);
      this.state = {
        startDate: props.startDate,
        endDate:props.endDate
      };
  }
  //   handleApply =(event, picker)=> {
  //     let obj = {
  //        startDate: picker.startDate,
  //        endDate: picker.endDate,
  //      };
  //     if(!!this.props.onChangeSelDate){
  //       this.props.onChangeSelDate(obj.startDate,obj.endDate);
  //     }
  //  }
 onChange(value, dateString){

    const startDate = value[0];
    const endDate = value[1];
    this.setState({startDate,endDate});
    // console.log('Selected Time: ', value);
    // console.log('Formatted Selected Time: ', dateString);
  }

 onOk(value) {
    console.log('onOk: ', value);
    const startDate = value[0];
    const endDate = value[1];
    if(!!this.props.onChangeSelDate){
      this.props.onChangeSelDate(startDate,endDate);
    }
  }

  render() {
        const { startDate, endDate } = this.state;
        // let start = startDate.format('YYYY-MM-DD HH:mm:ss');
        // let end = endDate.format('YYYY-MM-DD HH:mm:ss');

        // let label = start + ' - ' + end;
        // if (start === end) {
        //   label = start;
        // }
        // let locale = {
        //   format: 'YYYY-MM-DD',
        //   separator: ' - ',
        //   applyLabel: '确定',
        //   cancelLabel: '取消',
        //   weekLabel: '星期',
        //   customRangeLabel: '自定义范围',
        //   daysOfWeek: moment.weekdaysMin(),
        //   monthNames: moment.monthsShort(),
        //   firstDay: moment.localeData().firstDayOfWeek(),
        //   daysOfWeek: [
        //      "日",
        //      "一",
        //      "二",
        //      "三",
        //      "四",
        //      "五",
        //      "六"
        //    ],
        //    monthNames: [
        //        "1月",
        //        "2月",
        //        "3月",
        //        "4月",
        //        "5月",
        //        "6月",
        //        "7月",
        //        "8月",
        //        "9月",
        //        "10月",
        //        "11月",
        //        "12月"
        //    ],
        // };

        return (
            <RangePicker
               value={[startDate,endDate]}
               showTime={{ format: 'HH:mm' }}
               format="YYYY-MM-DD HH:mm"
               placeholder={['开始时间', '结束时间']}
               onChange={this.onChange.bind(this)}
               onOk={this.onOk.bind(this)}
            >
            </RangePicker>
        );
    }
}

export default DateRange;

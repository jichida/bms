import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { NumberInput,
  NumberField,
  Edit,
  Show,
  SimpleForm,
  DisabledInput,
  TextInput,
  SimpleShowLayout,
  DateInput,
  LongTextInput,
  ReferenceManyField,
  Datagrid,
  TextField,
  DateField,
  EditButton,
  BooleanInput,
  TabbedForm,
  FormTab,
  Filter,
  SelectInput,
  SelectField,
  ImageField,
  ReferenceInput,
  ReferenceField } from 'admin-on-rest/lib/mui';

import { Field,FieldArray } from 'redux-form';
import TimePicker from 'material-ui/TimePicker';
import moment from 'moment';
import _ from 'lodash';
import {ShowActions} from '../controls/createeditactions';
import ShowButton from '../controls/ShowButton';
import config from '../../env/config';
import {DateInputFilter} from '../controls/FilterControls';
import {getwarningleveltext} from '../../util/getdeviceitemstatus';

const RealtimeAlamTitle = ({record}) => {
   return <span>每日报警统计</span>
};

const bridge_deviceinfo = (deviceinfo)=>{
  const {LastRealtimeAlarm,...rest} = deviceinfo;
  let deviceinfonew = {...rest,...LastRealtimeAlarm};
  return deviceinfonew;
}
 const getalarmfieldtotxt = (alarmfield)=>{
    let mapdict = {};
    if(_.startsWith(alarmfield, 'AL_') || _.startsWith(alarmfield, 'F[')){
      if(_.startsWith(alarmfield, 'AL_')){
        if(!!mapdict[alarmfield]){
          return mapdict[alarmfield].showname;
        }
      }
      return alarmfield;
    }
    return undefined;
};


const AlarmField = ({ record = {} }) => {
  let alarmtxt = '';
  let deviceinfo = bridge_deviceinfo(record);
  let {_id,CurDay,DeviceId,__v,DataTime,warninglevel,Longitude,Latitude,...rest} = deviceinfo;
  _.map(rest,(v,key)=>{
    let keytxt = getalarmfieldtotxt(key);
    if(!!keytxt){
      alarmtxt += `${keytxt} ${v}次|`
    }
  });
  return (<span>{alarmtxt}</span>);
}

const AlarmLevel = ({record,source}) => {
  return(
    <span>
      {getwarningleveltext(record[source])}
    </span>
  )
}



const RealtimeAlarmShow = (props) => {
  return (<Show title={<RealtimeAlamTitle />} {...props}  actions={<ShowActions />}>
    <SimpleShowLayout>
     <TextField label="设备ID" source="DeviceId" />
     <TextField label="日期" source="CurDay" />
     <TextField label="采集时间" source="DataTime"  />
     <AlarmLevel label="报警等级" source="warninglevel" addLabel={true}/>
     <AlarmField label="报警信息" addLabel={true}/>
    </SimpleShowLayout>
  </Show>
  );
};

const DeviceFilter = (props) => (
  <Filter {...props}>
    <TextInput label="搜索设备" source="DeviceId" />
    <SelectInput  label="报警等级"  source="warninglevel" choices={[
        { id: '高', name: '三级' },
        { id: '中', name: '二级' },
        { id: '低', name: '一级' },
    ]} />
    <DateInputFilter source="CurDay" label="当前日期" options={{
      okLabel: '确定',
      cancelLabel: '取消',
      locale: 'zh-cn'
    }} />
  </Filter>
)

const RealtimeAlarmList = (props) => (
  <List title={<RealtimeAlamTitle />} filters={<DeviceFilter />} {...props} sort={{field:'DataTime',order:'DESC'}} perPage={config.listperpage}>
    <Datagrid  bodyOptions={{ showRowHover: true }} >
      <TextField label="设备" source="DeviceId" />
      <TextField label="日期" source="CurDay" />
      <TextField label="采集时间" source="DataTime"  />
      <AlarmLevel label="报警等级" source="warninglevel" />
      <AlarmField label="报警信息" />
      <TextField label="更新时间" source="UpdateTime"  sortable={false} />
      <ShowButton />
    </Datagrid>
  </List>
);

export {RealtimeAlarmList,RealtimeAlarmShow};

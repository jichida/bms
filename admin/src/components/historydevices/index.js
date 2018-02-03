import React from 'react';
import { List, EmailField,RichTextInput } from 'admin-on-rest/lib/mui';
import { CardActions } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import NavigationRefresh from 'material-ui/svg-icons/navigation/refresh';
import { NumberInput,
  NumberField,
  Edit,
  SimpleForm,
  DisabledInput,
  TextInput,
  Show,
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
import {ShowActions} from '../controls/createeditactions';
import ShowButton from '../controls/ShowButton';
import config from '../../env/config';

const HistoryDeviceTitle = ({record}) => {
  return <span>设备历史数据管理</span>
};

const choices = [
  {_id:'A',status:'定位'},
  {_id:'V',status:'不定位'},
];

const HistoryDeviceShow = (props)=> {
  return (<Show title={<HistoryDeviceTitle />} {...props} actions={<ShowActions />}>
    <TabbedForm>
      <FormTab label="设备基本信息">
        <TextField label="设备ID" source="DeviceId"  />
        <TextField label="NodeID" source="NodeID"  />
        <TextField label="更新时间" source="UpdateTime"  />
      </FormTab>
      <FormTab label="最近实时报警-基本信息">
        <TextField label="数据包序号" source="SN" />
        <TextField label="采集时间" source="DataTime" />
        <TextField label="Gateway接受到数据时间" source="MessageTime" />
        <TextField label="ALARM" source="ALARM" />
        <TextField label="ALARM_H" source="ALARM_H" />
        <TextField label="ALARM_L" source="ALARM_L" />
        <TextField label="报警信息" source="ALARM_Text" />
        <TextField label="辅助诊断代码" source="Diagnostic_Text" />
        <TextField label="生命信号" source="ALIV_ST_SW_HVS" />
      </FormTab>
      <FormTab label="最近实时报警-设备信息">
        <TextField label="KeyOn信号电压" source="KeyOnVoltage" />
        <TextField label="BMU供电电压" source="PowerVoltage" />
        <TextField label="交流充电供电电压" source="ChargeACVoltage" />
        <TextField label="直流充电供电电压" source="ChargeDCVoltage" />
        <TextField label="CC2检测电压" source="CC2Voltage" />
        <TextField label="本次充电容量" source="ChargedCapacity" />
        <TextField label="总充放电循环次数" source="TotalWorkCycle" />
        <TextField label="BMU采的CSC功耗电流" source="CSC_Power_Current" />
        <TextField label="单体最大SOC" source="BAT_MAX_SOC_HVS" />
        <TextField label="单体最小SOC" source="BAT_MIN_SOC_HVS" />
        <TextField label="系统权重SOC" source="BAT_WEI_SOC_HVS" />
        <TextField label="充电需求电流" source="BAT_Chg_AmperReq" />
        <TextField label="BPM24V,Uout电压采样" source="BPM_24V_Uout" />
        <TextField label="CC2检测电压2" source="CC2Voltage_2" />
        <TextField label="允许放电电流" source="BAT_Allow_Discharge_I" />
        <TextField label="允许充电电流" source="BAT_Allow_charge_I" />
        <TextField label="正极绝缘阻抗" source="BAT_ISO_R_Pos" />
        <TextField label="负极绝缘阻抗" source="BAT_ISO_R_Neg" />
      </FormTab>
      <FormTab label="最近实时报警-设备状态">
        <TextField label="箱体测量电压（外侧）（正值为正向电压，负值为反向电压）" source="BAT_U_Out_HVS" />
        <TextField label="箱体累计电压" source="BAT_U_TOT_HVS" />
        <TextField label="箱体电流" source="BAT_I_HVS" />
        <TextField label="真实SOC" source="BAT_SOC_HVS" />
        <TextField label="SOH" source="BAT_SOH_HVS" />
        <TextField label="最高单体电压" source="BAT_Ucell_Max" />
        <TextField label="最低单体电压" source="BAT_Ucell_Min" />
        <TextField label="平均单体电压" source="BAT_Ucell_Avg" />
        <TextField label="最高单体电压所在CSC号" source="BAT_Ucell_Max_CSC" />
        <TextField label="最高单体电压所在电芯位置" source="BAT_Ucell_Max_CELL" />
        <TextField label="最低单体电压所在CSC号" source="BAT_Ucell_Min_CSC" />
        <TextField label="最低单体电压所在电芯位置" source="BAT_Ucell_Min_CELL" />
        <TextField label="最高单体温度" source="BAT_T_Max" />
        <TextField label="最低单体温度" source="BAT_T_Min" />
        <TextField label="平均单体温度" source="BAT_T_Avg" />
        <TextField label="最高单体温度所在CSC号" source="BAT_T_Max_CSC" />
        <TextField label="最低单体温度所在CSC号" source="BAT_T_Min_CSC" />
        <TextField label="显示用SOC" source="BAT_User_SOC_HVS" />
        <TextField label="继电器内侧电压（正值为正向电压，负值为反向电压）" source="BAT_U_HVS" />
        <SelectField label="空调继电器状态" source="ST_AC_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
        <SelectField label="附件继电器状态" source="ST_Aux_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
        <SelectField label="主负继电器状态" source="ST_Main_Neg_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
        <SelectField label="预充电继电器状态" source="ST_Pre_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
        <SelectField label="主正继电器状态" source="ST_Main_Pos_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
        <SelectField label="充电继电器状态" source="ST_Chg_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
        <SelectField label="风扇继电器状态" source="ST_Fan_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
        <SelectField label="加热继电器状态" source="ST_Heater_SW_HVS" choices={choices} optionText="status" optionValue="_id" />
        <TextField label="加热2继电器状态" source="ST_NegHeater_SW_HVS" />
        <TextField label="无线充电继电器状态" source="ST_WirelessChg_SW" />
        <TextField label="双枪充电继电器2" source="ST_SpearChg_SW_2" />
        <TextField label="集电网充电继电器" source="ST_PowerGridChg_SW" />
      </FormTab>
    </TabbedForm>
  </Show>
  );
};

const DeviceFilter = (props) => (
  <Filter {...props}>
    <TextInput label="搜索设备" source="DeviceId" />
    <TextInput label="SN64" source="SN64_int" />
  </Filter>
)

const HistoryDeviceList = (props)=> (
  <List title={<HistoryDeviceTitle />}  filters={<DeviceFilter />} sort={{field:'SN64',order:'DESC'}} {...props}  perPage={config.listperpage}>
    <Datagrid  bodyOptions={{ showRowHover: true }}>
      <TextField label="设备ID" source="DeviceId" />
      <TextField label="NodeID" source="NodeID" sortable={false} />
      <TextField label="SN64" source="SN64"/>
      <TextField label="采集时间" source="DataTime"  />
      <TextField label="更新时间" source="UpdateTime"  sortable={false} />
      <ShowButton />
    </Datagrid>
  </List>
);

export {HistoryDeviceList,HistoryDeviceShow};

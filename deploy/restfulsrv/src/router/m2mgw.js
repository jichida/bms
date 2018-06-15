const map = require('lodash.map');
const _ = require('lodash');
const device = require('../handler/common/device.js');
const historytrack = require('../handler/common/historytrack');
const historydevice = require('../handler/common/historydevice.js');
const realtimealarm = require('../handler/common/realtimealarm.js');
const DBModels = require('../db/models.js');
const utilposition = require('../handler/common/util_position');
const middlewareauth = require('./middlewareauth.js');
const export_downloadexcel = require('./handler/export_downloadexcel.js');
const getexporttoken = require('./handler/getexporttoken.js');

const getpoint = (v)=>{
  return [v.Longitude,v.Latitude];
}


let startmodule = (app)=>{
  app.post('/api/getexporttoken',middlewareauth,getexporttoken);

  app.post('/api/report_position',(req,res)=>{
    // req,res,dbModel,fields,csvfields,fn_convert
    const dbModel = DBModels.HistoryTrackModel;
    const csvfields = `设备编号,定位时间,省,市,区`;
    const dbfields = 'DeviceId Latitude Longitude GPSTime';
    const fn_convert = (doc,callbackfn)=>{
      if(!!doc.Province){
        //如果已经存在省市区
        callbackfn({
          '设备编号':doc.DeviceId,
          '定位时间':doc.GPSTime,
          '省':doc.Province,
          '市':doc.City,
          '区':doc.Area,
        });
      }
      else{
        utilposition.getpostion_frompos(getpoint(doc),(retobj)=>{
          const newdoc = _.merge(doc,retobj);
          callbackfn({
            '设备编号':newdoc.DeviceId,
            '定位时间':newdoc.GPSTime,
            '省':newdoc.Province,
            '市':newdoc.City,
            '区':newdoc.Area,
          });
        });
      }
    };
    export_downloadexcel({req,res,dbModel,fields:dbfields,csvfields,fn_convert,name:'位置数据'});

  });
  app.post('/api/report_alarm',(req,res)=>{
    // req,res,dbModel,fields,csvfields,fn_convert
    const dbModel = DBModels.RealtimeAlarmModel;
    const csvfields = '车辆ID,报警时间,报警等级,报警信息';
    const fn_convert = (doc,callbackfn)=>{
      const newdoc = realtimealarm.bridge_alarminfo(doc);
      callbackfn(newdoc);

    }
    export_downloadexcel({req,res,dbModel,fields:null,csvfields,fn_convert,name:'报警统计数据'});
  });
  app.post('/api/report_alarmdetail',(req,res)=>{
    // req,res,dbModel,fields,csvfields,fn_convert
    const dbModel = DBModels.RealtimeAlarmRawModel;
    const csvfields = '车辆ID,报警时间,报警等级,报警信息';
    const fn_convert = (doc,callbackfn)=>{
      const newdoc = realtimealarm.bridge_alarmrawinfo(doc);
      callbackfn(newdoc);
    }
    export_downloadexcel({req,res,dbModel,fields:null,csvfields,fn_convert,name:'报警明细数据'});
  });
  app.post('/api/report_historydevice',(req,res)=>{
    // req,res,dbModel,fields,csvfields,fn_convert
    const dbModel = DBModels.HistoryDeviceModel;
    const csvfields = 'RDBID,采集时间,保存时间,箱体测量电压(V),箱体累加电压(V),箱体电流(A),真实SOC(%),\
SOH(%),最高单体电压(V),最低单体电压(V),最高单体电压CSC号,最高单体电压电芯位置,最低单体电压CSC号,最低单体电压电芯位置,\
最高单体温度(℃),最低单体温度(℃),平均单体温度(℃),最高温度CSC号,最低温度CSC号,显示用SOC(%),平均单体电压(V),报警状态,\
生命信号,空调继电器状态,附件继电器状态,主负继电器状态,预充电继电器状态,主正继电器状态,充电继电器状态,风扇控制继电器状态,\
加热继电器状态,继电器内侧电压(V),允许放电电流(A),允许充电电流(A),正极绝缘阻抗(KOHM),负极绝缘阻抗(KOHM),KEYON信号电压(V),\
BMU供电电压(V),交流充电供电电压(V),直流充电供电电压(V),CC2检测电压(V),本次充电容量(AH),总充放电循环次数,BMU采的CSC功耗电流(MA),\
单体最大SOC(%),单体最小SOC(%),系统权重SOC(%),充电需求电流(A),BPM24V UOUT电压采样(V),加热2继电器状态,无线充电继电器状态,\
双枪充电继电器2,集电网充电继电器,CC2检测电压2(V)';
    const fn_convert = (doc,callbackfn)=>{
      const newdoc = historydevice.bridge_historydeviceinfo_export(doc);
      callbackfn(newdoc);
    }
    export_downloadexcel({req,res,dbModel,fields:null,csvfields,fn_convert,name:'历史设备数据'});
  });

  app.post('/api/report_cararchives',(req,res)=>{
    // req,res,dbModel,fields,csvfields,fn_convert
    const dbModel = DBModels.DeviceExtModel;
    const csvfields = 'RDB编号,客服packno,车工号（BUS）/VIN（CAR）,类型,容量,串联数,并联数,电芯类型,CATL项目名称,\
项目PN,电池系统流水号,BMU硬件版本,CSC硬件版本,BMU软件版本,CSC软件版本,电池入库日期,电池出货日期,车辆生产厂,\
车辆型号,装车日期,整车出厂日期,省份,地区,里程(暂无，保留),客户名称,客户联系地址,客户联系人,客户联系电话,客户移动电话,\
用途,购买日期,新车上牌日期,车牌号,售后外服姓名,开始使用年份';
    const fn_convert = (doc,callbackfn)=>{
      const newdoc = {
        "RDB编号": _.get(doc,"DeviceId",''),
        "车工号（BUS）/VIN（CAR）": _.get(doc,"buscarvin",''),
        "客服packno": _.get(doc,"packnocs",''),
        "类型":_.get(doc,"type",''),
        "容量": _.get(doc,"capacity",''),
        "串联数": _.get(doc,"serialnumber",''),
        "并联数": _.get(doc,"parallelnumber",''),
        "电芯类型": _.get(doc,"typeelectriccore",''),
        "CATL项目名称":_.get(doc,"catlprojectname",''),
        "项目PN": _.get(doc,"projectpn",''),
        "电池系统流水号": _.get(doc,"batterysystemflownumber",''),
        "BMU硬件版本": _.get(doc,"BMUhardwareversion",''),
        "CSC硬件版本": _.get(doc,"CSChardwareversion",''),
        "BMU软件版本":_.get(doc,"BMUsoftwareversion",''),
        "CSC软件版本": _.get(doc,"CSCsoftwareversion",''),
        "电池入库日期":_.get(doc,"datebatterystorage",''),
        "电池出货日期":_.get(doc,"datebatterydelivery",''),
        "车辆生产厂": _.get(doc,"vehicleproductionplant",''),
        "车辆型号": _.get(doc,"vehiclemodel",''),
        "装车日期":_.get(doc,"dateloading",''),
        "整车出厂日期":_.get(doc,"datevehiclefactory",''),
        "省份": _.get(doc,"province",''),
        "地区": _.get(doc,"area",''),
        "里程(暂无，保留)": _.get(doc,"mileage",''),
        "客户名称": _.get(doc,"customername",''),
        "客户联系地址":_.get(doc,"customercontactaddress",''),
        "客户联系人": _.get(doc,"customercontact",''),
        "客户联系电话":_.get(doc,"customercontactphone",''),
        "客户移动电话": _.get(doc,"customermobilephone",''),
        "用途": _.get(doc,"purpose",''),
        "购买日期": _.get(doc,"datepurchase",''),
        "新车上牌日期": _.get(doc,"datenewcar",''),
        "车牌号":_.get(doc,"licenseplatenumber",''),
        "售后外服姓名": _.get(doc,"nameaftersaleservice",''),
        "开始使用年份": _.get(doc,"usedyear",''),
      };
      callbackfn(newdoc);
    }
    export_downloadexcel({req,res,dbModel,fields:null,csvfields,fn_convert,name:'客户存档数据'});
  });



  //设置设备数据(地理位置\胎压）
  // app.post('/api/setdevicegeo',(req,res)=>{
  //     ////console.log(`get data:${JSON.stringify(req.body)}`);
  //     const data = req.body;
  //     map(data,(item,index)=>{
  //       let Speed = item.Speed;
  //       let Course = item.Course;
  //       try{
  //         if(typeof item.Speed === 'string'){
  //           Speed = parseFloat(item.Speed);
  //         }
  //       }
  //       catch(e){
  //         Speed = 0;
  //       }
  //       try{
  //         if(typeof item.Course === 'string'){
  //           Course = parseFloat(item.Course);
  //         }
  //       }
  //       catch(e){
  //         Course = 0;
  //       }
  //       let item2 = {};
  //       item2.imagetype = '0';
  //       item2.DeviceId = item.deviceid;
  //       item2.LastHistoryTrack = {
  //         Latitude:parseFloat(item.Latitude),
  //         Longitude:parseFloat(item.Longitude),
  //         GPSStatus:item.GPSStatus,
  //         Speed: Speed,
  //         Course: Course,
  //       };
  //       item2.TPData = {
  //         "DataTime": item.DataTime,
  //         "TP1":item.TP1,
  //         "TP2":item.TP2,
  //         "TP3":item.TP3,
  //         "TP4":item.TP4,
  //         "TP5":item.TP5,
  //       }
  //       device.savedevice(item2,{},(err,result)=>{
  //
  //       });
  //     });
  //
  //     res.status(200).json({result:'OK'});
  // });

  //获取轨迹回放数据
  app.post('/api/gethistorytrack',middlewareauth,(req,res)=>{
    const actiondata = req.body;
    historytrack.queryhistorytrack(actiondata,{},(result)=>{
      if(result.cmd === 'queryhistorytrack_result'){
        res.status(200).json({list:result.payload.list});
      }
      else{
        res.status(200).json({list:[]});
      }
    });
  });




};

module.exports=  startmodule;

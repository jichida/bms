//http://lbs.amap.com/api/javascript-api/guide/draw-on-map/infowindow

//构建自定义信息窗体
// {
// 	"DeviceId": "1719101777",
// 	"fields": [{
// 		"fieldname": "BAT_ISO_R_Neg",
// 		"showname": "负极绝缘阻抗",
// 		"fieldvalue": 65534,
// 		"unit": ""
// 	}, {
// 		"fieldname": "BAT_Ucell_Avg",
// 		"showname": "平均单体电压",
// 		"fieldvalue": 3.356,
// 		"unit": ""
// 	}, {
// 		"fieldname": "BAT_T_Max",
// 		"showname": "最高单体温度",
// 		"fieldvalue": -8,
// 		"unit": ""
// 	}, {
// 		"fieldname": "BAT_T_Min",
// 		"showname": "最低单体温度",
// 		"fieldvalue": -9,
// 		"unit": ""
// 	}, {
// 		"fieldname": "BAT_T_Avg",
// 		"showname": "平均单体温度",
// 		"fieldvalue": -8,
// 		"unit": ""
// 	}, {
// 		"fieldname": "AL_Over_Ucell",
// 		"showname": "单体过压报警",
// 		"fieldvalue": "",
// 		"unit": ""
// 	}, {
// 		"fieldname": "AL_Over_Tcell",
// 		"showname": "单体过温报警",
// 		"fieldvalue": "",
// 		"unit": ""
// 	}, {
// 		"fieldname": "AL_Err_Cldu",
// 		"showname": "电池漏液告警",
// 		"fieldvalue": "",
// 		"unit": ""
// 	}, {
// 		"fieldname": "Flag_Charging",
// 		"showname": "充电状态",
// 		"fieldvalue": "",
// 		"unit": ""
// 	}, {
// 		"fieldname": "ChargeACVoltage",
// 		"showname": "交流充电供电电压",
// 		"fieldvalue": 4.6,
// 		"unit": ""
// 	}, {
// 		"fieldname": "AL_Under_Tcell",
// 		"showname": "单体低温报警",
// 		"fieldvalue": "",
// 		"unit": ""
// 	}, {
// 		"fieldname": "AL_Under_Ucell",
// 		"showname": "单体欠压报警",
// 		"fieldvalue": "",
// 		"unit": ""
// 	}]
// }
const createInfoWindow_popinfo =(data)=> {

      console.log(JSON.stringify(data));

      const title = 'title';
      const content = 'content';

      var info = document.createElement("div");
      info.className = "info";

      //可以通过下面的方式修改自定义窗体的宽高
      //info.style.width = "400px";
      // 定义顶部标题
      var top = document.createElement("div");
      var titleD = document.createElement("div");
      var closeX = document.createElement("img");
      top.className = "info-top";
      titleD.innerHTML = title;
      closeX.src = "http://webapi.amap.com/images/close2.gif";
      // closeX.onclick = closeInfoWindow;

      top.appendChild(titleD);
      top.appendChild(closeX);
      info.appendChild(top);

      // 定义中部内容
      var middle = document.createElement("div");
      middle.className = "info-middle";
      middle.style.backgroundColor = 'white';
      middle.innerHTML = content;
      info.appendChild(middle);

      // 定义底部内容
      var bottom = document.createElement("div");
      bottom.className = "info-bottom";
      bottom.style.position = 'relative';
      bottom.style.top = '0px';
      bottom.style.margin = '0 auto';
      var sharp = document.createElement("img");
      sharp.src = "http://webapi.amap.com/images/sharp.png";
      bottom.appendChild(sharp);
      info.appendChild(bottom);

      // let info = [];
      //    info.push("<div><img src="\"" http:="" webapi.amap.com="" images="" autonavi.png="" \"=""> ");<br>
      //    info.push("<div style="\"padding:0px" 0px="" 4px;\"=""><b>高德软件有限公司</b>");<br>
      //    info.push("电话 : 010-84107000   邮编 : 100102");<br>
      //    info.push("地址 : 北京市望京阜通东大街方恒国际中心A座16层</div></div>");<br>

      return {
          // isCustom: true,  //使用自定义窗体
          content: 'ok',
          // offset: new AMap.Pixel(16, -50)//-113, -140
      }
  }

  //构建自定义信息窗体
  const createInfoWindow_poplistinfo =(data)=> {
        console.log(JSON.stringify(data));


        const title = 'title';
        const content = 'content';
        var info = document.createElement("div");
        info.className = "info";

        //可以通过下面的方式修改自定义窗体的宽高
        //info.style.width = "400px";
        // 定义顶部标题
        var top = document.createElement("div");
        var titleD = document.createElement("div");
        var closeX = document.createElement("img");
        top.className = "info-top";
        titleD.innerHTML = title;
        closeX.src = "http://webapi.amap.com/images/close2.gif";
        // closeX.onclick = closeInfoWindow;

        top.appendChild(titleD);
        top.appendChild(closeX);
        info.appendChild(top);

        // 定义中部内容
        var middle = document.createElement("div");
        middle.className = "info-middle";
        middle.style.backgroundColor = 'white';
        middle.innerHTML = content;
        info.appendChild(middle);

        // 定义底部内容
        var bottom = document.createElement("div");
        bottom.className = "info-bottom";
        bottom.style.position = 'relative';
        bottom.style.top = '0px';
        bottom.style.margin = '0 auto';
        var sharp = document.createElement("img");
        sharp.src = "http://webapi.amap.com/images/sharp.png";
        bottom.appendChild(sharp);
        info.appendChild(bottom);
        // return info;
        return {
            isCustom: true,  //使用自定义窗体
            content: info,
            // offset: new AMap.Pixel(16, -50)//-113, -140
        }
    }

export {createInfoWindow_popinfo,createInfoWindow_poplistinfo};

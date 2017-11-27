import React from 'react';
import { connect } from 'react-redux';
import map from 'lodash.map';
import filter from 'lodash.filter';
import "./style.css";

class SelectDevice extends React.Component {
  constructor(props) {
      super(props);
      this.state = {
        options: []
      }
  }

  componentWillMount(){
    this.getdata('');
  }

  onChange = (e) => {
      this.getdata(e.target.value);
  }

  onClick = (id)=>{
      console.log(`选择车辆:${id}`);
      this.props.onClickSel(id);
  }

  getdata =(value)=>{

    let options=[];
    let optionsarr=[];
    let {deviceidlist} = this.props;

    if (!!deviceidlist) {
      optionsarr = filter(deviceidlist,function(o) { return o.indexOf(value)!=-1; });
      if(optionsarr.length>100){optionsarr.length=100}
      options = map(optionsarr,(deviceid,index)=>{
        return <div key={deviceid} onClick={this.onClick.bind(this,deviceid)}>{deviceid}</div>;
      });
    }
    this.setState({ options });
  }

  render() {

    return (
      <div className="onseldevice">
        <div className="titleinput">
            <input name="" placeholder="请输入车辆ID" type="number" onChange={this.onChange.bind(this)} />
        </div>
        <div className="list">{this.state.options}</div>
      </div>
    );
  }
}
const mapStateToPropsSelectDevice = ({device}) => {
    const {g_devicesdb} = device;
    return {g_devicesdb};
}
export default connect(mapStateToPropsSelectDevice)(SelectDevice);

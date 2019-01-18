import React, { Component } from 'react';
import { Steps, Button, Spin, message,Alert, Progress } from 'antd';

class StartImport extends React.Component {
	constructor(props) {
		super(props);
	};


	render() {
		const {isimporting,result} = this.props;
		// if(isimporting){
		// 	// return (<Spin tip="正在导入请稍后...">
		// 	// 			  </Spin>);
		// }
		// if(result.issuccess){
			return (
				//<Alert message={`${result.textmsg}`} type="success" showIcon />
				<div>
					<div style={{textAlign: 'center'}}>{result.textmsg}</div>
					<div><Progress percent = {result.percent} style={{margin: '0 auto'}} /></div>
				</div>
				
			);
		// }
		// return (
		// 	<Alert message={`${result.textmsg}`} type="error" showIcon style={{display:"inline-block"}}/>
		// );

	};

}

export default StartImport;

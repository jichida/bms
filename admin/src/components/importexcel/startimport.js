import React, { Component } from 'react';
import { Steps, Button, Spin, message,Alert } from 'antd';

class StartImport extends React.Component {
	constructor(props) {
		super(props);
	};


	render() {
		const {isimporting,result} = this.props;
		if(isimporting){
			return (<Spin tip="正在导入请稍后...">
						  </Spin>);
		}
		if(result.issuccess){
			return (
				<Alert message={`${result.textmsg}`} type="success" showIcon />
			);
		}
		return (
			<Alert message={`${result.textmsg}`} type="error" showIcon style={{display:"inline-block"}}/>
		);

	};

}

export default StartImport;

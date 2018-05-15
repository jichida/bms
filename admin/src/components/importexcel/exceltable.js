import React, { Component } from 'react';
import { Table, Popconfirm } from 'antd';
import EditableCell from './edittablecell';
import './andtable.css';
/*
  Simple HTML Table
  usage: <OutTable data={data} cols={cols} />
    data:Array<Array<any> >;
    cols:Array<{name:string, key:number|string}>;
*/

class OutTable extends React.Component {
	constructor(props) {
		super(props);
		const {excel_dataSource} = this.props;
		this.cacheData = excel_dataSource.map(item => ({ ...item }));
	}

	renderColumns(text, record, column) {
			return (
				<EditableCell
					editable={record.editable}
					value={text}
					onChange={value => this.handleChange(value, record.key, column)}
				/>
			);
		}
		handleChange(value, key, column) {
			const newData = [...this.props.excel_dataSource];
			const target = newData.filter(item => key === item.key)[0];
			if (target) {
				target[column] = value;
				this.props.onChangeExcelDataSource(newData);
			}
		}
		edit(key) {
			const newData =  [...this.props.excel_dataSource];
			const target = newData.filter(item => key === item.key)[0];
			if (target) {
				target.editable = true;
				this.props.onChangeExcelDataSource(newData);
			}
		}
		save(key) {
			const newData =  [...this.props.excel_dataSource];
			const target = newData.filter(item => key === item.key)[0];
			if (target) {
				delete target.editable;
				this.props.onChangeExcelDataSource(newData);
				this.cacheData = newData.map(item => ({ ...item }));
			}
		}
		cancel(key) {
			const newData =  [...this.props.excel_dataSource];
			const target = newData.filter(item => key === item.key)[0];
			if (target) {
				Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
				delete target.editable;
				this.props.onChangeExcelDataSource(newData);
			}
		}

		render() {
			const {data,excel_dataSource:dataSource,excel_columns} = this.props;
			console.log(dataSource)
			// const {dataSource} = this.state;
			let columns = [];
			if(excel_columns.length > 0){
				for(let i = 0 ;i < excel_columns.length ;i ++){
					columns.push({
						 title: excel_columns[i],
						 dataIndex: excel_columns[i],
						 key: excel_columns[i],
						 render: (text, record) => this.renderColumns(text, record, excel_columns[i]),
					})
				}
			}

			// columns.push({
	    //   title: '操作',
	    //   dataIndex: 'operation',
	    //   render: (text, record) => {
	    //     const { editable } = record;
	    //     return (
	    //       <div className="editable-row-operations">
	    //         {
	    //           editable ?
	    //             <span>
	    //               <a onClick={() => this.save(record.key)}>保存</a>
	    //               <Popconfirm title="确定要取消保存吗?"
			// 								okText="确定" cancelText="取消"
			// 								onConfirm={() => this.cancel(record.key)}>
	    //                 <a>取消</a>
	    //               </Popconfirm>
	    //             </span>
	    //             : <a onClick={() => this.edit(record.key)}>编辑</a>
	    //         }
	    //       </div>
	    //     );
	    //   },
	    // });
	    return (
	        <div className="table-responsive">
	        	<Table dataSource={dataSource} columns={columns} />
	        </div>
	  	);
	  };
};

export default OutTable;

import React from 'react';
import { Table} from 'antd';




class EditableTable extends React.Component {

    // In the fifth row, other columns are merged into first column
    // by setting it's colSpan to be 0

    render() {

        const { data } = this.props;

        const renderContent = (value, row, index) => {
            const obj = {
                children: value,
                props: {},
            };
            if (index === 4) {
                obj.props.colSpan = 0;
            }
            return obj;
        };

        const columns = [{
            title: 'Name',
            dataIndex: 'name',
            render: (text, row, index) => {
                return <span>{text}</span>;
            },
        }, {
            title: 'Age',
            dataIndex: 'age',
            render: (text, row, index) => {
                return <span>{text}</span>;
            },
        }, {
            title: 'Home phone',
            dataIndex: 'tel',
            render: (text, row, index) => {
                return <span>{text}</span>;
            },
        }];

        // const data = [{
        //     key: '1',
        //     name: 'John Brown',
        //     age: 32,
        //     tel: '0571-22098909',
        //     phone: 18889898989,
        //     address: 'New York No. 1 Lake Park',
        // }, {
        //     key: '2',
        //     name: 'Jim Green',
        //     tel: '0571-22098333',
        //     phone: 18889898888,
        //     age: 42,
        //     address: 'London No. 1 Lake Park',
        // }, {
        //     key: '3',
        //     name: 'Joe Black',
        //     age: 32,
        //     tel: '0575-22098909',
        //     phone: 18900010002,
        //     address: 'Sidney No. 1 Lake Park',
        // }, {
        //     key: '4',
        //     name: 'Jim Red',
        //     age: 18,
        //     tel: '0575-22098909',
        //     phone: 18900010002,
        //     address: 'London No. 2 Lake Park',
        // }, {
        //     key: '5',
        //     name: 'Jake White',
        //     age: 18,
        //     tel: '0575-22098909',
        //     phone: 18900010002,
        //     address: 'Dublin No. 2 Lake Park',
        // }];

        return (
            <div>
                <Table columns={columns} dataSource={data} bordered />
            </div>
        );
    }
}

export default EditableTable;


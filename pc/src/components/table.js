import React from 'react';
import { Table} from 'antd';


class EditableTable extends React.Component {

    // In the fifth row, other columns are merged into first column
    // by setting it's colSpan to be 0

    render() {

        const { data,columns } = this.props;

        return (
            <div>
                <Table columns={columns} dataSource={data} bordered />
            </div>
        );
    }
}

export default EditableTable;

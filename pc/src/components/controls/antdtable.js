import React from 'react';
import { Table} from 'antd';
import map from 'lodash.map';
import get from 'lodash.get';
import { connect } from 'react-redux';

class AntdTable extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
          dataSource: [],
          pagination: {
            current:1,
            pageSize:this.props.pagenumber,
            total:1
          },
          refreshing: false,
        }
    }

    componentWillUnmount() {
      this.mounted = false;
    }
    handleTableChange = (pagination, filters, sorter) => {
      const pager = { ...this.state.pagination };
      pager.current = pagination.current;
      this.setState({
        pagination: pager,
      });
      this.onAjax(this.props.query,this.props.sort,this.props.pagenumber,pager.current);
    }

    onAjax(query,sort,pagenumber,page){
      let that = this;
      this.props.dispatch(this.props.queryfun({
          query: query,
          options: {
              sort: sort,
              page: page,
              limit: pagenumber,
          }
      })).then(({result})=> {
        if (that.mounted){
          let initData = [];
          if(!!result){
            map(result.docs,(item)=>{
              item = that.props.onItemConvert(item);
              initData.push(item);
            });
          }
          that.setState({
            dataSource:[...initData],
            refreshing: false,
            pagination:{
              pageSize:pagenumber,
              current:result.page,
              total:result.total,
            }
          });
        }
      });
    }

    componentDidMount() {
      this.mounted = true;
      this.setState({ refreshing: true });
      this.onAjax(this.props.query,this.props.sort,this.props.pagenumber,1);
     }
     onRefresh() {
       this.setState({ refreshing: true });
       this.onAjax(this.props.query,this.props.sort,this.props.pagenumber,1);
     }

    // In the fifth row, other columns are merged into first column
    // by setting it's colSpan to be 0

    render() {

        const { columns } = this.props;

        return (
          <Table columns={columns}
            rowKey={record => record.key}
            dataSource={this.state.dataSource}
            pagination={this.state.pagination}
            loading={this.state.refreshing}
            onChange={this.handleTableChange}
          />
        );
    }
}
export default connect(null, null, null, { withRef: true })(AntdTable);

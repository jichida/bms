import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Card, CardTitle, CardText, CardActions } from 'material-ui/Card';
import inflection from 'inflection';

import Title from 'admin-on-rest/lib/mui/layout/Title';
import { crudGetOne as crudGetOneAction, crudUpdate as crudUpdateAction } from 'admin-on-rest/lib/actions/dataActions';
import DefaultActions from 'admin-on-rest/lib/mui/detail/EditActions';
import translate from 'admin-on-rest/lib/i18n/translate';
import { ShowButton } from 'admin-on-rest/lib/mui/button';
// in src/comments.js
const cardStyle = {
    width: 300,
    minHeight: 300,
    margin: '0.5em',
    display: 'inline-block',
    verticalAlign: 'top'
};
const CommentGrid = (props) => {
  console.log(props);
  const { ids, data:dataall, basePath,isLoading,resource,title,defaultTitle,children } = props;
  return (
      <div style={{ margin: '1em' }}>
      {ids.map(id =>
        {
          const data = dataall[id];
          return (<Card style={{ margin: '2em', opacity: isLoading ? 0.8 : 1 }} key={id}>
              <CardActions style={{ zIndex: 2, display: 'inline-block', float: 'right' }}>
                  {<ShowButton basePath={basePath} record={data} />}
              </CardActions>
              {data && <CardTitle title={<Title title={title} record={data} defaultTitle={defaultTitle} />} />}
              {data && React.cloneElement(children, {
                  onSubmit: this.handleSubmit,
                  resource,
                  basePath,
                  record: data,
              })}
              {!data && <CardText>&nbsp;</CardText>}
            </Card>);
        }

      )}
      </div>
  );
}
CommentGrid.defaultProps = {
    data: {},
    ids: [],
};

export default CommentGrid;

import React from 'react';
import PropTypes from 'prop-types';
import TreeNode from './node.js';
// import _ from 'lodash';

class NodeRenderChildren extends React.Component {
    render() {
        const {animations, decorators: propDecorators, node, style,
        renderLoading,_eventBubbles} = this.props;
        if (node.loading) {
            return renderLoading(propDecorators);
        }

        let children = node.children;
        if (!Array.isArray(children)) {
            children = children ? [children] : [];
        }

        return (
            <ul style={style.subtree}
                ref={ref => this.subtreeRef = ref}>
                {children.map((child, index) => <TreeNode {..._eventBubbles}
                                                          animations={animations}
                                                          decorators={propDecorators}
                                                          key={child.id || index}
                                                          node={child}
                                                          style={style}/>
                )}
            </ul>
        );
    }
}

NodeRenderChildren.propTypes = {
    decorators: PropTypes.object.isRequired,
    animations: PropTypes.object.isRequired,
    node: PropTypes.object.isRequired,
    style: PropTypes.object.isRequired,
    renderLoading: PropTypes.func,
    _eventBubbles: PropTypes.object
};

export default NodeRenderChildren;

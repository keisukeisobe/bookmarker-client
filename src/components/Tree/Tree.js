import React, { Component } from 'react';
import './Tree.css';
import BookmarkContext from '../../contexts/BookmarkContext'

export default class Tree extends Component {
  static contextType = BookmarkContext
  constructor(props) {
    super(props);
    this.state = {
      expanded: props.expanded,
      selected: false,
      parentId: props.parentId,
      data: props.data,
      id: props.data.id
    }
  }

  static defaultProps = {
    id: null,
    parentId: null,
    data: null,
    path: [],
    level: null,
    order: null,
    expanded: false,
    selected: false,
    registerNode: () => { },
    generateTree: () => { },
    handleSelect: () => { },
    sortByFunc: null,
  }

  onDragStart = (e) => {
    this.props.handleOnDragStart(e, this)
  }

  handleExpand = e => {
    this.setState({ expanded: !this.state.expanded }, () => {
      if (this.state.expanded && !this.context.expandedNodes.includes(this.props.id)) {
        this.context.setExpandedNodes([...this.context.expandedNodes, this.props.id])
      } else if (!this.state.expanded && this.context.expandedNodes.includes(this.props.id)) {
        let idx = this.context.expandedNodes.findIndex(item => item === this.props.id);
        this.context.expandedNodes.splice(idx, 1);
        this.context.setExpandedNodes(this.context.expandedNodes);
      }
    });

  };

  toggleSelect = () => {
    this.setState({ selected: !this.state.selected }, () => {
      this.props.handleSelect(this)
    })
  }

  componentDidMount() {
    this.props.registerNode(this)
  }

  componentDidUpdate(prevProps, prevState) {
    this.props.registerNode(this)
  }

  render() {
    const indent = this.props.level * 10;
    let contents = this.props.data.contents;

    if (this.props.sortByFunc) {
      contents = this.props.sortByFunc(contents);
    }

    return (
      <div
        className="Tree"
        style={{
          position: 'relative',
          left: `${indent}px`
        }}
      >
        <div
          draggable
          onDragStart={this.onDragStart}
          // onDrag={this.props.handleOnDrag}
          onDragEnd={this.props.handleOnDragEnd}
          onClick={this.toggleSelect}
          onDrop={this.toggleSelect}
          onDragOver={(e) => { e.preventDefault() }}
          className={ `Tree-info ${this.state.selected && ` selected`}` }>
          {this.props.data.icon && (
            <img className="Tree-icon" src={this.props.data.icon} alt="icon" />
          )}
          <div className="Tree-detail">
            {/* <NodeManager node={this.props.data} /> */}
            {this.props.data.title && (
              <span className="Tree-title">{this.props.data.title}</span>
            )}
            {this.props.data.url && (
              <a
                className="Tree-url"
                href={this.props.data.url}
                target="_blank"
              >
                {this.props.data.url}
              </a>
            )}
          </div>
        </div>

        {/* {this.props.tree.last_modified &&
          <span className="Tree-modified">
            Last_modified: {this.props.tree.last_modified}</span>} */}

        {(this.props.data.type === 'folder' || this.props.data.contents) &&
          <button className="expand-button" onClick={this.handleExpand}>
            {this.state.expanded ? '-' : '+'}
          </button>
        }

        {contents &&
          this.props.expanded &&
            contents.map((data, i) => {
              return (
                <Tree
                  id={data.id}
                  parentId={this.props.data.id}
                  key={data.id}
                  data={data}
                  level={this.props.level + 1}
                  order={i}
                  path={[...this.props.path, this.props.id]}
                  expanded={this.context.expandedNodes.includes(data.id)}
                  registerNode={this.props.registerNode}
                  sortByFunc={this.props.sortByFunc}
                  handleSelect={this.props.handleSelect}
                  handleOnDragStart={this.props.handleOnDragStart}
                  // handleOnDrag={this.props.handleOnDrag}
                  handleOnDragEnd={this.props.handleOnDragEnd}
                />
              )
            }
        )}
      </div>
    );
  }
}

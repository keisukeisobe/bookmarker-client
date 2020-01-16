import React, { Component } from 'react';
import BookmarksContext from '../../contexts/BookmarkContext';

export class NodeManager extends Component {
  static contextType = BookmarksContext;
  state = {
    edit: false
  };

  toggleEdit = () => {
    const edit = !this.state.edit;
    this.setState({ edit });
  };

  handleDelete = () => {
    let confirmRemoveChildren = true; //default true for nodes with no children
    const node = this.props.node;
    if (node.contents && node.contents.length > 0) {
      confirmRemoveChildren = window.confirm(
        `This will delete ${node.title} and all contents!  Continue?`
      );
    }
    const nodes = [...this.context.bookmarks];
    const root = {
      contents: nodes
    };
    const parent = this.recursiveFind(this.parentPredicate, [root]);
    if (!parent) {
      throw new Error('Could not find parent node');
    }
    const idx = parent.contents.findIndex(this.idPredicate);

    if (confirmRemoveChildren) {
      parent.contents.splice(idx, 1); //in place update
      this.context.setBookmarks(root.contents);
    }
  };

  parentPredicate = node => {
    console.log('target: ', this.props.node.id);
    node.contents && console.log('searching: ', node.contents);
    return node.contents && node.contents.some(this.idPredicate);
  };

  idPredicate = node => node.id === this.props.node.id;

  handleEdit = () => {
    const nodes = [...this.context.bookmarks];
    const bm = this.recursiveFind(this.idPredicate, nodes);
    if (!bm) {
      throw new Error('Could not find matching node');
    }
    bm.title = document.getElementById('newtitle').value; //update in place
    this.context.setBookmarks(nodes);
    this.toggleEdit();
  };

  recursiveFind(predicate, nodes) {
    for (const node of nodes) {
      if (predicate(node)) {
        return node;
      }
      if (node.contents) {
        const maybeResult = this.recursiveFind(predicate, node.contents);
        if (maybeResult) return maybeResult;
      }
    }
    return null;
  }

  render() {
    return (
      <div>
        {this.state.edit ? (
          <form
            onSubmit={ev => {
              ev.preventDefault();
              this.handleEdit();
            }}
          >
            <input type="text" id="newtitle" />{' '}
            <button type="submit">Save</button>
          </form>
        ) : (
          <>
            <button type="button" onClick={this.toggleEdit}>
              Edit
            </button>
            <button type="button" onClick={this.handleDelete}>
              Delete
            </button>
          </>
        )}
      </div>
    );
  }
}

export default NodeManager;

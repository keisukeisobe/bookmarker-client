import React, { Component } from 'react';
import BookmarkContext from '../../contexts/BookmarkContext';
import './Info.css';

import NodeManager from '../NodeManager/NodeManager';
import Archive from '../Archive/Archive';

export default class Info extends Component {
  static contextType = BookmarkContext;
  state = {
    selectedNode: this.props.selectedNode,
    title: {
      value: this.props.selectedNode.title,
      touched: false
    },
    url: {
      value: this.props.selectedNode.url,
      touched: false
    },
    tags: {
      value: this.props.selectedNode.tags,
      touched: false
    }
  };

  updateTitle(title) {
    this.setState({
      title: {
        value: title,
        touched: true
      }
    });
  }

  updateURL(url) {
    this.setState({
      url: {
        value: url,
        touched: true
      }
    });
  }

  updateTags(tags) {
    this.setState({
      tags: {
        value: tags,
        touched: true
      }
    });
  }

  handleSubmit = ev => {
    ev.preventDefault();
    let { title, url, tags, selectedNode } = this.state;
    if (tags.value.length > 0) {
      tags.value = tags.value.split(',').map(tag => tag.trim());
    }
    title = title.value;
    url = url.value;

    if (tags.length > 0) {
      tags = tags.value.split(', ');
    } else {
      tags = [tags.value];
    }
    this.context.updateNode(selectedNode.id, { title, url, tags });
  };

  render() {
    return (
      <>
        <h3>Edit Info</h3>
        <form onSubmit={this.handleSubmit}>
          <label htmlFor='title'>Title:</label>
          <input
            type='text'
            name='title'
            className='infoInput'
            defaultValue={this.state.selectedNode.title}
            onChange={e => this.updateTitle(e.target.value)}
          />
          <br />
          <div className={this.state.selectedNode.type === 'folder' ? 'hidden' : ''}>
            <label htmlFor='url' >URL:</label>
            <input
              type='url'
              name='url'
              className='infoInput'
              defaultValue={this.state.selectedNode.url}
              onChange={e => this.updateURL(e.target.value)}
            />
          </div>
          <div className={this.state.selectedNode === null ? 'hidden' : ''}>
            <label htmlFor='tags'>Tags:</label>
            <input
              type='text'
              name='tags'
              className='infoInput'
              defaultValue={this.state.selectedNode.tags}
              onChange={e => this.updateTags(e.target.value)}
            />
          </div>
          <input
            type='submit'
            value='Save'
            className='btn infoSubmit'
          />
          {this.props.selectedNodes.length === 1 &&
            <NodeManager clearSelect={this.props.clearSelect} node={this.props.selectedNode} />
          }
        </form>

        <div className={this.state.selectedNode.type === 'folder' ? 'hidden' : ''}>
          {this.state.selectedNode.type === 'bookmark' &&
            <img
              className='previewImg'
              src={`https://image.thum.io/get/auth/7215-bookmarks/crop/200/${this.state.url.value}`}
              alt={`${this.state.title.value} preview`}
            />}
        </div>
        {this.state.selectedNode.type === 'bookmark' && <Archive node={this.state.selectedNode} />}
      </>
    );
  }
}

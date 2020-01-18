import React, { Component } from 'react'
import './DragDrop.css'

export default class DragDrop extends Component {

  constructor(props) {
    super(props)
    this.state = {
      selectedItems: props.selectedItems,
      moving: props.moving,
      fade: true,
    }
  }

  static defaultProps = {
    moving: false,
    selectedItems: null
  }

  mousePos = {x: null, y: null}

  handleMoveStart = (e) => {
    this.setState({
      moving: true,
      fade: false,
    })
  }

  handleMoving = (e, node) => {

    if (this.state.moving) {
      this.mousePos = {
        x: e.clientX,
        y: e.clientY,
      }
    }
  }

  componentDidMount() {

  }

  render() {
    return (
      <div
        className="DragDrop"
        style={{
          position: this.props.moving ? 'fixed' : 'fixed',
          zIndex: this.props.moving ? '1' : '2',
          transparency: this.props.moving ? '100' : '50',
          right: '100px',
          bottom: '10px',
        }}
      >
        <div className="top">

        </div>
        <div className="selected-list">
            Drag Me
          <ul>
            {this.props.selectedItems &&
              this.props.selectedItems.map(item => {
                return (
                  <li key={item.props.uid}>
                    {item.props.data.title}
                  </li>
                )
              })
            }
          </ul>
        </div>
      </div>
    )
  }
}

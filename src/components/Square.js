import React from 'react'
import PropTypes from 'prop-types'

export default class Square extends React.Component {
  render() {
    const { black } = this.props
    const fill = black ? 'black' : 'white'
    const stroke = black ? 'white' : 'black'

    return (
      <div style={{ backgroundColor: fill, color: stroke, height: 50, lineHeight: '50px', textAlign: 'center' }}>
        {this.props.children}
      </div>
    )
  }
}

Square.propTypes = {
  black: PropTypes.bool
}
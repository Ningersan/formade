import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Input extends Component {
    static propTypes = {
        defaultValue: PropTypes.string,
        value: PropTypes.string,
        onChange: PropTypes.func,
        saveTitle: PropTypes.func,
        className: PropTypes.string.isRequired,
    }

    constructor() {
        super()
        this.handleFocus = this.handleFocus.bind(this)
        this.handleBlur = this.handleBlur.bind(this)
    }

    handleFocus() {
        this.input.select()
    }

    handleBlur(e) {
        if (this.props.saveTitle) {
            this.props.saveTitle(e.target.value, 'question')
        }
    }

    render() {
        const { className, defaultValue, value, onChange } = this.props
        return (
            <input
              type="text"
              className={className}
              ref={(input) => { this.input = input }}
              defaultValue={defaultValue}
              value={value}
              onFocus={this.handleFocus}
              onChange={onChange}
              onBlur={this.handleBlur}
            />
        )
    }
}

export default Input

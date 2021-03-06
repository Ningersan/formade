import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Textarea } from '../../../../components/index'
import styles from './Question.scss'

class Question extends Component {
    static propTypes = {
        isFilled: PropTypes.bool.isRequired,
        title: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        isRequired: PropTypes.bool.isRequired,
        options: PropTypes.array.isRequired,
        handleFill: PropTypes.func.isRequired,
        handleChooseOption: PropTypes.func.isRequired,
        handleSaveText: PropTypes.func.isRequired,
    }

    constructor() {
        super()
        this.renderOption = this.renderOption.bind(this)
        this.handleChooseOption = this.handleChooseOption.bind(this)
    }

    getSymbolClassName() {
        return this.props.type === 'radio' ? styles['radio-icon'] : styles['checkbox-icon']
    }

    handleChooseOption(index, type) {
        this.props.handleFill()
        this.props.handleChooseOption(index, type)
    }

    renderOption(option, index) {
        const { type, title } = this.props
        return (
            <label
              key={index}
              className={styles['option-item-wrap']}
            >
                <div className={styles['label-wrap']}>
                    <input
                      type={type}
                      name={title}
                      className={styles.toggle}
                      onChange={() => this.handleChooseOption(index, type)}
                    />
                    <span className={this.getSymbolClassName()} />
                    <span className={styles['option-text']}>{option}</span>
                </div>
            </label>
        )
    }

    render() {
        const { title, type, isFilled, isRequired, handleSaveText } = this.props
        const options = this.props.options.map(this.renderOption)
        const questionStyle = { backgroundColor: '#ffebee' }
        const text = (
            <Textarea
              className={styles.textarea}
              placeholder="您的回答"
              handleSaveText={handleSaveText}
            />
        )

        return (
            <div className={styles.question} style={isFilled ? questionStyle : null}>
                <div className={styles.title}>
                    {title}
                    {isRequired &&
                        <span className={styles['tips-text']}>*</span>
                    }
                </div>
                <div className={styles['option-list']}>
                    {type === 'text' ? text : options}
                </div>
                {this.props.isFilled &&
                    <div className={styles['warning-text']}>此问题必须填写</div>
                }
            </div>
        )
    }
}

export default Question

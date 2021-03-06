import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { bindActionCreators } from 'redux'
import Toggle from 'material-ui/Toggle'
import Chart from '../Chart/Chart'
import * as questionnaireActions from '../../../../actions/questionnaire'
import styles from './Response.scss'

class Response extends React.Component {
    static propTypes = {
        questionnaires: PropTypes.array.isRequired,
        editing: PropTypes.object.isRequired,
        actions: PropTypes.shape({
            stopResponse: PropTypes.func.isRequired,
        }).isRequired,
    }

    constructor() {
        super()
        this.handleToggle = this.handleToggle.bind(this)
    }

    handleToggle() {
        const { stopResponse } = this.props.actions
        stopResponse()
    }

    renderChart(question, questionIndex, data) {
        const statistic = []
        const { type, options } = question

        switch (type) {
            case 'radio': {
                let unfilled = 0
                data.forEach((answer) => {
                    const optionIndex = answer[questionIndex]
                    if (optionIndex === undefined) {
                        unfilled++
                    }
                    const option = options[optionIndex]
                    statistic[optionIndex] ? statistic[optionIndex].value++ : statistic[optionIndex] = { name: option, value: 1 }
                })
                options.forEach((option, index) => {
                    if (!statistic[index]) {
                        statistic[index] = { name: option, value: 0 }
                    }
                })
                const configure = {
                    title: {
                        text: question.title,
                        subtext: `（${data.length - unfilled}条回复）`,
                        textStyle: {
                            fontSize: '20',
                            fontFamily: 'Helvetica Neue, Helvetica, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif',
                            fontWeight: '400',
                        },
                        subtextStyle: {
                            fontSize: '14',
                            fontFamily: 'Helvetica Neue, Helvetica, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif',
                            color: '#8E8E93',
                        },
                    },
                    tooltip: {
                        trigger: 'item',
                        formatter: '{a} <br/>{b} : {c} ({d}%)',
                    },
                    legend: {
                        orient: 'vertical',
                        left: '80%',
                        data: options,
                    },
                    series: {
                        name: question.title,
                        type: 'pie',
                        radius: '50%',
                        data: statistic,
                    },
                }
                return (
                    <Chart option={configure} />
                )
            }
            case 'checkbox': {
                let unfilled = 0
                data.forEach((answer) => {
                    if (answer[questionIndex]) {
                        answer[questionIndex].forEach((optionIndex) => {
                            statistic[optionIndex] = statistic[optionIndex] + 1 || 1
                        })
                    } else {
                        unfilled++
                    }
                })
                options.forEach((option, index) => {
                    if (!statistic[index]) {
                        statistic[index] = 0
                    }
                })
                const configure = {
                    title: {
                        text: question.title,
                        subtext: `（${data.length - unfilled}条回复）`,
                        textStyle: {
                            fontSize: '20',
                            fontFamily: 'Helvetica Neue, Helvetica, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif',
                            fontWeight: '400',
                        },
                        subtextStyle: {
                            fontSize: '12',
                            fontFamily: 'Helvetica Neue, Helvetica, Hiragino Sans GB, Microsoft YaHei, Arial, sans-serif',
                            color: '#8E8E93',
                        },
                    },
                    tooltip: {},
                    legend: {
                        data: ['人数'],
                    },
                    xAxis: {},
                    yAxis: {
                        data: options,
                    },
                    series: [{
                        name: '人数',
                        type: 'bar',
                        data: Object.keys(statistic).map(v => statistic[v]),
                    }],
                }
                return (
                    <Chart option={configure} />
                )
            }
            case 'text': {
                data.forEach((answer) => {
                    if (!(typeof answer[questionIndex] === 'undefined')) {
                        statistic.push(answer[questionIndex])
                    }
                })
                return (
                    <div className={styles['text-area']}>
                        <div className={styles.title}>{question.title}</div>
                        <div className={styles.count}>{`(${statistic.length}条回复)`}</div>
                        <div className={styles['response-text-area']}>
                            {
                                statistic.map((text, index) => <div key={index} className={styles['response-text']}>{text}</div>)
                            }
                        </div>
                    </div>
                )
            }
            default: break
        }
    }

    render() {
        const { questionnaires, editing } = this.props
        const questionnaire = questionnaires[editing.questionnaireId]
        const data = questionnaire ? questionnaire.data : []

        return (
            <div className={styles['response-content']}>
                <p className={styles['response-number']}>{`（${data.length}条回复）`}</p>
                <Toggle
                  style={{ float: 'right', width: '130px', margin: '10px 20px' }}
                  onToggle={this.handleToggle}
                  label={'停止回复'}
                  trackSwitchedStyle={{ background: '#673ab7a8' }}
                  thumbSwitchedStyle={{ background: '#673ab7' }}
                />
                {editing.stopResponse && <p className={styles.noresponse}>此表单已不接受回复</p>}
                {data.length > 0 &&
                    questionnaire.questions.map((question, index) => (
                        <div key={index}>
                            {this.renderChart(question, index, data)}
                        </div>
                    ))
                }
            </div>
        )
    }
}

const mapStateToProps = state => ({
    editing: state.editing,
    questionnaires: state.list || [],
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators({
        stopResponse: questionnaireActions.stopResponse,
    }, dispatch),
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Response))

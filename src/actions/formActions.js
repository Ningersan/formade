import { addQuestion } from './questionActions'
import * as Types from '../constants/ActionTypes'
import * as utils from '../scripts/utils'

export const stopResponse = id => ({
    type: Types.STOP_RESPONSE,
    payload: {
        id,
    },
})

const addFormAction = id => ({
    type: Types.ADD_FORM,
    payload: {
        id,
    },
})

export const addForm = () => (dispatch) => {
    dispatch(addFormAction(utils.guid()))

    // init default questions
    dispatch(addQuestion(utils.guid(), 'radio'))
    dispatch(addQuestion(utils.guid(), 'radio'))
}

const saveFormAction = (editing, formId) => ({
    type: Types.SAVE_FORM,
    payload: {
        editing,
        formId,
    },
})

export const saveForm = () => (dispatch, getState) => {
    const {
        editing,
        editing: { form: formId },
    } = getState()

    dispatch(saveFormAction(editing, formId))
}

export const renameForm = (id, name) => ({
    type: Types.RENAME_FORM,
    payload: {
        id,
        name,
    },
})

const editFormAction = (id, editing) => ({
    type: Types.EDIT_FORM,
    payload: {
        id,
        editing,
    },
})

export const editForm = id => (dispatch, getState) => {
    const { forms: { byId } } = getState()
    const editing = byId[id]
    dispatch(editFormAction(id, editing))
}

export const fillForm = () => ({
    type: Types.FILL_FORM,
})

export const submitForm = () => ({
    type: Types.SUBMIT_FORM,
})

export const removeForm = id => ({
    type: Types.REMOVE_FORM,
    payload: {
        id,
    },
})

export const saveFormTitle = text => ({
    type: Types.SAVE_FORM_TITLE,
    payload: {
        text,
    },
})

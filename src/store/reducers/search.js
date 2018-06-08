import { handleActions } from 'redux-actions'
import * as types from '../types'

const initialState = {
    hots: [],
    histories: [],
    keyword: '',
    result: [],
    loading: false
}

export default handleActions({
    [types.INIT_HOT_KEYWORDS](state, action) {
        return {
            ...state,
            hots: action.payload
        }
    }
}, initialState)

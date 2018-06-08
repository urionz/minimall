import { handleActions } from 'redux-actions'
import * as types from '../types'

const initialState = {
    info: {
        address: '',
        alipay: '',
        auths: [{
            open_id: '',
            provider: 0
        }],
        avatar: '',
        balance: '',
        birthday: '',
        city: '',
        gender: 1,
        id: 0,
        invitations: 0,
        level: {
            level: 1,
            name: '',
            rate: 0
        },
        nickname: '',
        realname: '',
        shop_id: 0,
        shops: [{
            id: 0,
            type: 1,
            name: ''
        }],
        status: 0,
        type: 0
    },
    token: '',
    loading: false
}

export default handleActions({
    [types.INIT_USER](state, action) {
        return {
            ...state,
            info: action.payload.info,
            token: action.payload.token
        }
    }
}, initialState)

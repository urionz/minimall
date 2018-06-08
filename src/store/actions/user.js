import { createAction } from 'redux-actions'
import { getStore } from 'wepy-redux'
import {
    INIT_USER
} from '../types/user'
import {
    login,
    getUserInfo
} from '../../api'
import wepy from 'wepy'

const store = getStore()


export const loginAction = createAction(INIT_USER, async() => {
    const state = store.getState().user
    const loginRes = await wepy.login()
    if (loginRes.code) {
        const tokenRes = await login({
            provider: 4,
            open_id: loginRes.code,
            access_token: state.token
        })
        const infoRes = await getUserInfo(tokenRes.data.token)
        return {
            info: infoRes.data,
            token: tokenRes.data.token
        }
    }
})

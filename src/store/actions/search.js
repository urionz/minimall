import { createAction } from 'redux-actions'
import { getStore } from 'wepy-redux'
import {
    INIT_HOT_KEYWORDS
} from '../types/search'
import {
    searchRank
} from '../../api'

const store = getStore()

export const hotsList = createAction(INIT_HOT_KEYWORDS, async() => {
    const list = await searchRank()
    return list.data
})

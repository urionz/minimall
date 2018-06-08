import { handleActions } from 'redux-actions'
import findIndex from 'lodash.findindex'
import * as types from '../types'

const initialState = {
    categories: [{
        sections: [{
            feeds: [],
            style: {
                layout: 0
            }
        }]
    }],
    category_index: 0,
    sort: {
        activeIndex: 0,
        items: [
            {
                type: 'index',
                name: '综合',
                desc: true,
                class: 'cat'
            },
            {
                type: 'coupon_price',
                name: '超优惠',
                desc: false,
                class: 'dog'
            },
            {
                type: 'net_price',
                name: '券后价',
                desc: true,
                class: 'dog'
            },
            {
                type: 'sold_quantity',
                name: '销量',
                desc: false,
                class: 'cat'
            }
        ]
    }
}

export default handleActions({
    [types.INIT_VIDEO_PAGE](state, action) {
        return {
            ...state,
            categories: action.payload
        }
    },
    [types.VIDEO_CATEGORY_SECTION_FEED](state, action) {
        // get current category index section feed from the page categories
        const cateIndex = findIndex(state.categories, {
            id: action.payload.id
        })
        state.categories[cateIndex] = action.payload
        return {
            ...state,
            categories: state.categories
        }
    },
    [types.VIDEO_CATEGORY_APPEND_FEED](state, action) {
        const feeds = state.categories[state.category_index].sections[action.payload.section_index].feeds
        feeds.push.apply(feeds, action.payload.data)
        return {
            ...state,
            categories: state.categories
        }
    },
}, initialState)

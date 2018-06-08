import { handleActions } from 'redux-actions'
import findIndex from 'lodash.findindex'
import * as types from '../types'

const initialState = {
    loading: false,
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
    [types.INIT_CATEGORIES](state, action) {
        return {
            ...state,
            categories: action.payload
        }
    },
    [types.HOME_CATEGORY_SECTION_FEED](state, action) {
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
    [types.HOME_CATEGORY_APPEND_FEED](state, action) {
        const feeds = state.categories[state.category_index].sections[action.payload.section_index].feeds
        feeds.push.apply(feeds, action.payload.data)
        return {
            ...state,
            categories: state.categories
        }
    },
    [types.SWITCH_CATEGORY](state, action) {
        state.categories[action.payload.category_index] = action.payload.cate_info
        return {
            ...state,
            category_index: action.payload.category_index,
            categories: state.categories
        }
    },
    [types.SORT](state, action) {
        return {
            ...state,
            sort: action.payload
        }
    },
    [types.SWITCH_LOADING](state, action) {
        return {
            ...state,
            loading: action.payload
        }
    }
}, initialState)

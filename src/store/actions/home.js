import { createAction } from 'redux-actions'
import { getStore } from 'wepy-redux'
import {
    INIT_CATEGORIES,
    HOME_CATEGORY_SECTION_FEED,
    HOME_CATEGORY_APPEND_FEED,
    SWITCH_CATEGORY,
    SWITCH_LOADING
} from '../types/home'
import {
    getPageConfig,
    page,
    sectionFeed
} from '../../api'

const store = getStore()

export const homePage = createAction(INIT_CATEGORIES, async() => {
    store.dispatch({
        type: SWITCH_LOADING,
        payload: true
    })
    const state = store.getState().home
    const config = await getPageConfig('home')
    const pageCategories = await page(config.id)
    store.dispatch({
        type: SWITCH_LOADING,
        payload: false
    })
    return pageCategories.data.pages
})

export const switchCategory = createAction(SWITCH_CATEGORY, async category_index => {
    const state = store.getState().home
    if (!state.categories[category_index].sections) {
        const cateInfo = await page(state.categories[category_index].id)
        return {
            category_index,
            cate_info: cateInfo.data
        }
    }
    return {
        category_index,
        cate_info: state.categories[category_index]
    }
})

export const homeCategorySectionFeed = createAction(HOME_CATEGORY_SECTION_FEED, async() => {
    const state = store.getState().home
    const cateInfo = await page(state.categories[state.category_index].id)
    console.log(cateInfo)
    return cateInfo.data
})

export const homeCategoryAppendFeed = createAction(HOME_CATEGORY_APPEND_FEED, async() => {
    const state = store.getState().home
    const section = state.categories[state.category_index].sections[state.categories[state.category_index].sections.length - 1]
    const lastId = section.feeds[section.feeds.length - 1].id
    const feed = await sectionFeed(lastId, section.id)
    return {
        data: feed.data,
        section_index: state.categories[state.category_index].sections.length - 1
    }
})

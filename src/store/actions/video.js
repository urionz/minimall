import { createAction } from 'redux-actions'
import { getStore } from 'wepy-redux'
import {
    INIT_VIDEO_PAGE,
    VIDEO_CATEGORY_SECTION_FEED,
    VIDEO_CATEGORY_APPEND_FEED
} from '../types/video'
import {
    getPageConfig,
    page,
    sectionFeed
} from '../../api'

const store = getStore()


export const videoPage = createAction(INIT_VIDEO_PAGE, async() => {
    const config = await getPageConfig('video')
    const pageInfo = await page(config.id)
    return pageInfo.data.pages
})

export const videoCategorySectionFeed = createAction(VIDEO_CATEGORY_SECTION_FEED, async() => {
    const state = store.getState().video
    const cateInfo = await page(state.categories[state.category_index].id)
    console.log('video.....', cateInfo)
    return cateInfo.data
})

export const videoCategoryAppendFeed = createAction(VIDEO_CATEGORY_APPEND_FEED, async() => {
    const state = store.getState().video
    const section = state.categories[state.category_index].sections[state.categories[state.category_index].sections.length - 1]
    const lastId = section.feeds[section.feeds.length - 1].id
    const feed = await sectionFeed(lastId, section.id)
    return {
        data: feed.data,
        section_index: state.categories[state.category_index].sections.length - 1
    }
})

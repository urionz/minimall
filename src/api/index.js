import http from 'wx-http-axios'
import tips from '../utils/tips'
import {
    generatorUUID,
    generatorSignature
} from '../utils/utils'
import find from 'lodash.find'
import isEmpty from 'lodash.isempty'
import wepy from 'wepy'

export const baseURL = `HTTP_SCHEMA://API_HOST/cms/API_VERSION`
const appKey = 'APP_KEY'
export const appVersion = 'APP_VERSION'
const superSearchURL = 'https://pub.alimama.com/items/search.json?'
const imagesURL = 'https://hws.m.taobao.com/cache/mtop.wdetail.getItemDescx/4.1/'

// get runtime config by config key
export const getConfig = key => {
    return wepy.$instance.globalData.auth[key]
}

// judge runtime config is defined or not
export const hasConfig = key => {
    const value = getConfig(key)
    return value != null && value != ''
}

// remove runtime config
export const removeConfig = async key => {
    console.info(`[auth] clear auth config [${key}]`)
    wepy.$instance.globalData.auth[key] = null
    await wepy.removeStorage({key: key})
}

// set runtime config
export const setConfig = async (key, value) => {
    await wepy.setStorage({key: key, data: value})
    wepy.$instance.globalData.auth[key] = value
}

export const getPageConfig = async alias => {
    const configure = await getConfig('configure')
    return find(configure.pages, {
        alias
    })
}

export const emptyReq = http.create()

emptyReq.interceptors.request.use(config => {
    return config
}, () => {
    // tips.loading()
})

emptyReq.interceptors.response.use(config => {
    return config
}, error => {
    console.info('[empty request error]', error)
    tips.modal('网络错误')
}, response => {
    // tips.loaded()
    if (response.statusCode != 200) {
        return Promise.reject(response)
    }
    return response.data
})

const cms = http.create({
    baseURL,
    data: {
        'app_key': appKey,
        'app_version': appVersion,
        'os_type': 4
    }
})

cms.interceptors.request.use(config => {
    config.data.timestamp = Date.parse(new Date()) / 1000
    return config
}, request => {
    let device_id = getConfig('device_id')
    const configure = getConfig('configure')
    if (isEmpty(device_id)) {
        device_id = generatorUUID()
        setConfig('device_id', device_id)
    }
    request.configure.data = Object.assign(request.configure.data, {
        device_id
    })
    if (!isEmpty(configure)) {
        request.configure.data = Object.assign(request.configure.data, {
            device_id,
            shop_id: configure.general.shop_id,
            installation_id: configure.general.installation_id
        })
    }
    // tips.loading()
}, params => {
    // make signature
    params.data.sign = generatorSignature(params.data)
    return params
})

cms.interceptors.response.use(config => {
    return config
}, error => {
    console.info('[cms response error]', error)
    tips.modal('网络错误')
}, response => {
    // tips.loaded()
    if (response.statusCode != 200) {
        console.warn(`[cms response interceptor error:]`, response)
        return Promise.reject(response)
    }
    return response.data
})

// any request
export const request = async (method, url, data) => {
    return emptyReq.request(method, url, data)
}

// get runtime configure
export const initConfigure = async () => {
    try {
        return await cms.post('/config')
    } catch (e) {
        console.warn(`[initConfigure fail]`, e)
    }
}

// get page
export const page = async id => {
    try {
        return await cms.get('/page', {
            id
        })
    } catch (e) {
        console.warn('[get page fail]', e)
    }
}

// get the authenticated user info
export const userInfo = async () => {
    return cms.get('/user/info')
}

// generator the product taobao word
export const generatorWord = async (
    platform,
    type = 1,
    source_id,
    seller_id,
    coupon_id,
    title,
    thumb,
    price
) => {
    return cms.get('/coupon', {
        platform,
        type,
        source_id,
        seller_id,
        coupon_id,
        title,
        thumb,
        price
    })
}

// get search result by keyword
export const search = async (keyword, page = 1, order = 'index', desc = true) => {
    return cms.get('/coupon/search', {
        title: keyword,
        page,
        type: 1,
        content_type: 1,
        order,
        sort: desc ? 'desc' : 'asc'
    })
}

// export const search = async (key)

export const superSearch = async (keyword, page = 1) => {
    return emptyReq.get(superSearchURL, {
        q: keyword,
        dpyhq: 1,
        toPage: page,
        perPageSize: 20,
        shopTag: 'yxjh,dpyhq',
        startTkRate: wepy.$instance.globalData.general.rate_threshold
    })
}

// get the product info by product id
export const productInfo = async id => {
    return cms.get('/product', {
        id
    })
}

// get the product images group
export const productImagesGroup = async source_id => {
    try {
        return await emptyReq.request('get', imagesURL, {
            data: {
                item_num_id: source_id
            },
            type: 'json'
        })
    } catch (e) {
        console.warn('[get product images group error]', e)
    }
}

// get the section feed
export const sectionFeed = async (last_id, section_id, order = 'index', desc = true, limit = 20) => {
    try {
        return await cms.get('/section/feed', {
            last_id,
            section_id,
            limit,
            order,
            sort: desc ? 'desc' : 'asc'
        })
    } catch (e) {
        console.warn('[get this section feed fail]', e)
    }
}

// get the search keyword rank list
export const searchRank = async () => {
    try {
        return cms.get('/topsearch/list')
    } catch (e) {
        console.warn('[get this search rank fail]', e)
    }
}

export const newShop = async data => {
    return cms.post('/merchant/shop/new', data)
}

export const bindUser = async data => {
    return cms.post('/user/bind', data)
}

export const login = async data => {
    return cms.post('/user/login', data)
}

export const getUserInfo = async token => {
    try {
        return await cms.get('/user/info', {}, {
            'Authorization': token
        })
    } catch (e) {
        console.warn('[get user info error]', e)
    }
}

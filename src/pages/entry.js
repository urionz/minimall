import wepy from 'wepy'
import isEmpty from 'lodash.isempty'
import { initConfigure, setConfig, getConfig } from '../api'
import { getStore, connect } from 'wepy-redux'
const store = getStore()

export default class extends wepy.page {
    constructor() {
        super()
        // assign the wepy object to global page instance
        this.wepy = wepy
    }
    async onLoad() {
        // get the runtime init configure
        let configure = await getConfig('configure')
        // the runtime configure is empty then fetch the configure
        if (isEmpty(configure)) {
            console.info('[entry runtime not configure start init configure]')
            const res = await initConfigure()
            configure = res.data
            console.info('[init configure result]', configure)
        }
        console.info('[entry start set runtime configure]')
        // set runtime configure
        await setConfig('configure', configure)
        console.info('[entry set runtime configure finish. runtime configure result]', await getConfig('configure'))
    }
    onShareAppMessage(el) {
        if (el.from == 'button') {
            const item = this.categories[this.category_index].sections[this.sections.length - 1].feeds[el.target.dataset.index]
            return {
                title: `${item.title}-优惠券过期时间截止到：${item.expired_at}`,
                path: `/pages/details/details?id=${item.content_id}&shop_id=${this.config.general.shop_id}&item=${JSON.stringify(item)}`,
                imageUrl: item.thumb_x
            }
        } else {
            return {
                title: `人人惠店`,
                path: `/pages/index/index?id=${this.config.general.shop_id}`
            }
        }
        console.log('onShareAppMessage', el, this.$wxpage.route)
    }
}

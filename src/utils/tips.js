export default class tips {
    static isLoading = false
    static pause = false

    static success(title, duration = 500) {
        wx.showToast({
            title: title,
            icon: 'success',
            mask: true,
            duration: duration
        })
        if (duration > 0) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve()
                }, duration)
            })
        }
    }

    static modal(text, title = '提示') {
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: title,
                content: text,
                showCancel: false,
                success: res => {
                    resolve(res)
                },
                fail: res => {
                    reject(res)
                }
            })
        })
    }

    static confirm(text, payload = {}, title = '提示') {
        return new Promise((resolve, reject) => {
            wx.showModal({
                title: title,
                content: text,
                showCancel: true,
                success: res => {
                    if (res.confirm) {
                        resolve(payload)
                    } else if (res.cancel) {
                        reject(payload)
                    }
                },
                fail: res => {
                    reject(payload)
                }
            })
        })
    }

    static toast(title, onHide, icon = 'success') {
        wx.showToast({
            title: title,
            icon: icon,
            mask: true,
            duration: 500
        })
        // the hide callback
        if (onHide) {
            setTimeout(() => {
                onHide()
            }, 500)
        }
    }

    static alert(title) {
        wx.showToast({
            title: title,
            image: '/images/icons/alert.png',
            mask: true,
            duration: 500
        })
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve()
            }, 500)
        })
    }

    static error(title, onHide) {
        wx.showToast({
            title: title,
            image: '/images/icons/error.png',
            mask: true,
            duration: 500
        })
        // the hide callback
        if (onHide) {
            setTimeout(() => {
                onHide()
            }, 500)
        }
    }

    static loading(title = '加载中') {
        if (this.isLoading) {
            return
        }
        this.isLoading = true
        if (wx.showLoading) {
            wx.showLoading({
                title: title,
                mask: true
            })
        } else {
            wx.showNavigationBarLoading()
        }
    }

    static loaded() {
        if (this.isLoading) {
            this.isLoading = false
            if (wx.hideLoading) {
                wx.hideLoading()
            } else {
                wx.hideNavigationBarLoading()
            }
        }
    }

    static action(...items) {
        return new Promise((resolve, reject) => {
            wx.showActionSheet({
                itemList: items,
                success: function(res) {
                    const result = {
                        index: res.tapIndex,
                        text: items[res.tapIndex]
                    }
                    resolve(result)
                },
                fail: function(res) {
                    reject(res.errMsg)
                }
            })
        })
    }

    static actionWithFunc(items, ...functions) {
        wx.showActionSheet({
            itemList: items,
            success: function(res) {
                const index = res.tapIndex
                if (index >= 0 && index < functions.length) {
                    functions[index]()
                }
            }
        })
    }

    static share(title, url, desc) {
        return {
            title: title,
            path: url,
            desc: desc,
            success: function(res) {
                tips.toast('分享成功')
            }
        }
    }

    static setLoading() {
        this.isLoading = true
    }
}

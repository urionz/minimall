import isArray from 'lodash.isarray'
import md5 from 'crypto-js/md5'
import HmacSHA1 from 'crypto-js/hmac-sha1'

// generator the UUID
export const generatorUUID = () => {
    const s = []
    const hexDigits = '0123456789abcdef'
    for (let i = 0; i < 36; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
    }
    s[14], s[19], s[8] = '4', hexDigits.substr((s[19] & 0x3) | 0x8, 1), s[13] = s[18] = s[23] = '-'
    return s.join('')
}

export const generatorSignature = params => {
    let source = []
    const sortKey = Object.keys(params).sort()
    sortKey.forEach(key => {
        let value = params[key]
        if (isArray(value)) {
            value.sort()
            value.forEach(v => {
                source.push(`${key}=${v}`)
            })
        } else {
            source.push(`${key}=${value}`)
        }
    })
    console.info('[sign source]', source)
    const secret = md5(`${params.timestamp}`).toString()
    console.info('[sign secret]', secret, params.timestamp)
    return HmacSHA1(source.join('&'), secret).toString().toUpperCase()
}

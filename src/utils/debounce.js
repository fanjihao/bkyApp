// 防止快速重复点击（防抖）

let timeout = null
const debounce = (cb, wait = 500) => {
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(() => {
        timeout = null
        cb && cb()
    }, wait)
}

export default debounce
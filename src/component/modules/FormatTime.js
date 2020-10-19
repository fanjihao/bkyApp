
const formatTime = (time) => {
    let newMonth, newDay, newMin, newSec, newHours
    let date = new Date(time * 1000)
    let year = date.getFullYear()
    let month = date.getMonth() + 1;
    if (month < 10) {
        newMonth = '0' + month
    } else { newMonth = month }
    let day = date.getDate();
    if (day < 10) {
        newDay = '0' + day
    } else { newDay = day }
    let hours = date.getHours();
    if (hours < 10) {
        newHours = '0' + hours
    } else { newHours = hours }
    let minutes = date.getMinutes();
    if (minutes < 10) {
        newMin = '0' + minutes
    } else { newMin = minutes }
    let seconds = date.getSeconds();
    if (seconds < 10) {
        newSec = '0' + seconds
    } else { newSec = seconds }
    return year + '年' + newMonth + '月' + newDay + '日' + newHours + ':' + newMin + ':' + newSec
}

export default formatTime
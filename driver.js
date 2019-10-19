import chrono from 'chrono-node'

const dateText = 'From 1PM tomorrow to 14:00 tomorrow'
var parsedDate = chrono.parse(dateText, new Date(), { 'IST': 330 })

console.log(parsedDate[0].text)
console.log(roundMinutes(parsedDate[0].start.date()))
console.log(roundMinutes(parsedDate[0].end.date()))

function roundMinutes(date) {
    return date.getMinutes() >= 29 ? date.getHours() + 1 : date.getHours();
}
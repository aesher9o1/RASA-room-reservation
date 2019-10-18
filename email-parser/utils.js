import wordsToNumbers from 'words-to-numbers'
import { isNullOrUndefined } from 'util'
const { CANCEL_ROOM_COMMAND, BOOK_ROOM_COMMAND } = require('./model')

const BOOK = "BOOK"
const CANCEL = "CANCEL"

function containsKeyword(subject, MODE) {
    if (MODE === BOOK)
        subject.forEach(ele => {
            if (BOOK_ROOM_COMMAND[ele.toLowerCase()])
                return true
        })
    else if (MODE === CANCEL)
        subject.forEach(ele => {
            if (CANCEL_ROOM_COMMAND[ele.toLowerCase()])
                return true
        })
}

function parseNumber(subjectWithoutStopWords) {
    var roomNumber = -1
    subjectWithoutStopWords.forEach(ele => {
        var parsedNumber = Number.parseInt(wordsToNumbers(ele))
        if (!isNullOrUndefined(parsedNumber))
            roomNumber = parsedNumber
    })

    return roomNumber
}





module.exports = {
    containsKeyword,
    BOOK,
    CANCEL,
    parseNumber
}
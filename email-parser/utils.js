import wordsToNumbers from 'words-to-numbers'
import { isNullOrUndefined } from 'util'
const { CANCEL_ROOM_COMMAND, BOOK_ROOM_COMMAND, ERRORS, USER_ACTIONS } = require('./model')

const BOOK = "BOOK"
const CANCEL = "CANCEL"

/**
 * Checks if the subject array has keywords defined in the model
 * @param {Array} subjectWithoutStopWords 
 * @param {String} MODE 
 */

function containsKeyword(subjectWithoutStopWords, MODE) {
    if (MODE === BOOK)
        subjectWithoutStopWords.forEach(ele => {
            if (BOOK_ROOM_COMMAND[ele.toLowerCase()])
                return true
        })
    else if (MODE === CANCEL)
        subjectWithoutStopWords.forEach(ele => {
            if (CANCEL_ROOM_COMMAND[ele.toLowerCase()])
                return true
        })
}

/**
 * Looks for room number
 * @param {Array} subjectWithoutStopWords 
 */
function parseNumber(subjectWithoutStopWords) {
    var roomNumber = -1
    subjectWithoutStopWords.forEach(ele => {
        var parsedNumber = Number.parseInt(wordsToNumbers(ele))
        if (!isNullOrUndefined(parsedNumber))
            roomNumber = parsedNumber
    })

    return roomNumber
}

/**
 * Rounds to nearest hour
 * @param {Date} date 
 */

function roundHours(date) {
    return date.getMinutes() >= 29 ? date.getHours() + 1 : date.getHours();
}


function errorCheck(userAction, roomNumber, duration) {
    var differenceInDays = (new Date(duration["startEpoch"]).getTime() - new Date().getTime()) / (1000 * 3600 * 24)

    if (userAction["OPERATION"] == USER_ACTIONS.INVALID)
        return ERRORS.NO_ACTION_IN_SUBJECT
    else if (isNullOrUndefined(roomNumber))
        return ERRORS.NO_ROOM_IN_SUBJECT
    else if (isNullOrUndefined(duration["startTime"]) || isNullOrUndefined(duration["endTime"]) || isNullOrUndefined(duration["startEpoch"]) || isNullOrUndefined(duration["endEpoch"]))
        return ERRORS.NOT_VALID_TIME
    else if (duration["startTime"] > duration["endTime"])
        return ERRORS.NOT_VALID_TIME
    else if (differenceInDays > 7)
        return ERRORS.OUT_OF_BOUND
    else
        return ERRORS.NONE
}

module.exports = {
    containsKeyword,
    BOOK,
    CANCEL,
    parseNumber,
    roundHours,
    errorCheck
}
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
    var result = false;

    if (MODE === BOOK)
        subjectWithoutStopWords.forEach(ele => {
            result = (BOOK_ROOM_COMMAND[ele.toLowerCase()]) || result
        })
    else if (MODE === CANCEL)
        subjectWithoutStopWords.forEach(ele => {
            result = (CANCEL_ROOM_COMMAND[ele.toLowerCase()]) || result
        })
    return result
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
    var differenceInHours = Math.abs(new Date(duration["startEpoch"]) - new Date(duration["endEpoch"])) / 36e5; //36e5 is the scientific notation for 60*60*1000, dividing by which converts the milliseconds difference into hours.


    if (userAction["OPERATION"] == USER_ACTIONS.INVALID)
        return ERRORS.NO_ACTION_IN_SUBJECT
    else if (isNullOrUndefined(roomNumber))
        return ERRORS.NO_ROOM_IN_SUBJECT
    else if (isNullOrUndefined(duration["startTime"]) || isNullOrUndefined(duration["endTime"]) || isNullOrUndefined(duration["startEpoch"]) || isNullOrUndefined(duration["endEpoch"]))
        return ERRORS.NOT_VALID_TIME
    else if ((new Date(duration["startEpoch"]).getTime() - new Date(duration["endEpoch"]).getTime()) > 0)
        return ERRORS.NOT_VALID_TIME
    else if (differenceInHours > 4)
        return ERRORS.MAXIMUM_TIME
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
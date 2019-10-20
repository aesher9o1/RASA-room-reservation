import { NLU_SERVER_URL } from '../environment/env.prod'
import axios from 'axios'
import { containsKeyword, BOOK, CANCEL, parseNumber } from './utils'
import chrono from 'chrono-node'
import { isNullOrUndefined } from 'util'

const sw = require('stopword')
const { USER_ACTIONS, ERRORS } = require('./model')

export default class EmailParser {

    onEmailReceived(emailObj) {
        const subject = emailObj["subject"]
        const from = emailObj["from"]["address"]
        const cc = emailObj["cc"].map(ele => {
            return ele["address"]
        })
        const body = emailObj["text"]
        const that = this

        var userAction, roomNumber, duration, error;

        return new Promise(function (resolve, reject) {
            that.emitUserAction(subject).then(res => {
                userAction = res
                roomNumber = that.emitRoomNumber(subject)
                duration = that.emitDuration(body)

                var error = that.errorCheck(userAction, roomNumber, duration)

                if (error != ERRORS.NONE) {
                    reject(error)
                    return
                }
                else {
                    resolve({
                        userAction: userAction["OPERATION"],
                        rasaEntry: userAction["entry"],
                        roomNumber: roomNumber,
                        startHour: duration["startTime"],
                        endHour: duration["endTime"],
                        startAt: duration["startEpoch"],
                        endAt: duration["endEpoch"],
                        phrase: duration["text"],
                        participants: [...cc, from],
                        requestedBy: from
                    })
                }
            })
        })
    }

    errorCheck(userAction, roomNumber, duration) {
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
    /**
     * @param {String} subject 
     * Removes stop words from the string, itterate over known words to look for signs 
     * if the user want to book room or cancel room, if it fails the text goes to RASA for 
     * further data collection
     * SO NLP IS JUST A FALLBACK HERE
     */

    emitUserAction(subject) {
        subject = sw.removeStopwords(subject.split(' '))

        return new Promise(function (resolve, reject) {


            if (containsKeyword(subject, BOOK)) {
                resolve({ "OPERATION": USER_ACTIONS.CREATE })
                return
            }
            else if (containsKeyword(subject, CANCEL)) {
                resolve({ "OPERATION": USER_ACTIONS.CANCEL })
                return
            }

            else
                axios.post(NLU_SERVER_URL, { "text": subject }).then(result => {
                    if (result.status == 200) {
                        resolve({
                            "OPERATION": (result.data.intent.confidence > 0.70) ? result.data.intent.name : USER_ACTIONS.INVALID,
                            "entry": result.data.entities[0] || null
                        })
                    } else
                        reject(result.status)
                })
        })
    }


    emitRoomNumber(subject) {
        subject = sw.removeStopwords(subject.split(' '))
        return parseNumber(subject)
    }

    emitDuration(body) {
        var parsedDate = chrono.parse(body, new Date(), { 'IST': 330 })

        var startTime, endTime;
        if (parsedDate[0].start)
            startTime = parsedDate[0].start.date()
        if (parsedDate[0].end)
            endTime = parsedDate[0].end.date()

        return {
            text: parsedDate[0].text,
            startTime: startTime ? this.roundHours(new Date(startTime)) : null,
            endTime: endTime ? this.roundHours(new Date(endTime)) : null,
            startEpoch: startTime ? new Date(startTime) : null,
            endEpoch: endTime ? new Date(endTime) : null
        }
    }

    roundHours(date) {
        return date.getMinutes() >= 29 ? date.getHours() + 1 : date.getHours();
    }

}
import { isNullOrUndefined } from 'util';
import { NLU_SERVER_URL } from '../environment/env.prod'
import axios from 'axios'
import { containsKeyword, BOOK, CANCEL, parseNumber } from './utils'

const sw = require('stopword')
const { USER_ACTIONS } = require('./model')

export default class EmailParser {

    onEmailReceived(emailObj) {

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

}
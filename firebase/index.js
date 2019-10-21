var admin = require("firebase-admin");
var serviceAccount = require("../environment/serviceAccountKey.json");

import { FIREBASE_COMPANY_REF } from '../environment/env.prod'
import { ERRORS } from '../email-parser/model'
import { isNullOrUndefined } from 'util';
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://placement-portalmuj.firebaseio.com"
});


export default class AttemptBooking {

    attemptBooking(parsedEmailObject) {
        const that = this;
        const ROOM_NUMBER_EXIST_REF = `${FIREBASE_COMPANY_REF}/rooms/${parsedEmailObject['roomNumber']}`
        const IS_SAME_DATE_QUERY = new Date(parsedEmailObject["startAt"]).getDate() === new Date(parsedEmailObject["endAt"]).getDate()
        const TRANSACTION_ID = new Date().getTime().toString()
        const ROOM_BOOKING_REFERENCES = `${FIREBASE_COMPANY_REF}/booking/${parsedEmailObject['roomNumber']}/${this.generateDayEpoch(parsedEmailObject['startAt'])}/time`
        const ROOM_LEDGER_REFERENCE = `${FIREBASE_COMPANY_REF}/booking/${parsedEmailObject['roomNumber']}/${this.generateDayEpoch(parsedEmailObject['startAt'])}/ledger/${TRANSACTION_ID}`


        return new Promise(function (resolve, reject) {

            admin.database().ref(ROOM_NUMBER_EXIST_REF).once('value').then(function (snapshot) {
                //if some booking exists on that day
                if (snapshot.exists()) {
                    if (IS_SAME_DATE_QUERY) {
                        admin.database().ref(ROOM_BOOKING_REFERENCES).once('value').then(function (snapshot) {
                            //if snapshot exists then there are ongoing meeting now
                            if (snapshot.exists()) {
                                if (!that.checkIfMeetingGoingOn(parsedEmailObject["startHour"], parsedEmailObject["endHour"], parsedEmailObject, snapshot)) {
                                    that.bookRoomBetweenIntervals(parsedEmailObject["startHour"], parsedEmailObject["endHour"], parsedEmailObject, TRANSACTION_ID, ROOM_BOOKING_REFERENCES, ROOM_LEDGER_REFERENCE)
                                    resolve("ROOM BOOKED")

                                } else
                                    reject(ERRORS.MEETING_GOING_ON)
                                return
                            }
                            else {
                                that.bookRoomBetweenIntervals(parsedEmailObject["startHour"], parsedEmailObject["endHour"], parsedEmailObject, TRANSACTION_ID, ROOM_BOOKING_REFERENCES, ROOM_LEDGER_REFERENCE)
                                resolve("ROOM BOOKED")
                                return
                            }
                        })

                    }
                    else {

                        //different date
                    }
                }
                else {
                    reject(ERRORS.INVALID_ROOM)
                    return
                }
            })
        })
    }

    //stub what to do if =0?
    checkIfMeetingGoingOn(START, END, parsedEmailObject, snapshot) {
        if (isNullOrUndefined(snapshot.val()))
            return false

        for (let i = START; i <= END; i++)
            if (!isNullOrUndefined((snapshot.val())[`${i}`]))
                return (new Date(parsedEmailObject["startAt"]).getTime() - new Date((snapshot.val())[`${i}`]["endAt"]).getTime() <= 0)

        return false
    }

    bookRoomBetweenIntervals(START, END, parsedEmailObject, TRANSACTION_ID, ROOM_BOOKING_REFERENCES, ROOM_LEDGER_REFERENCE) {
        var dataToPush = new Object();

        for (let i = START; i <= END; i++)
            dataToPush[i] = {
                ref: TRANSACTION_ID,
                startAt: parsedEmailObject["startAt"],
                endAt: parsedEmailObject["endAt"]
            }

        admin.database().ref(ROOM_BOOKING_REFERENCES).update(dataToPush)
        admin.database().ref(ROOM_LEDGER_REFERENCE).set(parsedEmailObject)
    }

    generateDayEpoch(date) {
        date = new Date(date)
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    }

}
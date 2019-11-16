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
        const ROOM_BOOKING_REFERENCES_END = `${FIREBASE_COMPANY_REF}/booking/${parsedEmailObject['roomNumber']}/${this.generateDayEpoch(parsedEmailObject['endAt'])}/time`
        const ROOM_LEDGER_REFERENCE = `${FIREBASE_COMPANY_REF}/booking/ledger/${TRANSACTION_ID}`


        return new Promise(function (resolve, reject) {

            admin.database().ref(ROOM_NUMBER_EXIST_REF).once('value').then(function (snapshot) {
                //if some booking exists on that day
                if (snapshot.exists()) {
                    if (IS_SAME_DATE_QUERY) {
                        admin.database().ref(ROOM_BOOKING_REFERENCES).once('value').then(function (snapshot) {
                            //if snapshot exists then there are ongoing meeting now or a booking made on that day
                            if (snapshot.exists() && snapshot.val()[parsedEmailObject["startHour"]]) {
                                admin.database().ref(`${FIREBASE_COMPANY_REF}/booking/ledger/${(snapshot.val()[parsedEmailObject["startHour"]]['ref'])}`).once('value').then(function (refSnapshot) {

                                    if (!refSnapshot.exists() || !that.checkIfMeetingGoingOn(parsedEmailObject["startHour"], parsedEmailObject["endHour"], parsedEmailObject, snapshot)) {
                                        that.bookRoomBetweenIntervals(parsedEmailObject["startHour"], parsedEmailObject["endHour"], parsedEmailObject, TRANSACTION_ID, ROOM_BOOKING_REFERENCES, ROOM_LEDGER_REFERENCE)
                                        resolve(TRANSACTION_ID)

                                    } else
                                        reject(ERRORS.MEETING_GOING_ON)
                                    return
                                })
                            }
                            else {
                                that.bookRoomBetweenIntervals(parsedEmailObject["startHour"], parsedEmailObject["endHour"], parsedEmailObject, TRANSACTION_ID, ROOM_BOOKING_REFERENCES, ROOM_LEDGER_REFERENCE)
                                resolve(TRANSACTION_ID)
                                return
                            }
                        })

                    }
                    else {
                        admin.database().ref(ROOM_BOOKING_REFERENCES).once('value').then(function (snapshotDAY1) {
                            //if snapshot exists then there are ongoing meeting now
                            if (snapshotDAY1.exists() && snapshot.val()[parsedEmailObject["startHour"]]) {
                                admin.database().ref(`${FIREBASE_COMPANY_REF}/booking/ledger/${(snapshot.val()[parsedEmailObject["startHour"]]['ref'])}`).once('value').then(function (refSnapshot) {

                                    if (!refSnapshot.exists() || !that.checkIfMeetingGoingOn(parsedEmailObject["startHour"], 24, parsedEmailObject, snapshotDAY1)) {
                                        admin.database().ref(ROOM_BOOKING_REFERENCES_END).once('value').then(function (snapshotDAY2) {
                                            if (snapshotDAY2.exists()) {
                                                if (!refSnapshot.exists() || !that.checkIfMeetingGoingOn(0, parsedEmailObject["endHour"], parsedEmailObject, snapshotDAY2)) {
                                                    that.bookRoomBetweenIntervals(parsedEmailObject["startHour"], 24, parsedEmailObject, TRANSACTION_ID, ROOM_BOOKING_REFERENCES, ROOM_LEDGER_REFERENCE)
                                                    that.bookRoomBetweenIntervals(0, parsedEmailObject["endHour"], parsedEmailObject, TRANSACTION_ID, ROOM_BOOKING_REFERENCES, ROOM_LEDGER_REFERENCE, ROOM_BOOKING_REFERENCES_END)
                                                    resolve(TRANSACTION_ID)
                                                    return
                                                }
                                                else {
                                                    reject(ERRORS.MEETING_GOING_ON)
                                                    return
                                                }
                                            } else {
                                                that.bookRoomBetweenIntervals(parsedEmailObject["startHour"], 24, parsedEmailObject, TRANSACTION_ID, ROOM_BOOKING_REFERENCES, ROOM_LEDGER_REFERENCE)
                                                that.bookRoomBetweenIntervals(0, parsedEmailObject["endHour"], parsedEmailObject, TRANSACTION_ID, ROOM_BOOKING_REFERENCES, ROOM_LEDGER_REFERENCE, ROOM_BOOKING_REFERENCES_END)
                                                resolve(TRANSACTION_ID)
                                                return
                                            }
                                        })
                                        resolve(TRANSACTION_ID)

                                    } else
                                        reject(ERRORS.MEETING_GOING_ON)
                                    return

                                })

                            }
                            else {
                                that.bookRoomBetweenIntervals(parsedEmailObject["startHour"], 24, parsedEmailObject, TRANSACTION_ID, ROOM_BOOKING_REFERENCES, ROOM_LEDGER_REFERENCE)
                                that.bookRoomBetweenIntervals(0, parsedEmailObject["endHour"], parsedEmailObject, TRANSACTION_ID, ROOM_BOOKING_REFERENCES, ROOM_LEDGER_REFERENCE, ROOM_BOOKING_REFERENCES_END)
                                resolve(TRANSACTION_ID)
                                return
                            }
                        })
                    }
                }
                else {
                    reject(ERRORS.INVALID_ROOM)
                    return
                }
            })
        })
    }

    cancelBooking(parsedEmailObject) {
        const ROOM_LEDGER_REFERENCE = `${FIREBASE_COMPANY_REF}/booking/ledger/${parsedEmailObject['referenceNumber']}`
        return new Promise(function (resolve, reject) {
            admin.database().ref(ROOM_LEDGER_REFERENCE).once('value').then(function (snapshot) {
                if (snapshot.exists()) {
                    if ((snapshot.val())["requestedBy"] == parsedEmailObject["requestedBy"]) {
                        admin.database().ref(ROOM_LEDGER_REFERENCE).remove()
                        resolve("DONE")
                    } else reject(ERRORS.UNAUTHORIZED)
                }
                else {
                    reject(ERRORS.INVALID_REFERENCE_NUMBER)
                }
            })
        })

    }



    checkIfMeetingGoingOn(START, END, parsedEmailObject, snapshot) {
        if (isNullOrUndefined(snapshot.val()))
            return false

        for (let i = START; i < END; i++)
            if (!isNullOrUndefined((snapshot.val())[`${i}`]))
                return (new Date(parsedEmailObject["startAt"]).getTime() - new Date((snapshot.val())[`${i}`]["endAt"]).getTime() <= 0)

        return false
    }

    bookRoomBetweenIntervals(START, END, parsedEmailObject, TRANSACTION_ID, ROOM_BOOKING_REFERENCES, ROOM_LEDGER_REFERENCE, ROOM_BOOKING_REFERENCES_END = undefined) {
        var dataToPush = new Object();

        if (END > START)
            for (let i = START; i < END; i++)
                dataToPush[i] = {
                    ref: TRANSACTION_ID,
                    startAt: parsedEmailObject["startAt"],
                    endAt: parsedEmailObject["endAt"]
                }

        admin.database().ref((ROOM_BOOKING_REFERENCES_END) ? ROOM_BOOKING_REFERENCES_END : ROOM_BOOKING_REFERENCES).update(dataToPush)
        admin.database().ref(ROOM_LEDGER_REFERENCE).set(parsedEmailObject)
    }

    generateDayEpoch(date) {
        date = new Date(date)
        return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
    }

}
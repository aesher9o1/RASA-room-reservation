var admin = require("firebase-admin");
var serviceAccount = require("../environment/serviceAccountKey.json");

import { FIREBASE_COMPANY_REF } from '../environment/env.prod'

export default class AttemptBooking {

    constructor(parsedEmailObject) {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount),
            databaseURL: "https://placement-portalmuj.firebaseio.com"
        });

        return new Promise(function (resolve, reject) {
            if (new Date(parsedEmailObject["startAt"]).getDay() === new Date(parsedEmailObject["endAt"])) {
                //same date
                admin.database().ref(`${FIREBASE_COMPANY_REF}/rooms/${parsedEmailObject['roomNumber']}`).once('value', function (snapshot) {
                    if(snapshot.exists()){}
                })
            }
            else {
                //different date
            }
        })


    }
    isSlotFree() {

    }


    reserve() {

    }

}
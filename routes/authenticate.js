'use strict'
import router from 'express'
import firbase from 'firebase'

const COMPANY_REF = "bcone"
const FIREBASE_CONFIG = {
    apiKey: "AIzaSyC_giIAvBlRorTW5uRyj6gxuw2U6p0Qr5A",
    authDomain: "placement-portalmuj.firebaseapp.com",
    databaseURL: "https://placement-portalmuj.firebaseio.com",
    projectId: "placement-portalmuj",
    storageBucket: "placement-portalmuj.appspot.com",
    messagingSenderId: "166993932389",
    appId: "1:166993932389:web:71c6e303d4ee963195568c"
}

const app = firbase.initializeApp(FIREBASE_CONFIG)
let route = router()

route.post('/', async (req, res) => {
    console.log(`looking for booking for room number ${req.body['roomNumber']}`)


    app.database().ref(`${(process.env.COMPANY_REF) ? process.env.COMPANY_REF : COMPANY_REF}/booking/${req.body['roomNumber']}`)
        .child(generateDayEpoch(req.body['mockTime'] ? req.body['mockTime'] : new Date().toString()))
        .child(`time`)
        .child(new Date().getHours()).once('value').then(snapshot => {
            if (snapshot.exists()) {
                app.database().ref(`${(process.env.COMPANY_REF) ? process.env.COMPANY_REF : COMPANY_REF}/booking/ledger`)
                    .child(snapshot.val()['ref']).once('value').then(ledgerSnapshot => {
                        if (ledgerSnapshot.exists()) {
                            if (typeof (ledgerSnapshot.val()['participants'] == 'object')) {
                                let boolFound = false;
                                ledgerSnapshot.val()['participants'].forEach(element => {
                                    if (element == req.body['eid'])
                                        boolFound = true
                                });
                                boolFound ? res.send(ledgerSnapshot) : res.status(400).send("UNAUTHORIZED")
                            } else if (ledgerSnapshot.val()['participants'] == req.body['eid']) {
                                res.send(ledgerSnapshot)
                            }
                        }
                        else
                            res.status(400).send("MEETING CANCELD")

                    })
            }
            else
                res.status(400).send("NO BOOKING TODAY")
        })
})


function generateDayEpoch(date) {
    date = new Date(date)
    console.log(new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime())
    return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime()
}

module.exports = route
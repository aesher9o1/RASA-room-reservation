'use strict'
import router from 'express'
import firbase from 'firebase'
import { FIREBASE_CONFIG, COMPANY_REF } from '../environment/secrets'

const app = firbase.initializeApp(FIREBASE_CONFIG)
let route = router()

route.post('/', async (req, res) => {
    console.log(`looking for booking for room number ${req.body['roomNumber']}`)


    app.database().ref(`${COMPANY_REF}/booking/${req.body['roomNumber']}`)
        .child(generateDayEpoch(req.body['mockTime'] ? req.body['mockTime'] : new Date().toString()))
        .child(`time`)
        .child(new Date().getHours()).once('value').then(snapshot => {
            if (snapshot.exists()) {
                app.database().ref(`${COMPANY_REF}/booking/ledger`)
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
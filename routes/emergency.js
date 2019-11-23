'use strict'
import router from 'express'
import firebase from 'firebase'
import { FIREBASE_CONFIG } from '../environment'

const COMPANY_REF = "bcone"


const app = firebase.initializeApp(FIREBASE_CONFIG, 'emergency')

let route = router()


route.get('/', async (req, res) => {

    app.database().ref(`${COMPANY_REF}/emergency`).push({
        ref: req.query.ref,
        type: req.query.type
    }).then(res.send("REQUESTED"))

})


module.exports = route
'use strict'
import router from 'express'
import nodemailer from 'nodemailer'
import emailTempate from './emailTemplate'
import { GMAIL_CRED } from '../environment'


let route = router()
const smtpTransport = nodemailer.createTransport("smtps://aashis.spam%40gmail.com:" + encodeURIComponent(GMAIL_CRED.password) + "@smtp.gmail.com:465");

route.post('/', async (req, res) => {
    console.log("---EMAIL RECEIVED---")
    console.log(req.body)

    var mailOptions = {
        from: "9o1Mailer <aashis.spam@gmail.com>",
        to: req.body.requestedBy,
        subject: req.body["subject"],
        cc: (typeof req.body.participants == 'string') ? req.body.participants : req.body.participants,
        html: '<p>Client does not support AMP</p>',
        amp: emailTempate(req.body["body"])
    }

    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error)
            res.status(400).send("SERVER ERROR")
        } else {
            res.send({ "message": "DELIVERED" });
        }
    });
})

module.exports = route
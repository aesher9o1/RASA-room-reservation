'use strict'
import router from 'express'
import nodemailer from 'nodemailer'
import { PASSWORD } from '../environment/secrets'
import emailTempate from './emailTemplate'

let route = router()
const smtpTransport = nodemailer.createTransport("smtps://aashis.spam%40gmail.com:" + encodeURIComponent(PASSWORD) + "@smtp.gmail.com:465");

route.post('/', async (req, res) => {
    console.log(req.body)
    var mailOptions = {
        from: "aashis.spam@gmail.com",
        to: req.body.requestedBy.requestedBy,
        subject: req.body["subject"],
        cc: (typeof req.body.participants == 'string') ? req.body.participants : req.body.participants,
        html: emailTempate(req.body["body"])
    }
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            res.error(error)
        } else {
            res.send({ "message": "DELIVERED" });
        }
    });
})

module.exports = route
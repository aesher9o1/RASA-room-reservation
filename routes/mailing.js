'use strict'
import router from 'express'
import nodemailer from 'nodemailer'
import { PASSWORD } from '../environment/secrets'
import xoauth2 from 'xoauth2'
let route = router()
route.post('/', async (req, res) => {
    console.log(PASSWORD)
    var smtpTransport = nodemailer.createTransport("smtps://aashis.spam%40gmail.com:" + encodeURIComponent(PASSWORD) + "@smtp.gmail.com:465");

    var mailOptions = {
        from: "aashis.spam@gmail.com",
        to: "aashiskumar986@gmail.com",
        subject: ' | new message !',
        text: "hey"
    }
    smtpTransport.sendMail(mailOptions, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            res.send("done");
        }
    });
})

module.exports = route
const MailListener = require("mail-listener2");
const { GMAIL_CRED } = require('./environment/env.prod.js')
import EmailParser from './email-parser'
import { EMAIL_MOCK } from './email-parser/model'
import { CLIENT_SERVER_URL } from './environment/env.prod'
import Axios from 'axios'

var mailListener = new MailListener({
  username: GMAIL_CRED.emailID,
  password: GMAIL_CRED.password,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  markSeen: true,
  searchFilter: "UNSEEN",
  fetchUnreadOnStart: false
});

const log = (message, withColor) => {
  if (withColor)
    console.log('\x1b[36m%s\x1b[0m', message)
  else
    console.log(message)
}


mailListener.on("server:connected", () => log("GMail Client Connected", true));
mailListener.on("server:disconnected", () => log('GMail Client Disconencted'));

(function () {
  mailListener.on("mail", function (mail, seqno, attributes) {
    var mailuid = attributes.uid;
    var emailReceived = {
      subject: mail.subject,
      text: mail.text,
      cc: mail.cc || "null",
      from: mail.from[0],
      // eml: mail.eml,
      // headers: mail.headers,
    }


    log("\n\n---------EMAIL RECEIVED------------", true)
    log(emailReceived, false);




    new EmailParser().onEmailReceived(emailReceived).then(res => {
      log("\n\n---------BOOKING EMAIL PARSED------------", true)
      log(res, false)

      //check if all the participants are valid
      Axios.post(CLIENT_SERVER_URL, res["participants"]).then(res => {
        var validParticipants = res.data["message"]

        log("\n\n---------AUTHORIZED PARTICIPANTS------------", true)
        log(validParticipants, false)

      }).catch(error => {
        var invalidParticipants = error.response.data["message"]

        log("\n\n---------UNAUTHORIZED PARTICIPANTS------------", true)
        log(invalidParticipants, false)

      })
    }).catch(res => {
      //could not book for some reason
      log("\n\n---------ERROR BOOKING------------", true)
      log(res, false)
    })





    log('\n\n---------ATTEMPTING TO MARK AS SEEN------------', true);
    mailListener.imap.addFlags(mailuid, '\\Seen', function (err) {
      if (err) {
        console.log('error marking message read/SEEN');
        return;
      }
    });
  });
})();


mailListener.start();

// setTimeout(function () {
//   console.log("stoppping")
//   mailListener.stop();
// }, 60 * 1000);
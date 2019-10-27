const MailListener = require("mail-listener2");
const { GMAIL_CRED } = require('./environment/env.prod.js')
import EmailParser from './email-parser'
import { CLIENT_SERVER_URL } from './environment/env.prod'
import { USER_ACTIONS } from './email-parser/model'
import Axios from 'axios'
import firebase from './firebase'

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



    new EmailParser().onEmailReceived(emailReceived).then(parsedBooking => {
      log("\n\n---------BOOKING EMAIL PARSED------------", true)
      // log(paresedBooking, false)
      var userAction = parsedBooking["userAction"]
      var result = parsedBooking
      delete result['userAction']

      //check if all the participants are valid
      Axios.post(CLIENT_SERVER_URL, parsedBooking["participants"]).then(res => {
        var validParticipants = res.data["message"]

        log("\n\n---------AUTHORIZED PARTICIPANTS------------", true)
        log(validParticipants, false)

        //participants are valid proceed to booking
        bookingWithParsedAction(userAction, result)

      }).catch(error => {
        var invalidParticipants = (error.response) ? error.response.data["message"] : error

        log("\n\n---------UNAUTHORIZED PARTICIPANTS------------", true)
        log(invalidParticipants, false)

      })
    }).catch(res => {
      //could not book for some reason
      log("\n\n---------ERROR BOOKING------------", true)
      log(res, false)
    })



    mailListener.imap.addFlags(mailuid, '\\Seen', function (err) {
      if (err) {
        log('\n\n---------COULD NOT MARK AS SEEN------------', true);
        return;
      }
      else {
        log('\n\n---------MARKED AS SEEN------------', true);
        return
      }
    });
  });
})();

/**
 * The function looks after booking canceling and raising an assitance with the action given
 * @param {string} action -> CREATE CANCEL ASSISTANCE
 * @param {object} parsedResult 
 */
function bookingWithParsedAction(action, parsedResult) {
  if (action == USER_ACTIONS.CREATE) {
    new firebase().attemptBooking(parsedResult).then(res => {
      log(res, false)

    }).catch(res => {
      log(res, false)

    })
  }
  else if (action == USER_ACTIONS.CANCEL) {
    new firebase().cancelBooking(parsedResult).then(res => {
      log(res, false)
    }).catch(error => {
      log(error, false)

    })
  }
}


mailListener.start();



// setTimeout(function () {
//   console.log("stoppping")
//   mailListener.stop();
// }, 60 * 1000);
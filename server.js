const MailListener = require("mail-listener2");
const { GMAIL_CRED } = require('./environment/env.prod.js')

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


mailListener.on("server:connected", function () {
  console.log("imapConnected");
});

mailListener.on("server:disconnected", function () {
  console.log("imapDisconnected");
});

(function () {
  mailListener.on("mail", function (mail, seqno, attributes) {
    var mailuid = attributes.uid;
    
    console.log({
      subject: mail.subject,
      text: mail.text,
      cc: mail.cc || "null",
      from: mail.from[0],
      // eml: mail.eml,
      // headers: mail.headers,
    });

    console.log('attempting to mark msg read/seen');
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
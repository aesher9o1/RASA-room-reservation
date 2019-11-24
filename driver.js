/**
 * WARNING This is just to test drive the code here participants are saved on the database WRT their email ID 
 * on production code the participants are stored with their employee ID here we do not call the employee ID fetching API
 */


import firebase from './firebase'
import { EMAIL_MOCK, USER_ACTIONS } from './email-parser/model'
import EmailParser from './email-parser'
import Axios from 'axios'
import { AUTH_MAIL_SERVER_URL } from './environment/env.prod'



const sendMessageToParticipants = (emailContent) => {
    Axios.post(AUTH_MAIL_SERVER_URL, emailContent).then(res => {
        console.log(res.data["message"])
    }, err => {
        console.log(err)
    })
}




new EmailParser().onEmailReceived(EMAIL_MOCK).then(res => {
    var userAction = res['userAction']
    var result = res
    delete result['userAction']
    console.log(result)
    if (userAction == USER_ACTIONS.CREATE) {
        new firebase().attemptBooking(result).then(res => {
            sendMessageToParticipants({
                body: {
                    email: `Booking for room number <b>${result["roomNumber"]}</b> for <b>${result["startAt"].toUTCString()}</b> upto <b>${result["endAt"].toUTCString()}</b> is confirmed!. <br><br><br><b style="color:#EF5350; font-size:9px">In case you want to cancel the meeting send Cancel room booking with reference ID ${res}</b>`,
                    rid: res
                },
                participants: result["participants"],
                requestedBy: result["requestedBy"],
                subject: `Meeting Scheduled for ${result["startAt"].toUTCString()}`,
                success: true
            })

        }).catch(err => {
            console.log(err)
            sendMessageToParticipants({
                body: {
                    email: `Sorry the booking could not be done due to <b>${err}</b>`,
                    rid: null
                },
                participants: result["requestedBy"],
                requestedBy: result["requestedBy"],
                subject: `An error occured while booking room number ${result["roomNumber"]}`
            })

        })
    }
    else if (userAction == USER_ACTIONS.CANCEL) {
        new firebase().cancelBooking(result).then(res => {
            sendMessageToParticipants({
                body: {
                    email: `Your booking with reference number <b>${result['referenceNumber']}</b> has been cancelled`,
                    rid: null
                },
                participants: res,
                requestedBy: result["requestedBy"],
                subject: `Booking Cancelled`
            })
        }).catch(error => {
            sendMessageToParticipants({
                body: {
                    email: `Sorry the there was some trouble cancelling your booking due to ${error}`,
                    rid: null
                },
                participants: result["requestedBy"],
                requestedBy: result["requestedBy"],
                subject: `An error occured while`
            })
        })
    }


}).catch(err => {
    console.log(err)
})






/**
 * WARNING This is just to test drive the code here participants are saved on the database WRT their email ID 
 * on production code the participants are stored with their employee ID here we do not call the employee ID fetching API
 */


import firebase from './firebase'
import { EMAIL_MOCK, USER_ACTIONS } from './email-parser/model'
import EmailParser from './email-parser'
import Axios from 'axios'
import { AUTH_MAIL_SERVER_URL } from './environment/env.prod'

const constructEmail = (body, status, participants) => {
    switch (status) {
        case "BOOKED":
            break;
        case "UNAUTH":
            break;
        case "ERR":
            break;
        case "CANCEL":
            break;
    }
}

const sendMessageToParticipants = (emailContent) => {
    Axios.post(AUTH_MAIL_SERVER_URL, emailContent).then(res => {
        console.log(res.data["message"])
    }, err => {

    })
}




new EmailParser().onEmailReceived(EMAIL_MOCK).then(res => {
    var userAction = res['userAction']
    var result = res
    delete result['userAction']
    console.log(result)
    if (userAction == USER_ACTIONS.CREATE) {
        new firebase().attemptBooking(result).then(res => {
            console.log(res)
            if (res == "ROOM BOOKED") {
                sendMessageToParticipants(constructEmail(
                    `Congratulation! booking for room number ${result["roomNumber"]} for ${result["startAt"].toUTCString()} upto ${result["endAt"].toUTCString()} is confirmed!.`,
                    "BOOKED",
                    result["participants"]
                ))

            }

        }).catch(res => {
            console.log(res)

        })
    }
    else if (userAction == USER_ACTIONS.CANCEL) {
        new firebase().cancelBooking(result).then(res => {
            console.log(res)
        }).catch(error => {
            console.log(error);
        })
    }


}).catch(err => {
    console.log(err)
})






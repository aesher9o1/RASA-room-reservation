import firebase from './firebase'
import { EMAIL_MOCK, USER_ACTIONS } from './email-parser/model'
import EmailParser from './email-parser'



new EmailParser().onEmailReceived(EMAIL_MOCK).then(res => {
    var userAction = res['userAction']
    var result = res
    delete result['userAction']
    if (userAction == USER_ACTIONS.CREATE) {
        new firebase().attemptBooking(result).then(res => {
            console.log(res)

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






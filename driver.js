import firebase from './firebase'
import { EMAIL_MOCK, USER_ACTIONS } from './email-parser/model'
import EmailParser from './email-parser'



new EmailParser().onEmailReceived(EMAIL_MOCK).then(res => {
    console.log(res)
    var result = res
    delete result['userAction']
    if (res['userAction'] == USER_ACTIONS.CREATE) {
        new firebase().attemptBooking(result).then(res => {
            console.log(res)

        }).catch(res => {
            console.log(res)

        })
    }
    else if (res['userAction'] == USER_ACTIONS.CANCEL) {
        new firebase().cancelBooking(result).then(res => {
            console.log(res)
        }).catch(error => {
            console.error();

        })
    }


}).catch(res => {
    console.log(res)
})






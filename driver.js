import firebase from './firebase'
import { EMAIL_MOCK } from './email-parser/model'
import EmailParser from './email-parser'



new EmailParser().onEmailReceived(EMAIL_MOCK).then(res => {
    new firebase().attemptBooking(res).then(res => {
        console.log(res)

    }).catch(res => {
        console.log(res)

    })
}).catch(res => {
    console.log(res)
})






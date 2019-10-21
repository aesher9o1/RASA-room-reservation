import firebase from './firebase'
import { PARSED_EMAIL_MOCK } from './email-parser/model'



new firebase().attemptBooking(PARSED_EMAIL_MOCK).then(res => {
    console.log(res)
    
}).catch(res => {
    console.log(res)
    return
})




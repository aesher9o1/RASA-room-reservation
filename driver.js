import EmailParser from './email-parser'
import { EMAIL_MOCK } from './email-parser/model'
import { CLIENT_SERVER_URL } from './environment/env.prod'
import Axios from 'axios'

new EmailParser().onEmailReceived(EMAIL_MOCK).then(res => {
    console.log("\n\n---------BOOKING EMAIL PARSED------------")
    console.log(res)

    //check if all the participants are valid
    Axios.post(CLIENT_SERVER_URL, res["participants"]).then(res => {
        var validParticipants = res.data["message"]

        console.log("\n\n---------AUTHORIZED PARTICIPANTS------------")
        console.log(validParticipants)

    }).catch(error => {
        var invalidParticipants = error.response.data["message"]

        console.log("\n\n---------UNAUTHORIZED PARTICIPANTS------------")
        console.log(invalidParticipants)

    })
}).catch(res => {
    //could not book for some reason
    console.log(res)
})



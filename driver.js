import EmailParser from './email-parser'
import { EMAIL_MOCK } from './email-parser/model'

var parser = new EmailParser()
parser.onEmailReceived(EMAIL_MOCK).then(res => {
    console.log(res)
}).catch(res => {
    console.log(res)
})

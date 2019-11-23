import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'


const authenticateRoute = require('./routes/authenticate')
const mailingRoute = require('./routes/mailing')

const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

app.use(cors())

app.get('/', async (req, res) =>
    res.send(`server working at ${process.env.GMAIL_PASSWORD}`)
)


app.use('/auth', authenticateRoute)
app.use('/mail', mailingRoute)

app.listen(process.env.PORT || 2000, (err) => {
    if (err)
        throw err;
    else
        console.log(`App is listening to ${process.env.PORT}`)
});

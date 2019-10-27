# email_server
> The **first of its's kind** room reservation system powered by [RASA NLU](https://rasa.com/docs/rasa/nlu/about/)

![](https://i.imgur.com/6nGk470.png)
<br></br>
**Installation**
1. Create a folder in the **root directory** named **environment** with 2 files
	1. **env.prod.js** 
	2. **serviceAccountKey.json**

2. **npm i**
3. [Install RASA](https://rasa.com/docs/rasa/user-guide/installation/)

#### Content of env.prod.js
```js
	
var GMAIL_CRED = {
    "emailID": GMAIL_ID,
    "password": GMAIL_PASSWORD
}
var NLU_SERVER_URL = "http://localhost:5005/model/parse"
var CLIENT_SERVER_URL = "http://localhost/bristlecone/"
var FIREBASE_COMPANY_REF = "bcone"

module.exports = {
    GMAIL_CRED,
    NLU_SERVER_URL,
    CLIENT_SERVER_URL,
    FIREBASE_COMPANY_REF
}
```
#### Content of serviceAccountKey.json
>Learn how to generate service account credentials [here](https://firebase.google.com/docs/admin/setup)
```json
{
  "type": "service_account",
  "project_id": "PROJECT_ID",
  "private_key_id": "PVT_KEY_ID",
  "private_key": "PVT_KEY",
  "client_email": "CLIENT_EMAIL",
  "client_id": "CLIENT_D",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "CLIENT_x509_cert"
}
```

<br></br>
**Starting servers**
1. Make sure your PHP Server is set up from branch client_server and **CLIENT_SERVER_URL** has the link where the server is hosted
2. **npm start** in root directory to start listening to emails on your gmail. Please clear previous unread emails for optimized performance.
3. cd rasa
4. rasa run --enable-api -m models/nlu-20191018-232513.tar.gz --cors "*" to run rasa server with cors enabled


**Shoutouts**
1. [Mail Listner 2](https://www.npmjs.com/package/mail-listener2)
2. [Chrono Node](https://www.npmjs.com/package/chrono-node)
3. [RASA](https://rasa.com/docs/rasa/user-guide/installation/)

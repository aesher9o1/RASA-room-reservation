# RASA Room Reservation 
> The **first of its's kind** room reservation system powered by [RASA NLU](https://rasa.com/docs/rasa/nlu/about/)


**The project is WIP with just cosmetic changes left** *i'd love to cater to feature requests and pull requests :blush::blush::blush::blush:*

![](https://i.imgur.com/6nGk470.png)

## AIM
> PS: You'll need multiple copies of the repo to run it. Bad decision to have everything on multiple branches? *Let's agree to disagree shall we?*

To build a system that allows access only to the authorized user who has booked the VC room in case someone tries to access it without booking it should raise the alarm. Also if there is any bottleneck faced by the authorized person in the VC room the person should be able to raise the alarm and get the issue resolved. The System also needs to have troubleshooting instructions to resolve the issue.

## Traditional Way
> A normal portal which connects to 2 Databases 1 the room booking database and the other the client's employee database. You can mitigate a server by using just one database though.

![](https://i.imgur.com/bDLkJjP.png)


#### Branches associated with the track

| Branch        | Description          | Status|
| ------------- |:-------------:| :-------------:|
| **node_mcu**      | The IOT code that'll for Node MCU and RFID Module| :warning: Hooking up with APIs|
| **nodemailer**      | Server to send emails *(Can be replaced with 3rd party APIs)*  | :heavy_multiplication_x: Yet to push|
| **frontend**      | Frontend for the react App built using baseweb v9 UI kit   | :warning: Working on user side|
| **client_server**      | Checks if all the participants belong to the firm     |   :heavy_check_mark: *Completed*|

## RASA Way
> An IMAP Webhook that listens to emails *(tested on gmail)* and sends the query to RASA server, the server parses the texts, emits the actions and then contacts the client_server to check if the participants are valid, finally booking is done

![](https://i.imgur.com/yLrRPRr.png)


#### Branches associated with the track

| Branch        | Description          | Status|
| ------------- |:-------------:| :-------------:|
| **node_mcu**      | The IOT code that'll for Node MCU and RFID Module| :warning: Hooking up with APIs|
| **nodemailer**      | Server to send emails *(Can be replaced with 3rd party APIs)*  | :heavy_multiplication_x: Yet to push|
| **frontend**      | Frontend for the react App built using baseweb v9 UI kit for admin   |   :heavy_check_mark: *Completed*|
| **client_server**      | Checks if all the participants belong to the firm     |   :heavy_check_mark: *Completed*|
| **email_server**      | The Node.js webhook and RASA server codes     |   :heavy_check_mark: *Completed*|





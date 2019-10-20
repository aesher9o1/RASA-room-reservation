const USER_ACTIONS = {
    CREATE: "CREATE",
    CANCEL: "CANCEL",
    INVALID: "INVALID"
}


const BOOK_ROOM_COMMAND = { "book": true, "booking": true, "reservation": true, "lock": true, "block": true, "appoint": true, "require": true, "requiring": true }
const BOOK_ROOM_COMMAND_TEST = [
    "Book me a room with number 111",
    "Please book me a room with number 15",
    "Reserve a room with number twelve",
    "Set up a reservation 177"
]
const CORRESPONDING_ROOM_NUMBER = [111, 15, 12, 177]


const CANCEL_ROOM_COMMAND = { "cancel": true, "cancelling": true, "delete": true }
const CANCEL_ROOM_COMMAND_TEST = [
    "Cancel the room I booked",
    "Cancel room number "
]


const ERRORS = {
    NO_ROOM_IN_SUBJECT: "We could not find a valid room number in the subject.",
    NO_ACTION_IN_SUBJECT: "We could not determine the action required to be done from the subject",
    NOT_VALID_TIME: "We could not determine the time interal between which the room has to be booked",
    NONE: true
}


const BODY_TESTS = [
    "Book the room from today 4PM to tomorrow 9PM",
    "From 13:00 tomorrow to 14:00 tomorrow"
]
const BODY_TEST_RESULTS = [
    {
        text: "today 4PM to tomorrow 9PM",
        startTime: 16,
        endTime: 21
    },
    {
        text: "From 13:00 tomorrow to 14:00 tomorrow",
        startTime: 13,
        endTime: 14
    }
]


const EMAIL_MOCK = {
    subject: "Request for booking of Room 11",
    text: "Respected sir, Please book me room 11 from tomorrow 11PM to 1PM thanking you aashis",
    cc:
        [{ address: 'aashis.169109002@muj.manipal.edu', name: '' }],
    from:
        { address: 'aashiskumar986@gmail.com', name: 'Aashis Kumar' }
}


module.exports = {
    USER_ACTIONS,
    BOOK_ROOM_COMMAND_TEST,
    CANCEL_ROOM_COMMAND_TEST,
    EMAIL_MOCK,
    CORRESPONDING_ROOM_NUMBER,
    CANCEL_ROOM_COMMAND,
    BOOK_ROOM_COMMAND,
    BODY_TESTS,
    BODY_TEST_RESULTS,
    ERRORS
}
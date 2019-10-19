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

const EMAIL_MOCK = {
    subject: 'asdasdasd',
    text: 'asdas\n',
    cc:
        [{ address: 'aashis.169109002@muj.manipal.edu', name: '' }],
    from:
        { address: 'aashiskumar986@gmail.com', name: 'Aashis Kumar' }
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

module.exports = {
    USER_ACTIONS,
    BOOK_ROOM_COMMAND_TEST,
    CANCEL_ROOM_COMMAND_TEST,
    EMAIL_MOCK,
    CORRESPONDING_ROOM_NUMBER,
    CANCEL_ROOM_COMMAND,
    BOOK_ROOM_COMMAND,
    BODY_TESTS,
    BODY_TEST_RESULTS
}
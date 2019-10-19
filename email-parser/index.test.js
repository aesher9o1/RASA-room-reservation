import EmailParser from './index'
const { BOOK_ROOM_COMMAND_TEST,
    USER_ACTIONS,
    CANCEL_ROOM_COMMAND_TEST,
    CORRESPONDING_ROOM_NUMBER,
    BODY_TEST_RESULTS,
    BODY_TESTS
} = require('./model')

describe('Sending email to the function', () => {
    const emailParser = new EmailParser({})

    it('checks if test case IS CREATE and CANCEL event', () => {

        BOOK_ROOM_COMMAND_TEST.forEach(ele => {
            return emailParser.emitUserAction(ele).then(res => {
                expect(res).toHaveProperty("OPERATION", USER_ACTIONS.CREATE)
            })
        })


        CANCEL_ROOM_COMMAND_TEST.forEach(ele => {
            return emailParser.emitUserAction(ele).then(res => {
                expect(res).toHaveProperty("OPERATION", USER_ACTIONS.CANCEL)
            })
        })
    });


    it('emits the room number that the user sought to book (for booking commands)', () => {
        for (var i = 0; i < BOOK_ROOM_COMMAND_TEST.length; i++)
            expect(emailParser.emitRoomNumber(BOOK_ROOM_COMMAND_TEST[i])).toEqual(CORRESPONDING_ROOM_NUMBER[i])
    })


    it('checks if the important keyword are extracted from the email', () => {
        for (var i = 0; i < BODY_TEST_RESULTS.length; i++) {
            var result = emailParser.emitDuration(BODY_TESTS[i])
            expect(result).toHaveProperty("text", BODY_TEST_RESULTS[i]["text"])
            expect(result).toHaveProperty("startTime", BODY_TEST_RESULTS[i]["startTime"])
            expect(result).toHaveProperty("endTime", BODY_TEST_RESULTS[i]["endTime"])
        }
    })

});
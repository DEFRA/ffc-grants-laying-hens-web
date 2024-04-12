
describe('email.js', () => {
    const value = require('./../../../../../../app/messaging/email/config/email')

    const OLD_ENV = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...OLD_ENV }
    })

    afterAll(() => {
        process.env = OLD_ENV
    })

    xtest('check email config', () => {
        const {
            NOTIFY_EMAIL_TEMPLATE
        } = process.env

        expect(value).toEqual({
            notifyTemplate: NOTIFY_EMAIL_TEMPLATE
        })
    })

    xtest('check email config', () => {
        const {
            NOTIFY_EMAIL_VERANDA_TEMPLATE
        } = process.env

        expect(value).toEqual({
            notifyTemplateVeranda: NOTIFY_EMAIL_VERANDA_TEMPLATE
        })
    })


    test('Invalid env var throws error', () => {
        process.env.NOTIFY_EMAIL_TEMPLATE = 444

        expect(() => require('./../../../../../../app/messaging/email/config/email')).toThrow()
    })

    test('Invalid env var throws error', () => {
        process.env.NOTIFY_EMAIL_VERANDA_TEMPLATE = 444

        expect(() => require('./../../../../../../app/messaging/email/config/email')).toThrow()
    })
})

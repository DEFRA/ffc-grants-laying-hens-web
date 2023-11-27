
describe('messaging.js', () => {
    const value = require('../../../app/config/messaging')

    const OLD_ENV = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...OLD_ENV }
    })

    afterAll(() => {
        process.env = OLD_ENV
    })

    xtest('check messaging config if env is test', () => {
        const {
            SERVICE_BUS_HOST,
            SERVICE_BUS_PASSWORD,
            SERVICE_BUS_USER,
            CONTACT_DETAILS_QUEUE_ADDRESS,
            SCORE_REQUEST_QUEUE_ADDRESS,
            SCORE_RESPONSE_QUEUE_ADDRESS,
            DESIRABILITY_SUBMITTED_TOPIC_ADDRESS
        } = process.env

        process.env.NODE_ENV = 'test'

        const sharedConfig = {
            appInsights: require('applicationinsights'),
            host: process.env.SERVICE_BUS_HOST,
            password: process.env.SERVICE_BUS_PASSWORD,
            username: process.env.SERVICE_BUS_USER,
            useCredentialChain: process.env.NODE_ENV === 'production'
        }

        const msgTypePrefix = 'uk.gov.ffc.grants' // ' '

        expect(value).toEqual({
            contactDetailsQueue: {
                address: process.env.CONTACT_DETAILS_QUEUE_ADDRESS,
                type: 'queue',
                ...sharedConfig
            },
            scoreRequestQueue: {
                address: process.env.SCORE_REQUEST_QUEUE_ADDRESS,
                type: 'queue',
                ...sharedConfig
            },
            scoreResponseQueue: {
                address: process.env.SCORE_RESPONSE_QUEUE_ADDRESS,
                type: 'queue',
                ...sharedConfig
            },
            desirabilitySubmittedTopic: {
                address: process.env.DESIRABILITY_SUBMITTED_TOPIC_ADDRESS,
                type: 'topic',
                ...sharedConfig
            },
            desirabilitySubmittedMsgType: `${msgTypePrefix}.slurry.desirability.notification`,
            fetchScoreRequestMsgType: `${msgTypePrefix}.fetch.score.request`,
            eligibilityAnswersMsgType: `${msgTypePrefix}.slurry.eligibility.details`,
            contactDetailsMsgType: `${msgTypePrefix}.slurry.contact.details`,
            msgSrc: 'ffc-grants-laying-hens-web'
        })
    })

    xtest('check messaging config if env is production', () => {
        const {
            SERVICE_BUS_HOST,
            SERVICE_BUS_PASSWORD,
            SERVICE_BUS_USER,
            CONTACT_DETAILS_QUEUE_ADDRESS,
            SCORE_REQUEST_QUEUE_ADDRESS,
            SCORE_RESPONSE_QUEUE_ADDRESS,
            DESIRABILITY_SUBMITTED_TOPIC_ADDRESS
        } = process.env

        process.env.NODE_ENV = 'production'

        const sharedConfig = {
            appInsights: require('applicationinsights'),
            host: process.env.SERVICE_BUS_HOST,
            password: process.env.SERVICE_BUS_PASSWORD,
            username: process.env.SERVICE_BUS_USER,
            useCredentialChain: process.env.NODE_ENV === 'production'
        }

        const msgTypePrefix = 'uk.gov.ffc.grants' // ' '

        expect(value).toEqual({
            contactDetailsQueue: {
                address: process.env.CONTACT_DETAILS_QUEUE_ADDRESS,
                type: 'queue',
                ...sharedConfig
            },
            scoreRequestQueue: {
                address: process.env.SCORE_REQUEST_QUEUE_ADDRESS,
                type: 'queue',
                ...sharedConfig
            },
            scoreResponseQueue: {
                address: process.env.SCORE_RESPONSE_QUEUE_ADDRESS,
                type: 'queue',
                ...sharedConfig
            },
            desirabilitySubmittedTopic: {
                address: process.env.DESIRABILITY_SUBMITTED_TOPIC_ADDRESS,
                type: 'topic',
                ...sharedConfig
            },
            desirabilitySubmittedMsgType: `${msgTypePrefix}.slurry.desirability.notification`,
            fetchScoreRequestMsgType: `${msgTypePrefix}.fetch.score.request`,
            eligibilityAnswersMsgType: `${msgTypePrefix}.slurry.eligibility.details`,
            contactDetailsMsgType: `${msgTypePrefix}.slurry.contact.details`,
            msgSrc: 'ffc-grants-laying-hens-web'
        })
    })

    test('Invalid env var throws error', () => {
        process.env.SERVICE_BUS_HOST = 87,
        process.env.SERVICE_BUS_PASSWORD = 78,
        process.env.SERVICE_BUS_USER = 78,
        process.env.NODE_ENV = 'production',
        process.env.CONTACT_DETAILS_QUEUE_ADDRESS = 454,
        process.env.SCORE_REQUEST_QUEUE_ADDRESS = 676,
        process.env.SCORE_RESPONSE_QUEUE_ADDRESS = 787,
        process.env.DESIRABILITY_SUBMITTED_TOPIC_ADDRESS = 87

        expect(() => require('../../../app/config/messaging')).toThrow()
    })
})

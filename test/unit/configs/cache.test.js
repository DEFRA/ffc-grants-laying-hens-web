
describe('polling.js', () => {
    const value = require('../../../app/config/cache')

    const OLD_ENV = process.env

    beforeEach(() => {
        jest.resetModules()
        process.env = { ...OLD_ENV }
    })

    afterAll(() => {
        process.env = OLD_ENV
    })

    xtest('check cache config if env is test', () => {
        const {
            SESSION_CACHE_TTL,
            REDIS_HOSTNAME,
            REDIS_PORT,
            REDIS_PASSWORD,
            REDIS_PARTITION
        } = process.env

        process.env.NODE_ENV = 'test'

        expect(value).toEqual({
            useRedis: process.env.NODE_ENV !== 'test',
            expiresIn: process.env.SESSION_CACHE_TTL,
            catboxOptions: {
                host: process.env.REDIS_HOSTNAME,
                port: process.env.REDIS_PORT,
                password: process.env.REDIS_PASSWORD,
                partition: process.env.REDIS_PARTITION,
                tls: process.env.NODE_ENV === 'production' ? {} : undefined
            }
        })
    })

    xtest('check cache config if env is production', () => {
        const {
            SESSION_CACHE_TTL,
            REDIS_HOSTNAME,
            REDIS_PORT,
            REDIS_PASSWORD,
            REDIS_PARTITION
        } = process.env

        process.env.NODE_ENV = 'production'

        expect(value).toEqual({
            useRedis: process.env.NODE_ENV !== 'test',
            expiresIn: process.env.SESSION_CACHE_TTL,
            catboxOptions: {
                host: process.env.REDIS_HOSTNAME,
                port: process.env.REDIS_PORT,
                password: process.env.REDIS_PASSWORD,
                partition: process.env.REDIS_PARTITION,
                tls: process.env.NODE_ENV === 'production' ? {} : undefined
            }
        })
    })

    test('Invalid env var throws error', () => {
        process.env.NODE_ENV = true,
        process.env.SESSION_CACHE_TTL = 'hello',
        process.env.REDIS_HOSTNAME = 908,
        process.env.REDIS_PORT = 87,
        process.env.REDIS_PASSWORD = 98,
        process.env.REDIS_PARTITION = 876

        expect(() => require('../../../app/config/cache')).toThrow()
    })
})

describe('Session-timeout test', () => {
    test('GET /session-timeout route returns 200', async () => {
        const options = {
            method: 'GET',
            url: `${global.__URLPREFIX__}/session-timeout`
        }

        const response = await global.__SERVER__.inject(options)
        expect(response.statusCode).toBe(200)
    })
})

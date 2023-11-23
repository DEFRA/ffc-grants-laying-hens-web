const { crumbToken } = require('./test-helper')

describe('Page: /housing', () => {
	const varList = {
		legalStatus: 'randomData',
		projectType: 'fakeData',
		tenancy: 'Yes',
		tenancyLength: null,
		minimumFloorArea: '100kg or under',
		housedIndividually: 'Yes',
		isolateCalves: 'Yes',
		remainingCosts: 'Yes',
	}

	jest.mock('../../../../app/helpers/session', () => ({
		setYarValue: (request, key, value) => null,
		getYarValue: (request, key) => {
			if (varList[ key ]) return varList[ key ]
			else return 'Error'
		}
	}));

	it('page loads successfully, with all the options', async () => {
		const options = {
			method: 'GET',
			url: `${global.__URLPREFIX__}/housing`,
		}

		const response = await global.__SERVER__.inject(options)
		expect(response.statusCode).toBe(200)
		expect(response.payload).toContain('Are you moving from individually housing calves over 7 days old to pair or group housing?')
		expect(response.payload).toContain('Yes')
		expect(response.payload).toContain('No')
	});

	it('no option selected -> show error message', async () => {
		const postOptions = {
			method: 'POST',
			url: `${global.__URLPREFIX__}/housing`,
			headers: { cookie: 'crumb=' + crumbToken },
			payload: { crumb: crumbToken }
		}

		const postResponse = await global.__SERVER__.inject(postOptions)
		expect(postResponse.statusCode).toBe(200)
		expect(postResponse.payload).toContain('Select yes if you are moving from individually housed calves over 7 days old to pair or group housing')
	});

	it('user selects eligible option: \'No\' -> Advances to /disease-transmission', async () => {
		const postOptions = {
			method: 'POST',
			url: `${global.__URLPREFIX__}/housing`,
			headers: { cookie: 'crumb=' + crumbToken },
			payload: { housing: 'No', crumb: crumbToken }
		}

		const postResponse = await global.__SERVER__.inject(postOptions)
		expect(postResponse.statusCode).toBe(302)
		expect(postResponse.headers.location).toBe('group-size') // todo: change to disease-transmission later
		// expect(postResponse.headers.location).toBe('disease-transmission')
	});

	it('user selects eligible option: \'Yes\' -> Advances to /disease-transmission', async () => {
		const postOptions = {
			method: 'POST',
			url: `${global.__URLPREFIX__}/housing`,
			headers: { cookie: 'crumb=' + crumbToken },
			payload: { housing: 'Yes', crumb: crumbToken }
		}

		const postResponse = await global.__SERVER__.inject(postOptions)
		expect(postResponse.statusCode).toBe(302)
		expect(postResponse.headers.location).toBe('group-size') // todo: change to disease-transmission later
		// expect(postResponse.headers.location).toBe('disease-transmission')
	})
});
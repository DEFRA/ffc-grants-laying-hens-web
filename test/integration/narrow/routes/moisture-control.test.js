const { crumbToken } = require('./test-helper')

describe('Page: /moisture-control', () => {
	const varList = {
		legalStatus: 'randomData',
		projectType: 'fakeData',
		tenancy: 'Yes',
		tenancyLength: null,
		minimumFloorArea: '100kg or under',
		housedIndividually: 'Yes',
		isolateCalves: 'Yes',
		remainingCosts: 'Yes',
		housing: 'Yes',
		calfGroupSize: '2 to 3'
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
			url: `${global.__URLPREFIX__}/moisture-control`,
		}

		const response = await global.__SERVER__.inject(options)
		expect(response.statusCode).toBe(200)
		expect(response.payload).toContain('How will your building control moisture?')
		expect(response.payload).toContain('Select all that apply') // hint text
		expect(response.payload).toContain('A drain or drainage channel inside the pen');
		expect(response.payload).toContain('Positioning drinking areas near drainage and away from bedding');
		expect(response.payload).toContain('A separate preparation or washing area');
		expect(response.payload).toContain('<div class="govuk-checkboxes__divider">or</div>');
		expect(response.payload).toContain('None of the above');
	});

	it('no option selected -> show error message', async () => {
		const postOptions = {
			method: 'POST',
			url: `${global.__URLPREFIX__}/moisture-control`,
			headers: { cookie: 'crumb=' + crumbToken },
			payload: { crumb: crumbToken }
		}

		const postResponse = await global.__SERVER__.inject(postOptions)
		expect(postResponse.statusCode).toBe(200)
		expect(postResponse.payload).toContain('Select how your building will control moisture')
	});

	it('user selects eligible option: \'A drain or drainage channel inside the pen\' -> Advances to /permanent-sick-pen', async () => {
		const postOptions = {
			method: 'POST',
			url: `${global.__URLPREFIX__}/moisture-control`,
			headers: { cookie: 'crumb=' + crumbToken },
			payload: { moistureControl: 'A drain or drainage channel inside the pen', crumb: crumbToken }
		}

		const postResponse = await global.__SERVER__.inject(postOptions)
		expect(postResponse.statusCode).toBe(302)
		expect(postResponse.headers.location).toBe(`permanent-sick-pen`)
	});

	it('user selects eligible option: \'None of the above\' -> Advances to /permanent-sick-pen ', async () => {
		const postOptions = {
			method: 'POST',
			url: `${global.__URLPREFIX__}/moisture-control`,
			headers: { cookie: 'crumb=' + crumbToken },
			payload: { moistureControl: 'None of the above', crumb: crumbToken }
		}

		const postResponse = await global.__SERVER__.inject(postOptions)
		expect(postResponse.statusCode).toBe(302)
		expect(postResponse.headers.location).toBe(`permanent-sick-pen`)
	});

	it('JS is disabled and user selects ineligible option: \'None of the above\' with another option -> show error message', async () => {
		const postOptions = {
			method: 'POST',
			url: `${global.__URLPREFIX__}/moisture-control`,
			headers: { cookie: 'crumb=' + crumbToken },
			payload: { moistureControl: [ 'None of the above', 'A drain or drainage channel inside the pen'], crumb: crumbToken }
		}

		const postResponse = await global.__SERVER__.inject(postOptions)
		expect(postResponse.statusCode).toBe(200)
		expect(postResponse.payload).toContain('You cannot select that combination of options')
	});
});

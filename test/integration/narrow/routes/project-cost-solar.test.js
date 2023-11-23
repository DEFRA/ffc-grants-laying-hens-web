const { crumbToken } = require('./test-helper')

const varListTemplate = {
  farmingType: 'some fake crop',
  legalStatus: 'fale status',
  inEngland: 'Yes',
  projectStarted: 'No',
  landOwnership: 'Yes',
  projectItemsList: {
    projectEquipment: ['Boom', 'Trickle']
  },
  projectCostSolar: {
    calfHousingCost: '12345',
    SolarPVCost: '123445'
  }
}

let varList
const mockSession = {
  setYarValue: (request, key, value) => null,
  getYarValue: (request, key) => {
    if (Object.keys(varList).includes(key)) return varList[key]
    else return undefined
  }
}

jest.mock('../../../../app/helpers/session', () => mockSession)

describe('Project cost solar page', () => {
  beforeEach(() => {
    varList = { ...varListTemplate }
  })

  afterEach(() => {
    jest.clearAllMocks()
  })
  it('should load page successfully', async () => {
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost-solar`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should load page successfully if no projectCostSolar', async () => {
    varList = {
      legalStatus: 'fale status',
      inEngland: 'Yes',
      projectStarted: 'No',
      landOwnership: 'Yes',
      projectItemsList: {
        projectEquipment: ['Boom', 'Trickle']
      },
      projectCost: undefined
    }

    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost-solar`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(200)
  })

  it('should return an error message if no option is selected', async () => {
    varList['current-score'] = null
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost-solar`,
      payload: { crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter the estimated total cost of the calf housing')
    expect(postResponse.payload).toContain('Enter the estimated total cost of the solar PV system')
  })


  it('should return an error message if the number of digits typed exceed 7', async () => {
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost-solar`,
      payload: { SolarPVCost: '12345678', calfHousingCost: '12345678', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('Enter a whole number with a maximum of 7 digits')
  })

  it('should eliminate user if the cost entered is too low', async () => {
    varList.projectCostSolar = {
      calfHousingCost: '12',
      SolarPVCost: '123445'
    }
    varList.calculatedGrantCalf = '12'

    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost-solar`,
      payload: {
        calfHousingCost: '12',
        SolarPVCost: '12345',
        crumb: crumbToken
      },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    expect(postResponse.statusCode).toBe(200)
    expect(postResponse.payload).toContain('You cannot apply for a grant from this scheme')
  })

  it('should redirected to the Potential amount conditional page if the calf grant entered is too high', async () => {
    varList.projectCostSolar = {
      calfHousingCost: '1250000',
      SolarPVCost: '123445'
    }
    varList.calculatedGrantCalf = '500000'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost-solar`,
      payload: { calfHousingCost: '1250000', SolarPVCost: '123445', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    console.log('payload: ', postResponse.payload)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/upgrading-calf-housing/potential-amount-conditional')
  })

  it('should redirected to the Potential amount solar capped page if the solar grant entered is too high', async () => {
    varList.projectCostSolar = {
      calfHousingCost: '37500',
      SolarPVCost: '2290000'
    }
    varList.calculatedGrant = '500001'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost-solar`,
      payload: { calfHousingCost: '37500', SolarPVCost: '2290000', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    console.log('payload: ', postResponse.payload)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('/upgrading-calf-housing/potential-amount-solar-capped')
  })

  it('should redirected to the Potential amount solar page if all values entered correctly', async () => {
    varList.projectCostSolar = {
      calfHousingCost: '123456',
      SolarPVCost: '23456'
    }
    varList.calculatedGrant = '350000'
    const postOptions = {
      method: 'POST',
      url: `${global.__URLPREFIX__}/project-cost-solar`,
      payload: { calfHousingCost: '123456', SolarPVCost: '23456', crumb: crumbToken },
      headers: { cookie: 'crumb=' + crumbToken }
    }

    const postResponse = await global.__SERVER__.inject(postOptions)
    console.log('payload: ', postResponse.payload)
    expect(postResponse.statusCode).toBe(302)
    expect(postResponse.headers.location).toBe('potential-amount-solar')
  })


  it('should redirect to housing page if theres score', async () => {
    varList['current-score'] = true
    const options = {
      method: 'GET',
      url: `${global.__URLPREFIX__}/project-cost-solar`
    }

    const response = await global.__SERVER__.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(`${global.__URLPREFIX__}/housing`)
  })
})

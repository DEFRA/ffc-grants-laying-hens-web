describe('create-msg', () => {
  jest.mock('ffc-grants-common-functionality')
  const { session } = require('ffc-grants-common-functionality')

  const { getDesirabilityAnswers } = require('../../../../app/messaging/create-msg')

  test('check getDesirabilityAnswers()', () => {
    let dict
    session.getYarValue.mockImplementation((req, key) => (dict[key]))

    dict = {
      housing: 'hello',
      calfGroupSize: 'hello',
      moistureControl: ['hello'],
      permanentSickPen: ['hello'],
      environmentalImpact: ['hello'],
      sustainableMaterials: ['hello'],
      introducingInnovation: ['hello']
    }
    expect(getDesirabilityAnswers({})).toEqual({
      housing: 'hello',
      calfGroupSize: 'hello',
      moistureControl: ['hello'],
      permanentSickPen: ['hello'],
      environmentalImpact: ['hello'],
      sustainableMaterials: ['hello'],
      introducingInnovation: ['hello']
    })

    dict = {
      housing: null,
      calfGroupSize: null,
      moistureControl: null,
      permanentSickPen: null,
      environmentalImpact: null,
      sustainableMaterials: null,
      introducingInnovation: null
    }

    expect(getDesirabilityAnswers({})).toEqual(null)


  })
})

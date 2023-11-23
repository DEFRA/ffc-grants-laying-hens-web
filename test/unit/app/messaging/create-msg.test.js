describe('create-msg', () => {
  jest.mock('../../../../app/helpers/session')
  const { getYarValue } = require('../../../../app/helpers/session')

  const { getDesirabilityAnswers } = require('../../../../app/messaging/create-msg')

  test('check getDesirabilityAnswers()', () => {
    let dict
    getYarValue.mockImplementation((req, key) => (dict[key]))

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
  })
})

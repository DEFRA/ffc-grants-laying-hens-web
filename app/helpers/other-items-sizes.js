const { WHOLE_NUMBER_REGEX, COMMA_EXCLUDE_REGEX, DECIMAL_EXCLUDE_REGEX } = require('./regex')
const { formatUKCurrency } = require('../helpers/data-formats')

const formatTempObject = (item, keyTitle, suffixAndLengthValue, catagoryData) => {
  const maxValue = suffixAndLengthValue.length === 4 ? 9999 : 9999999999
  item.amount = formatUKCurrency(item.amount)

  return {
    yarKey: item.item.replace(/[- ,)(]/g, ''), // Could add key to db list, to be used for populating yar?
    type: 'text',
    inputmode: 'numeric',
    pattern: '[0-9]*',
    suffix: { text: suffixAndLengthValue.unit },
    hint: {
      text: `Grant amount: £${item.amount} ${item.unit}`
    },
    classes: `govuk-input--width-${suffixAndLengthValue.length}`,
    label: {
      text: item.item,
      classes: 'govuk-label--m'
    },
    validate: [
     
    ]
  }
}

function suffixAndLengthGenerator (unit) {
  switch (unit) {
    case 'per cubic metre':
      return { unit: 'm³', length: 10 }
    case 'per metre':
      return { unit: 'metre(s)', length: 10 }
    default:
      return { unit: 'item (s)', length: 4 }
  }
}

function keyGenerator (title) {
  // format key name for NOT_EMPTY validation
  switch (title) {
    case 'Reception pit type':
      return 'plastic reception pit'
    case 'Pump type':
      return 'pump'
    default:
      return title.toLowerCase()
  }
}

function getErrorUnit (catagory) {
  const volumeArray = ['cat-reception-pit-type', 'cat-pipework', 'cat-transfer-channels']
  const errorType = volumeArray.includes(catagory) ? 'Size' : 'Quantity'

  return { errorType: errorType }
}

function formatOtherItems (request) {
  const object = request.yar.get('standardisedCostObject')
  const otherItemsArray = [request.yar.get('otherItems')].flat()
  const listOfCatagories = ['cat-reception-pit-type', 'cat-pump-type', 'cat-pipework', 'cat-transfer-channels', 'cat-agitator', 'cat-safety-equipment']

  const returnArray = []

  if (object?.data && otherItemsArray.length > 0) {
    otherItemsArray.forEach((otherItem, _index) => {
      for (const catagory in listOfCatagories) {
        const selectedCatagory = object.data.desirability.catagories.find(({ key }) => key === listOfCatagories[catagory])

        selectedCatagory.items.forEach((item) => {
          if (item.item === otherItem) {
            const suffixAndLengthValue = suffixAndLengthGenerator(item.unit)
            const keyTitle = keyGenerator(selectedCatagory.title)
            const catagoryData = getErrorUnit(listOfCatagories[catagory])

            const tempObject = formatTempObject(item, keyTitle, suffixAndLengthValue, catagoryData)

            returnArray.push(tempObject)
          }
        })
      }
    })
  }

  return returnArray
}

module.exports = {
  formatOtherItems
}

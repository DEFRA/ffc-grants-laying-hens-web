const { formatUKCurrency } = require('./data-formats')

const getHintText = (answer, hintArray, counter) => {
  if (hintArray && hintArray[counter - 1]) {
    return `${hintArray[counter - 1]} <br/> (Grant amount: £${answer.amount} ${answer.unit})`
  }
  return 'Grant amount: £' + formatUKCurrency(answer.amount) + ' ' + answer.unit
}

function formatAnswerArray (request, questionKey, catagoryKey, hintArray) {
  const object = request.yar.get('standardisedCostObject')

  const returnArray = []

  let listOfCatagories

  let counter = 1

  if (object?.data) {
    if (catagoryKey === 'other') {
      listOfCatagories = ['cat-reception-pit-type', 'cat-pump-type', 'cat-pipework', 'cat-transfer-channels', 'cat-agitator', 'cat-safety-equipment']
    } else {
      listOfCatagories = [catagoryKey]
    }

    for (const catagory in listOfCatagories) {
      const selectedCatagory = object.data.desirability.catagories.find(({ key }) => key === listOfCatagories[catagory])

      let tempObject

      for (const answer in selectedCatagory.items) {
        tempObject = {
          key: questionKey + '-A' + (counter),
          value: selectedCatagory.items[answer].item,
          sidebarFormattedValue: selectedCatagory.items[answer].item,
          hint: {
            html: getHintText(selectedCatagory.items[answer], hintArray, counter)
          }
        }

        counter += 1

        returnArray.push(tempObject)
      }
    }
  }

  return returnArray
}

module.exports = {
  formatAnswerArray
}

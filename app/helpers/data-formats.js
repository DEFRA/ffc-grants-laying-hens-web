const isInteger = number => (number - Math.floor(number)) === 0
  // NOT using Number.isInteger() because
  //  - not working on Internet Explorer
  //  - Number.isInteger(40000.00) === false ( instead of true )

const formatUKCurrency = costPounds => {
  costPounds = costPounds.toString().replace(/,/g, '')
  return isInteger(costPounds)
    ? Number(costPounds).toLocaleString('en-GB')
    : Number(costPounds).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}
module.exports = {
  formatUKCurrency
}

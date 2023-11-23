const getGrantValues = (projectCostValue, grantsInfo) => {
  // if (cappedGrant = true) then maxGrant becomes max grant available
  const { minGrant, maxGrant, grantPercentage, cappedGrant } = grantsInfo

  let calculatedGrant = grantPercentage ? Number(grantPercentage * projectCostValue / 100).toFixed(2) : projectCostValue

  if (cappedGrant) {
    calculatedGrant = Math.min(calculatedGrant, maxGrant)
  }
  const remainingCost = Number(projectCostValue - calculatedGrant).toFixed(2)
  const isEligible = (
    (minGrant <= calculatedGrant) && (calculatedGrant <= maxGrant)
  )
  return { calculatedGrant, remainingCost, isEligible }
}

const getGrantValuesSolar = (projectCostValue, grantsInfo) => {
  // if (cappedGrant = true) then maxGrant becomes max grant available
  const { minGrant, maxGrant, grantPercentage, cappedGrant } = grantsInfo

  let calculatedGrantSolar = grantPercentage ? Number(grantPercentage * projectCostValue / 100).toFixed(2) : projectCostValue

  if (cappedGrant) {
    calculatedGrantSolar = Math.min(calculatedGrantSolar, maxGrant)
  }
  const remainingCostSolar = Number(projectCostValue - calculatedGrantSolar).toFixed(2)
  const isEligibleSolar = (
    (minGrant <= calculatedGrantSolar) && (calculatedGrantSolar <= maxGrant)
  )
  return { calculatedGrantSolar, remainingCostSolar, isEligibleSolar }
}

module.exports = {
  getGrantValues,
  getGrantValuesSolar
}

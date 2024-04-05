const getGrantValuesSolar = (projectCostValueSolar, grantsInfo) => {
  const { grantPercentage} = grantsInfo
  projectCostValueSolar = projectCostValueSolar.replace(/,/g, '')
  
  const calculatedGrantSolar = Number(grantPercentage * projectCostValueSolar / 100)
  const projectCostSolar = Number(projectCostValueSolar)
  
  return { calculatedGrantSolar , projectCostSolar }
}

module.exports = {
  getGrantValuesSolar
}
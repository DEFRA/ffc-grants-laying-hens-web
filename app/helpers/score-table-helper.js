const healthWelfare = 'Improve health/welfare'
const environment = 'Improve the environment'
const tableOrder = [
  {
    key: 'housing',
    order: 1,
    title: 'Housing',
    pageTitle: 'Housing',
    url: 'housing',
    fundingPriorities: healthWelfare,
    yarKey: 'housing'
  },
  {
    key: 'calf-group-size',
    order: 2,
    title: 'Average calf group size',
    pageTitle: 'Average calf group size',
    url: 'group-size',
    fundingPriorities: healthWelfare,
    yarKey: 'calfGroupSize'
  },
  {
    key: 'moisture-control',
    order: 5,
    title: 'Control building moisture',
    pageTitle: 'control building moisture',
    url: 'moisture-control',
    fundingPriorities: healthWelfare,
    yarKey: 'moistureControl'
  },
  {
    key: 'permanent-sick-pen',
    order: 6,
    title: 'Sick pen type',
    pageTitle: 'Sick pen type',
    url: 'permanent-sick-pen',
    fundingPriorities: healthWelfare,
    yarKey: 'permanentSickPen'
  },
  {
    key: 'environmental-impact',
    order: 8,
    title: 'Environmental impact',
    pageTitle: 'Enviornmental impact',
    url: 'environmental-impact',
    fundingPriorities: environment,
    yarKey: 'environmentalImpact'
  },
  {
    key: 'rainwater',
    order: 8,
    title: 'Collect and store rainwater',
    pageTitle: 'Collect and store rainwate',
    url: 'rainwater',
    fundingPriorities: environment,
    yarKey: 'environmentalImpact'
  },
  {
    key: 'sustainable-materials',
    order: 9,
    title: 'Sustainable materials',
    pageTitle: 'Sustainable materials',
    url: 'sustainable-materials',
    fundingPriorities: environment,
    yarKey: 'sustainableMaterials'
  },
  {
    key: 'introducing-innovation',
    order: 10,
    title: 'Innovation',
    pageTitle: 'Innovation',
    url: 'introducing-innovation',
    fundingPriorities: environment,
    yarKey: 'introducingInnovation'
  }

]
module.exports = {
  tableOrder
}

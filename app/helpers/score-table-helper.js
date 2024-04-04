const commonPages = [
  {
    key: 'current-system',
    order: 1,
    title: 'Current system',
    pageTitle: 'Current system',
    url: 'current-system',
    fundingPriorities: 'Support the transition out of colony cages',
    yarKey: 'currentSystem'
  },
  {
    key: 'ramp-connection',
    order: 3,
    title: 'Level ramp connection',
    pageTitle: 'Level ramp connection',
    url: 'ramp-connection',
    fundingPriorities: 'Reduce the risk of keel bone fractures',
    yarKey: 'rampConnection'
  },
  {
    key: 'maximum-tier-height',
    order: 4,
    title: 'Maximum height of highest tier',
    pageTitle: 'Maximum height of highest tier',
    url: 'maximum-tier-height',
    fundingPriorities: 'Prevent birds falling from heights of more than 2 metres',
    yarKey: 'maximumTierHeight'
  },
  {
    key: 'three-tiers',
    order: 5,
    title: '3 tiers or fewer',
    pageTitle: '3 tiers or fewer',
    url: 'three-tiers',
    fundingPriorities: 'Aviary systems that have 3 tiers or fewer',
    yarKey: 'threeTiers'
  },
  {
    key: 'natural-light',
    order: 7,
    title: 'Natural light',
    pageTitle: 'Natural light',
    url: 'natural-light',
    fundingPriorities: 'Support projects which provide natural light',
    yarKey: 'naturalLight'
  },
  {
    key: 'easy-grip-perches',
    order: 9,
    title: 'Perch grip feature',
    pageTitle: 'Perch grip feature',
    url: 'easy-grip-perches',
    fundingPriorities: 'Support projects which provide easy-grip perches',
    yarKey: 'easyGripPerches'
  },
  {
    key: 'building-biosecurity',
    order: 11,
    title: 'Housing biosecurity',
    pageTitle: 'Housing biosecurity',
    url: 'building-biosecurity',
    fundingPriorities: 'Protection against the spread of disease and infection',
    yarKey: 'buildingBiosecurity'
  },
  {
    key: 'pollution-mitigation',
    order: 12,
    title: 'Pollution mitigation',
    pageTitle: 'Pollution mitigation',
    url: 'pollution-mitigation',
    fundingPriorities: 'Use of pollution mitigation practices',
    yarKey: 'pollutionMitigation'
  },
  {
    key: 'renewable-energy',
    order: 13,
    title: 'Renewable energy',
    pageTitle: 'Renewable energy',
    url: 'renewable-energy',
    fundingPriorities: 'Use of renewable energy',
    yarKey: 'renewableEnergy'
  },
  {
    key: 'bird-data-type',
    order: 14,
    title: 'Poultry management data',
    pageTitle: 'Poultry management data',
    url: 'bird-data-type',
    fundingPriorities: 'Collecting and storing poultry management data',
    yarKey: 'birdDataType'
  },
  {
    key: 'environmental-data-type',
    order: 15,
    title: 'Additional environmental data',
    pageTitle: 'Additional environmental data',
    url: 'environmental-data-type',
    fundingPriorities: 'Collecting and storing additional environmental data',
    yarKey: 'environmentalDataType'
  }
]

const tableOrderHen = [
  ...commonPages,
  {
    key: 'current-multi-tier-system',
    order: 2,
    title: 'Aviary system currently',
    pageTitle: 'Aviary system currently',
    url: 'current-multi-tier-system',
    fundingPriorities: 'Encourage investment in high welfare aviary systems',
    yarKey: 'currentMultiTierSystem'
  },
  {
    key: 'hen-multi-tier',
    order: 6,
    title: 'Consistent housing',
    pageTitle: 'Consistent housing',
    url: 'hen-multi-tier',
    fundingPriorities: 'Support projects that provide a consistent housing type for birds between rearing and laying',
    yarKey: 'henMultiTier'
  }

]

const tableOrderPullet = [
  ...commonPages,
  {
    key: 'current-multi-tier-system',
    order: 2,
    title: 'Multi-tier currently',
    pageTitle: 'Multi-tier currently',
    url: 'current-multi-tier-system',
    fundingPriorities: 'Encourage investment in high welfare multi-tier systems',
    yarKey: 'currentMultiTierSystem'
  },
  {
    key: 'pullet-multi-tier',
    order: 6,
    title: 'Consistent housing',
    pageTitle: 'Consistent housing',
    url: 'pullet-multi-tier',
    fundingPriorities: 'Support projects that provide a consistent housing type for birds between rearing and laying',
    yarKey: 'pulletMultiTier'
  },
  {
    key: 'dark-brooders',
    order: 8,
    title: 'Dark brooders',
    pageTitle: 'Dark brooders',
    url: 'dark-brooders',
    fundingPriorities: 'Support projects which provide dark brooders',
    yarKey: 'darkBrooders'
  },
  {
    key: 'pullet-veranda-features',
    order: 10,
    title: 'Veranda requirements',
    pageTitle: 'Veranda requirements',
    url: 'pullet-veranda-features',
    fundingPriorities: 'Verandas that meet all funding priorities',
    yarKey: 'pulletVerandaFeatures'
  }
]

module.exports = {
  tableOrderHen,
  tableOrderPullet
}

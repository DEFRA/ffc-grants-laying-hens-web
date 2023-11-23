
const msgData = {
  grantScheme: {
      key: "CALF01",
      name: "Upgrading Calf Housing"
  },
  desirability: {
      questions: [
          {
              key: "housing",
              answers: [
                  {
                      key: "housing",
                      title: "Are you moving from individually housing calves over 7 days old to pair or group housing?",
                      input: [
                          {
                              key: "housing-A1",
                              value: "Yes"
                          }
                      ]
                  }
              ],
              rating: {
                  score: 14.76,
                  band: "Strong",
                  importance: null
              }
          },
          {
              key: "calf-group-size",
              answers: [
                  {
                      key: "calf-group-size",
                      title: "What will be the average group size for calves over 7 days old?",
                      input: [
                          {
                              key: "calf-group-size-A1",
                              value: "2 to 3"
                          }
                      ]
                  }
              ],
              rating: {
                  score: 2.9469,
                  band: "Strong",
                  importance: null
              }
          },
          {
              key: "moisture-control",
              answers: [
                  {
                      key: "moisture-control",
                      title: "How will your building control moisture?",
                      input: [
                          {
                              key: "moisture-control-A2",
                              value: "Positioning drinking areas near drainage and away from bedding"
                          },
                          {
                              key: "moisture-control-A3",
                              value: "A separate preparation or washing area"
                          }
                      ]
                  }
              ],
              rating: {}
          },
          {
              key: "permanent-sick-pen",
              answers: [
                  {
                      key: "permanent-sick-pen",
                      title: "What type of sick pen will your building have?",
                      input: [
                          {
                              key: "permanent-sick-pen-A1",
                              value: "A permanent sick pen"
                          },
                          {
                              key: "permanent-sick-pen-A2",
                              value: "A separate air space"
                          }
                      ]
                  }
              ],
              rating: {}
          },
          {
              key: "environmental-impact",
              answers: [
                  {
                      key: "environmental-impact",
                      title: "How will the building minimise environmental impact?",
                      input: [
                          {
                              key: "environmental-impact-A2",
                              value: "Collect and store rainwater"
                          }
                      ]
                  }
              ],
              rating: {}
          },
          {
              key: "sustainable-materials",
              answers: [
                  {
                      key: "sustainable-materials",
                      title: "Will your building use sustainable materials?",
                      input: [
                          {
                              key: "sustainable-materials-A1",
                              value: "Low carbon concrete"
                          }
                      ]
                  }
              ],
              rating: {}
          },
          {
              key: "introducing-innovation",
              answers: [
                  {
                      key: "introducing-innovation",
                      title: "Is your project introducing innovation?",
                      input: [
                          {
                              key: "introducing-innovation-A1",
                              value: "Technology"
                          },
                          {
                              key: "introducing-innovation-A3",
                              value: "Techniques"
                          }
                      ]
                  }
              ],
              rating: {}
          }
      ],
      overallRating: {
          score: null,
          band: "Strong"
      }
  }
}
module.exports = msgData

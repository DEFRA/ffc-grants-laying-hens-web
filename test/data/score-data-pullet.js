
const msgData = {
  "grantScheme": { 
    "key": "LAYINGHENS02", 
    "name": "Pullet Grant" 
  }, 
  "desirability": { 
    "questions": [
      { 
        "key": "poultry-type", 
        "answers": [
          { 
            "key": "poultry-type", 
            "title": "What type of poultry will be housed in this building?", 
            "input": [
              { 
                "key": "poultry-type-A2", 
                "value": "pullet" 
              }
            ] 
          }
          ], 
          "rating": { 
            "score": 0, 
            "band": "Average", 
            "importance": null 
          } 
        }, 
      { 
        "key": "current-system", 
        "answers": [
          { 
            "key": "current-system", 
            "title": "What type of hen housing system do you currently use in the building?", 
            "input": [
              { 
                "key": "current-system-A3", 
                "value": "Barn" 
              }
            ] 
          }
          ], 
          "rating": { 
            "score": 7, 
            "band": "Average", 
            "importance": null 
          } 
        }, 
        { 
          "key": "ramp-connection", 
          "answers": [
            { 
              "key": "ramp-connection", 
              "title": "Will every level of the multi-tier system be connected to another level by a ramp?", 
              "input": [
                { 
                  "key": "ramp-connection-A1", 
                  "value": "Yes" 
                }
              ] 
            }
          ], 
          "rating": { 
            "score": 5, 
            "band": "Strong", 
            "importance": null 
          } 
        }, 
        { 
          "key": "maximum-tier-height", 
          "answers": [
            { 
              "key": "maximum-tier-height", 
              "title": "Will the highest tier with direct access to the floor be 2 metres high or less?", 
              "input": [
                { 
                  "key": "maximum-tier-height-A1", 
                  "value": "Yes" 
                }
              ] 
            }
          ], 
          "rating": { 
            "score": 5, 
            "band": "Strong", 
            "importance": null 
          } 
        }, 
        { 
          "key": "three-tiers", 
          "answers": [
            { 
              "key": "three-tiers", 
              "title": "Will the multi-tier system have 3 tiers or fewer directly above each other?", 
              "input": [
                { 
                  "key": "three-tiers-A1", 
                  "value": "Yes" 
                }
              ] 
            }
          ], 
          "rating": { 
            "score": 5, 
            "band": "Strong", 
            "importance": null 
          } 
        }, 
        { 
          "key": "pullet-multi-tier", 
          "answers": [
            { 
              "key": "pullet-multi-tier", 
              "title": "Will the hens in your grant-funded building be reared in a multi-tier system as pullets?", 
              "input": [
                { 
                  "key": "pullet-multi-tier-A1", 
                  "value": "Yes" 
                }
              ] 
            }
          ], 
          "rating": { 
            "score": 10, 
            "band": "Strong", 
            "importance": null 
          } 
        }, 
        { 
          "key": "natural-light", 
          "answers": [
            { 
              "key": "natural-light", 
              "title": "Will the building have windows that provide natural light to the indoor housing?", 
              "input": [
                { 
                  "key": "natural-light-A1", 
                  "value": "Yes" 
                }
              ] 
            }
          ], 
          "rating": { 
            "score": 10, 
            "band": "Strong", 
            "importance": null 
          } 
        }, 
        { 
          "key": "easy-grip-perches", 
          "answers": [
            { 
              "key": "easy-grip-perches", 
              "title": "Will the perches have a design feature that help the hens grip the perches?", 
              "input": [
                { 
                  "key": "easy-grip-perches-A1", 
                  "value": "Yes" 
                }
              ] 
            }
          ], 
          "rating": { 
            "score": 15, 
            "band": "Strong", 
            "importance": null 
          } 
        }, 
        { 
          "key": "building-biosecurity", 
          "answers": [
            { 
              "key": "building-biosecurity", 
              "title": "Will the building structure include the following?", 
              "input": [
                { 
                  "key": "building-biosecurity-A1", 
                  "value": "Shower-in-facilities in the lobby or changing room area" 
                }, 
                { 
                  "key": "building-biosecurity-A2", 
                  "value": "An externally accessible storage room with a separate air space" 
                }
              ] 
            }
          ], 
          "rating": { 
            "score": 12, 
            "band": "Strong", 
            "importance": null 
          } 
        }, 
        { 
          "key": "pollution-mitigation", 
          "answers": [
            { 
              "key": "pollution-mitigation", 
              "title": "Will the building have any of the following?", 
              "input": [
                { 
                  "key": "pollution-mitigation-A1", 
                  "value": "Manure drying" 
                }, 
                { 
                  "key": "pollution-mitigation-A2", 
                  "value": "Air filtration at inlets" 
                }
              ] 
            }
          ], 
          "rating": { 
            "score": 12, 
            "band": "Strong", 
            "importance": null 
          } 
        }, 
        { 
          "key": "renewable-energy", 
          "answers": [
            { 
              "key": "renewable-energy", 
              "title": "Will the hen housing use renewable energy sources?", 
              "input": [
                { 
                  "key": "renewable-energy-A1", 
                  "value": "Solar PV system" 
                }, 
                { 
                  "key": "renewable-energy-A2", 
                  "value": "A heat exchanger (heating only)" 
                }
              ] 
            }
          ], 
          "rating": { 
            "score": 15, 
            "band": "Strong", 
            "importance": null 
          } 
        },
        { 
          "key": "bird-data-type", 
          "answers": [
            { 
              "key": "bird-data-type", 
              "title": "What poultry management data will you automatically collect and store?", 
              "input": [
                { 
                  "key": "bird-data-type-A1", 
                  "value": "Bird performance data" 
                }, 
                { 
                  "key": "bird-data-type-A2", 
                  "value": "Body weight" 
                }
              ] 
            }
          ], 
          "rating": { 
            "score": 10, 
            "band": "Average", 
            "importance": null 
          } 
        }, 
        { 
          "key": "environmental-data-type", 
          "answers": [
            { "key": "environmental-data-type", 
            "title": "What additional environmental data will you automatically collect and store?", 
            "input": [
              { 
                "key": "environmental-data-type-A1", 
                "value": "Ammonia" 
              }, 
              { 
                "key": "environmental-data-type-A2", 
                "value": "Carbon monoxide" 
              }
            ] 
          }
        ], 
        "rating": { 
          "score": 10, 
          "band": "Strong", 
          "importance": null 
        } 
      }
    ], 
    "overallRating": { 
      "score": 116, 
      "band": "Weak" 
    } 
  }
}
module.exports = msgData

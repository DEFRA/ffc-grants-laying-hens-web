const commonFunctionsMock = (varList, returnType, utilsList = {}, valList = {}) => {
    return jest.mock('ffc-grants-common-functionality', () => ({
        session: {
          setYarValue: (request, key, value) => null,
          getYarValue: (request, key) => {
            if (varList[key]) return varList[key]
            else return returnType
          }
        },
        regex: {
            PROJECT_COST_REGEX: /^[1-9]\d*$/,
            SELECT_VARIABLE_TO_REPLACE: /{{_(.+?)_}}/ig,
            DELETE_POSTCODE_CHARS_REGEX: /[)(.\s-]*/g,
            MIN_2_LETTERS_TO_USE_SPECIAL_CHARACTER: /^[a-zA-Z]{2}.*/,
            NAME_ONLY_REGEX: /^[a-zA-Z,' -]*$/,
            EMAIL_REGEX: /^\w+([.-](\w+))*@[a-zA-Z0-9]+([_-][a-zA-Z0-9]+)*(\.[a-zA-Z]{2,5})+$/,
            CHARS_MIN_10: /^.{10,}$/,
            PHONE_REGEX: /^\+?[0-9[\s()\]-]{10,}$/,
            ADDRESS_REGEX: /^[a-zA-Z0-9' -]*$/,
            MIN_3_LETTERS: /^(.*[a-zA-Z]){3,}.*$/,
            ONLY_TEXT_REGEX: /^[a-zA-Z\s-]+$/,
            POSTCODE_REGEX: /^\s*[a-z]{1,2}\d[a-z\d]?\s*\d[a-z]{2}\s*$/i,
            WHOLE_NUMBER_REGEX: /^\d+$/,
            SBI_REGEX: /^(\d{9})$/
        },
        counties: {
          LIST_COUNTIES: ['Derbyshire', 'Leicestershire', 'Lincolnshire', 'Northamptonshire', 'Nottinghamshire', 'Rutland']
        },
        // in order to make sure page content is correct, the WHOLE answerOptions.getOptions function eneds to be here in mock.
        // alternative is rewriting every unit test file to test for if the model is corrcet in a completely different way and making getOptions mock return something different
        // to whoever needs to rewrite this mock (and those tests), good luck o7
        answerOptions: {
          getOptions: (data, question, conditionalHtml, request) => {
            if (question.type === 'input' || question.type === 'email' || question.type === 'tel') {
              const { yarKey, prefix, suffix, label, classes, inputmode, pattern } = question
              return {
                inputmode,
                pattern,
                classes,
                prefix,
                suffix,
                label,
                id: yarKey,
                name: yarKey,
                hint: question.hint,
                value: data || ''
              }
            } else if (question.type === 'multi-input') {
              const { allFields } = question
              let dataObject
              if (!data) {
                allFields.forEach(field => {
                  dataObject = {
                    ...dataObject,
                    [field.yarKey]: ''
                  }
                })
                data = dataObject
              }

              return allFields.map(field => {
                const { type, endFieldset } = field
                let fieldItems

                const { yarKey, prefix, suffix, label, classes, inputmode, pattern, answers, hint } = field

                let fieldItemsData = data[yarKey]

                switch (type) {
                  case 'sub-heading':
                    fieldItems = { text: field.text }
                    break
                  case 'text':

                    fieldItems = {
                      inputmode,
                      pattern,
                      classes,
                      prefix,
                      suffix,
                      label,
                      id: yarKey,
                      name: yarKey,
                      hint,
                      value: fieldItemsData || ''
                    }

                    break
                  case 'number':

                    fieldItems = {
                      inputmode,
                      pattern,
                      classes,
                      prefix,
                      suffix,
                      label,
                      id: yarKey,
                      name: yarKey,
                      hint,
                      value: fieldItemsData || ''
                    }
                    break
                  case 'email':
                    fieldItems = {
                      inputmode,
                      pattern,
                      classes,
                      prefix,
                      suffix,
                      label,
                      id: yarKey,
                      name: yarKey,
                      hint,
                      value: fieldItemsData || ''
                    }
                    break
                  case 'tel':
                    fieldItems = {
                      inputmode,
                      pattern,
                      classes,
                      prefix,
                      suffix,
                      label,
                      id: yarKey,
                      name: yarKey,
                      hint,
                      value: fieldItemsData || ''
                    }
                    break
                  case 'select':
                    fieldItems = {
                      classes: 'govuk-fieldset__legend--l',
                      label,
                      hint,
                      id: yarKey,
                      name: yarKey,
                      items: [
                        { text: 'Select an option', value: '' },
                        ...answers.map(selectValue => {
                          return {
                            value: selectValue,
                            text: selectValue,
                            selected: data === selectValue
                          }
                        })
                    
                      ]
                    }
                    break
                  default:

                      const itemsList = answers.map(answer => {
                      const { value, hint, text, conditional } = answer
                  
                      if (value === 'divider') {
                        return { divider: 'or' }
                      }
                  
                      if (!answer.text) {
                        return {
                          value,
                          text: value,
                          ...conditional ? { conditional: { html: conditionalHtml } } : {},
                          hint,
                          checked: typeof data === 'string' ? !!data && data === value : !!data && data.includes(value),
                          selected: data === value
                        }
                      }
                  
                      return {
                        value,
                        text,
                        conditional,
                        hint,
                        checked: typeof data === 'string' ? !!data && data === value : !!data && data.includes(value),
                        selected: data === value
                      }
                    })
      
                    fieldItems = {
                      classes,
                      hint,
                      id: yarKey,
                      name: yarKey,
                      fieldset: {
                        legend: {
                          text: title,
                          isPageHeading: true,
                          classes
                        }
                      },
                      items: itemsList
                    }
                    break
                }
            
                return {
                  type,
                  endFieldset,
                  ...fieldItems
                }
              })
 
              
            } else if (question.type === 'select') {
              const { yarKey, label, hint, answers, classes = 'govuk-fieldset__legend--l' } = question
  
              return {
                classes,
                label,
                hint,
                id: yarKey,
                name: yarKey,
                items: [
                  { text: 'Select an option', value: '' },
                  ...answers.map(selectValue => {
                    return {
                      value: selectValue,
                      text: selectValue,
                      selected: data === selectValue
                    }
                  })
              
                ]
              }
            } else {
              const { yarKey, title, hint, answers, classes = 'govuk-fieldset__legend--l' } = question
              const itemsList = answers.map(answer => {
                const { value, hint, text, conditional } = answer
            
                if (value === 'divider') {
                  return { divider: 'or' }
                }
            
                if (!answer.text) {
                  return {
                    value,
                    text: value,
                    ...conditional ? { conditional: { html: conditionalHtml } } : {},
                    hint,
                    checked: typeof data === 'string' ? !!data && data === value : !!data && data.includes(value),
                    selected: data === value
                  }
                }
            
                return {
                  value,
                  text,
                  conditional,
                  hint,
                  checked: typeof data === 'string' ? !!data && data === value : !!data && data.includes(value),
                  selected: data === value
                }
              })

              return {
                classes,
                hint,
                id: yarKey,
                name: yarKey,
                fieldset: {
                  legend: {
                    text: title,
                    isPageHeading: true,
                    classes
                  }
                },
                items: itemsList
              }
            }
          },
          setOptionsLabel: (data, answers, conditionalHtml) => {
            const itemsList = answers.map(answer => {
              const { value, hint, text, conditional } = answer
          
              if (value === 'divider') {
                return { divider: 'or' }
              }
          
              if (!answer.text) {
                return {
                  value,
                  text: value,
                  ...conditional ? { conditional: { html: conditionalHtml } } : {},
                  hint,
                  checked: typeof data === 'string' ? !!data && data === value : !!data && data.includes(value),
                  selected: data === value
                }
              }
          
              return {
                value,
                text,
                conditional,
                hint,
                checked: typeof data === 'string' ? !!data && data === value : !!data && data.includes(value),
                selected: data === value
              }
            })

            return itemsList
          }
        },
        utils: {
          getQuestionAnswer: (questionKey, answerKey, allQuestions) => {
            if (Object.keys(utilsList).includes(answerKey)) return utilsList[answerKey]
            else return null
          },
          getQuestionByKey: (questionKey, allQuestions) => {
            return {
              yarKey: 'testYarKey',
              answers: [
                {
                  key: 'testKey',
                  value: 'testValue'
                }
              ]
            }
          },
          allAnswersSelected: (questionKey, allQuestions) => null,
        },
        pageGuard: {
          guardPage: (request, guardData, startPageUrl, serviceEndDate, serviceEndTime, ALL_QUESTIONS) => false
    
        },
        errorHelpers: {
          validateAnswerField: (value, validationType, details, payload, ALL_QUESTIONS) => {
            if (valList[validationType]) return valList[validationType].return
            else return null
          },
          checkInputError: (validate, isconditionalAnswer, payload, yarKey, ALL_QUESTIONS) => {
            if (valList[yarKey]) return valList[yarKey]
            else return null
          }
        }
      }))
    }

module.exports = { commonFunctionsMock }
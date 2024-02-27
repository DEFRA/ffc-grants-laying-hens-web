export function validation () {
  let elements = document.querySelectorAll('input[type="checkbox"]')
  const nonEligibleOptions = ['None of the above', 'I will not monitor any poultry management data']

    if (elements) {
      const elementsArr = Array.from(elements)
      elementsArr.filter(el => nonEligibleOptions.includes(el.value)).forEach((element) => {
        element.addEventListener('change', (event) => {
          event.preventDefault()
    
          const remainingElements = elementsArr.filter(el => !nonEligibleOptions.includes(el.value))
          remainingElements.forEach((checkBox) => {
            checkBox.disabled = element.checked
            checkBox.checked = false
          })
        })
      
        // in case you back to this page
        if (element.checked) {
          const event = new Event('change')
          element.dispatchEvent(event)
        }
      })
    }
  }

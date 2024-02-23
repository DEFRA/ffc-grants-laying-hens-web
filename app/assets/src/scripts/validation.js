export function validation() {
  const elements = document.querySelectorAll('input[type="checkbox"]');

  if (elements) {
    elements.forEach(checkbox => {
      checkbox.addEventListener('change', function (event) {
        const value = event.target.value;
        console.log('value', value);
        
        if (value === 'None of the above' || value === 'I will not monitor any poultry management data') {
          const isChecked = event.target.checked;

          elements.forEach(otherCheckbox => {
            if (otherCheckbox !== event.target) {
              otherCheckbox.disabled = isChecked;
              otherCheckbox.checked = false;
            }
          });
        }
      });
    });

    // Initial check to handle page reload
    elements.forEach(checkbox => {
      if (checkbox.checked) {
        const changeEvent = new Event('change');
        checkbox.dispatchEvent(changeEvent);
      }
    });
  }
}

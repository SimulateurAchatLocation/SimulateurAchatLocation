document.addEventListener('DOMContentLoaded', () => {
    const sliders = document.querySelectorAll('.range-input');
  
    sliders.forEach(slider => {
        const sliderValue = slider.nextElementSibling;

        updateSliderValue(slider, sliderValue);
    
        slider.addEventListener('input', () => {
            updateSliderValue(slider, sliderValue);
        });
    });
  
    function updateSliderValue(slider, sliderValue) {
        const value = parseFloat(slider.value);
    
        if (slider.classList.contains('percentage-thumb') && value === 0) {
            slider.dataset.actualValue = 1e-9; 
            sliderValue.textContent = 0;
        } else {
            slider.dataset.actualValue = value;
            sliderValue.textContent = value;
        }
    }
});

document.addEventListener('DOMContentLoaded', () => {
  const retirement = document.getElementById('retirement-1');
  const over65 = document.getElementById('over-65-1');
  const disabled = document.getElementById('disabled-1');
  const standardDeduction = document.getElementById('standard-deduction-1');
  const actualExpensesCheckbox = document.getElementById('actual-expenses-checkbox-1');
  const actualExpensesInput = document.getElementById('actual-expenses-number-1');
  const singleParent = document.getElementById('single-parent');
  const widowed = document.getElementById('widowed');
  const secondTaxpayerRadios = document.querySelectorAll('input[name="has-second-taxpayer"]');

  const parentAlertDiv = document.createElement('div');
  parentAlertDiv.textContent = "Veuillez ajouter des personnes à charge pour être parent isolé.";
  parentAlertDiv.style.display = 'none';
  parentAlertDiv.style.color = 'red';
  parentAlertDiv.id = 'parent-alert';
  singleParent.parentElement.appendChild(parentAlertDiv); // ou adapte selon ta structure HTML

  function griserFraisReels(griser) {
    if (griser) {
      actualExpensesInput.disabled = true;
      actualExpensesInput.value = '';
    } else {
      actualExpensesInput.disabled = false;
    }
  }

  // --- Gestion Retraite ---
  retirement.addEventListener('change', () => {
    if (retirement.checked) {
      griserFraisReels(true);
      actualExpensesCheckbox.checked = false;
    }
  });

  // --- Gestion Abattement forfaitaire ---
  standardDeduction.addEventListener('change', () => {
    if (standardDeduction.checked) {
      griserFraisReels(true);
      actualExpensesCheckbox.checked = false;
    }
  });

  // --- Gestion Frais réels ---
  actualExpensesCheckbox.addEventListener('change', () => {
    if (actualExpensesCheckbox.checked) {
      standardDeduction.checked = false;
      retirement.checked = false;
      griserFraisReels(false);
    } else {
      // Si décoché manuellement, on re-grise si aucune autre condition ne dégrise
      griserFraisReels(true);
    }
  });

  // --- Gestion déclarant 2 ---
  secondTaxpayerRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selected = document.querySelector('input[name="has-second-taxpayer"]:checked');
      const isYes = selected && selected.value === 'yes';
      document.body.classList.toggle('has-deux-declarants', isYes); // adapte selon ta logique de maquette
    });
  });

  // --- Gestion Parent isolé / Veuf ---
  singleParent.addEventListener('change', () => {
    if (singleParent.checked) {
      widowed.checked = false;

      const hasDependents = checkHasDependents(); // à implémenter selon ton simulateur
      if (!hasDependents) {
        singleParent.checked = false;
        parentAlertDiv.style.display = 'block';
        setTimeout(() => {
          parentAlertDiv.style.display = 'none';
        }, 5000);
      }
    }
  });

  widowed.addEventListener('change', () => {
    if (widowed.checked) {
      singleParent.checked = false;
    }
  });

  // --- Initialisation à l'ouverture ---
  if (retirement.checked || standardDeduction.checked) {
    griserFraisReels(true);
  } else if (actualExpensesCheckbox.checked) {
    griserFraisReels(false);
  }

  // --- Fonction à personnaliser selon ton simulateur ---
  function checkHasDependents() {
    // Retourne true si au moins un champ enfants ou personne à charge > 0
    const fullCustody = parseInt(document.getElementById('children-full-custody')?.value || '0');
    const sharedCustody = parseInt(document.getElementById('children-shared-custody')?.value || '0');
    const disabledDependent = parseInt(document.getElementById('additional-disabled-dependent')?.value || '0');

    return (fullCustody + sharedCustody + disabledDependent) > 0;
  }
});


document.querySelectorAll('.range-slider').forEach(slider => {
  const rangeInput = slider.querySelector('input[type="range"]');
  const valueSpan = slider.querySelector('.range-value');

  // 1. Quand je déplace le slider → ça met à jour le span
  rangeInput.addEventListener('input', () => {
    valueSpan.textContent = rangeInput.value;
  });

  // 2. Quand je modifie le span (et quitte ou appuie sur Entrée) → ça met à jour le slider
  function updateSliderFromSpan() {
    const newValue = parseFloat(valueSpan.textContent.replace(/\s/g, '').replace(/[^\d.]/g, ''));
    if (!isNaN(newValue)) {
      // Clamp la valeur dans les bornes du slider
      const min = parseFloat(rangeInput.min);
      const max = parseFloat(rangeInput.max);
      const clampedValue = Math.min(Math.max(newValue, min), max);

      rangeInput.value = clampedValue;
      valueSpan.textContent = clampedValue;
    } else {
      // Revert to current value if invalid
      valueSpan.textContent = rangeInput.value;
    }
  }

  valueSpan.addEventListener('blur', updateSliderFromSpan);

  valueSpan.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      valueSpan.blur(); // force blur to trigger update
    }
  });
});
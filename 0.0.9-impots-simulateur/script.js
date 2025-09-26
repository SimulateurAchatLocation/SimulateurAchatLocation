/*document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.range-slider').forEach(sliderWrapper => {
    const rangeInput = sliderWrapper.querySelector('input[type="range"]');
    const valueDisplay = sliderWrapper.querySelector('.range-value');

    // ✅ Fonction commune : mise à jour du span ET éventuel dataset
    function updateValueDisplay(val) {
      const value = parseFloat(val);
      if (rangeInput.classList.contains('percentage-thumb') && value === 0) {
        rangeInput.dataset.actualValue = 1e-9;
        valueDisplay.textContent = 0;
      } else {
        rangeInput.dataset.actualValue = value;
        valueDisplay.textContent = value;
      }
    }

    // 🔁 1. Slider → Span
    rangeInput.addEventListener('input', () => {
      updateValueDisplay(rangeInput.value);
      runAppropriateSimulation(); // appel calcul en direct
    });

    // 🔁 2. Span → Slider (au blur ou Enter)
    function updateSliderFromSpan() {
      const newValue = parseFloat(valueDisplay.textContent.replace(/\s/g, '').replace(/[^\d.]/g, ''));
      if (!isNaN(newValue)) {
        const min = parseFloat(rangeInput.min);
        const max = parseFloat(rangeInput.max);
        const clampedValue = Math.min(Math.max(newValue, min), max);

        rangeInput.value = clampedValue;
        updateValueDisplay(clampedValue);
        runAppropriateSimulation(); // appel calcul en direct
      } else {
        // Valeur invalide : on remet à jour avec la valeur actuelle
        updateValueDisplay(rangeInput.value);
      }
    }

    valueDisplay.addEventListener('blur', updateSliderFromSpan);
    valueDisplay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        valueDisplay.blur(); // force blur → déclenche update
      }
    });

    // Initialisation à la valeur actuelle
    updateValueDisplay(rangeInput.value);
  });
});*/

/*document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.range-slider').forEach(sliderWrapper => {
    const rangeInput = sliderWrapper.querySelector('input[type="range"]');
    const valueDisplay = sliderWrapper.querySelector('.range-value');

    // ✅ Met à jour le span quand on bouge le slider
    rangeInput.addEventListener('input', () => {
      const value = parseFloat(rangeInput.value);
      valueDisplay.textContent = isNaN(value) ? '' : value;
      runAppropriateSimulation();
    });

    // ✅ Met à jour le slider ET le max si la valeur dépasse
    function updateSliderFromSpan() {
      const raw = valueDisplay.textContent;
      const newValue = parseFloat(raw.replace(/\s/g, '').replace(/[^\d.]/g, ''));

      if (!isNaN(newValue)) {
        // Si valeur > max, on augmente dynamiquement le max
        const currentMax = parseFloat(rangeInput.max);
        if (newValue > currentMax) {
          rangeInput.max = newValue;
        }

        rangeInput.value = newValue;

        // Déclenche manuellement l'événement 'input' pour mise à jour
        const event = new Event('input', { bubbles: true });
        rangeInput.dispatchEvent(event);
      } else {
        // Valeur invalide → reset sur valeur actuelle
        valueDisplay.textContent = rangeInput.value;
      }
    }

    // Blur = sortie du champ → mise à jour slider + calcul
    valueDisplay.addEventListener('blur', updateSliderFromSpan);

    // Entrée = mise à jour immédiate
    valueDisplay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        valueDisplay.blur();
      }
    });

    // Initialisation
    valueDisplay.textContent = rangeInput.value;
  });
});*/

/*document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.range-slider').forEach(sliderWrapper => {
    const rangeInput = sliderWrapper.querySelector('input[type="range"]');
    const valueDisplay = sliderWrapper.querySelector('.range-value');

    // Valeur réelle utilisée dans les calculs
    let currentValue = parseFloat(rangeInput.value);

    // 🔁 1. Slider → Span (standard)
    rangeInput.addEventListener('input', () => {
      currentValue = parseFloat(rangeInput.value);
      valueDisplay.textContent = currentValue;
      runAppropriateSimulation(); // appel du simulateur en direct
    });

    // 🔁 2. Span → Slider (au blur ou Enter) même si > max
    function updateFromSpan() {
      const raw = valueDisplay.textContent.replace(/\s/g, '').replace(/[^\d.]/g, '');
      const parsed = parseFloat(raw);

      if (!isNaN(parsed)) {
        currentValue = parsed;

        // On met à jour visuellement le slider à sa position max
        const max = parseFloat(rangeInput.max);
        rangeInput.value = Math.min(parsed, max); // Positionne le curseur
        valueDisplay.textContent = parsed;

        runAppropriateSimulation();
      } else {
        // En cas de valeur invalide : reset
        valueDisplay.textContent = currentValue;
      }
    }

    valueDisplay.addEventListener('blur', updateFromSpan);
    valueDisplay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        valueDisplay.blur(); // déclenche updateFromSpan
      }
    });

    // Initialisation
    valueDisplay.textContent = currentValue;
  });
});*/


document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.range-slider').forEach(sliderWrapper => {
    const rangeInput = sliderWrapper.querySelector('input[type="range"]');
    const valueDisplay = sliderWrapper.querySelector('.range-value');

    // Initialisation : stocke la valeur réelle dans le dataset
    const initialValue = parseFloat(rangeInput.value);
    rangeInput.dataset.actualValue = initialValue;
    valueDisplay.textContent = initialValue;

    // 🔁 1. Slider → Span + dataset
    rangeInput.addEventListener('input', () => {
      const value = parseFloat(rangeInput.value);
      rangeInput.dataset.actualValue = value;
      valueDisplay.textContent = value;
      runAppropriateSimulation();
    });

    // 🔁 2. Span → Slider + dataset (même si > max)
    function updateFromSpan() {
      const raw = valueDisplay.textContent.replace(/\s/g, '').replace(/[^\d.]/g, '');
      const parsed = parseFloat(raw);

      if (!isNaN(parsed)) {
        rangeInput.dataset.actualValue = parsed;

        // Met à jour visuellement le slider sans bloquer la valeur réelle
        const max = parseFloat(rangeInput.max);
        rangeInput.value = Math.min(parsed, max); // Position du curseur
        valueDisplay.textContent = parsed;

        runAppropriateSimulation();
      } else {
        // Reset à la dernière valeur correcte
        valueDisplay.textContent = rangeInput.dataset.actualValue;
      }
    }

    valueDisplay.addEventListener('blur', updateFromSpan);
    valueDisplay.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        valueDisplay.blur();
      }
    });
  });
});


document.addEventListener('DOMContentLoaded', () => {
  // IDs statiques
  const singleParent = document.getElementById('single-parent');
  const widowed = document.getElementById('widowed');
  const secondTaxpayerRadios = document.querySelectorAll('input[name="has-second-taxpayer"]');

  // Création de l’alerte parent isolé
  /*const parentAlertDiv = document.createElement('div');
  parentAlertDiv.textContent = "Veuillez ajouter des personnes à charge pour être parent isolé.";
  parentAlertDiv.style.display = 'none';
  parentAlertDiv.style.color = 'red';
  parentAlertDiv.id = 'parent-alert';
  singleParent.parentElement.appendChild(parentAlertDiv);*/

  // Applique toutes les logiques conditionnelles à un déclarant
  function applyConditionsForDeclarant(num) {
    const retirement = document.getElementById(`retirement-${num}`);
    const over65 = document.getElementById(`over-65-${num}`);
    const disabled = document.getElementById(`disabled-${num}`);
    const standardDeduction = document.getElementById(`standard-deduction-${num}`);
    const actualExpensesCheckbox = document.getElementById(`actual-expenses-checkbox-${num}`);
    const actualExpesensInputWrapper = document.getElementById(`actual-expenses-wrapper-${num}`);
    const actualExpensesInput = document.getElementById(`actual-expenses-number-${num}`);

    // Fonction pour griser / dégriser frais réels
    function griserFraisReels(griser) {
      if (griser) {
        actualExpensesInput.disabled = true;
        actualExpensesInput.value = '';
      } else {
        actualExpensesInput.disabled = false;
      }
    }

    // --- Logiques conditionnelles ---
    retirement.addEventListener('change', () => {
      if (retirement.checked) {
        griserFraisReels(true);
        standardDeduction.checked = true;
        actualExpensesCheckbox.checked = false;
        actualExpesensInputWrapper.classList.add('is-disabled');
        actualExpensesInput.classList.add('actual-expenses-disabled');
      }
    });

    standardDeduction.addEventListener('change', () => {
      if (standardDeduction.checked) {
        griserFraisReels(true);
        actualExpensesCheckbox.checked = false;
        actualExpesensInputWrapper.classList.add('is-disabled');
        actualExpensesInput.classList.add('actual-expenses-disabled');
      }
    });

    actualExpensesCheckbox.addEventListener('change', () => {
      if (actualExpensesCheckbox.checked) {
        standardDeduction.checked = false;
        retirement.checked = false;
        griserFraisReels(false);
        actualExpesensInputWrapper.classList.remove('is-disabled');
        actualExpensesInput.classList.remove('actual-expenses-disabled');
      } else {
        griserFraisReels(true);
        actualExpesensInputWrapper.classList.add('is-disabled');
        actualExpensesInput.classList.add('actual-expenses-disabled');
      }
    });

    // Initialiser le champ correctement à l’ouverture
    if (retirement.checked || standardDeduction.checked) {
      griserFraisReels(true);
      actualExpesensInputWrapper.classList.add('is-disabled');
      actualExpensesInput.classList.add('actual-expenses-disabled');
    } else if (actualExpensesCheckbox.checked) {
      griserFraisReels(false);
      actualExpesensInputWrapper.classList.remove('is-disabled');
      actualExpensesInput.classList.remove('actual-expenses-disabled');
    }
  }

  // Exécute les conditions pour le déclarant 1
  applyConditionsForDeclarant(1);

  // Gestion déclarant 2 : on applique les logiques si "Oui" est coché
  secondTaxpayerRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const selected = document.querySelector('input[name="has-second-taxpayer"]:checked');
      if (selected.value === 'yes') {
        document.getElementById('declarant-2-inputs').style.display = 'block';
        document.getElementById('declarant-2-result').style.display = 'block';
        document.getElementById('declarant-1-result').style.display = 'block';
        document.querySelectorAll('.is-quotient').forEach((element) => {
          element.style.display = 'none';
        });
        singleParent.checked = false;
        widowed.checked = false;
        document.querySelector('.is-single-widow').style.display = 'none';
        applyConditionsForDeclarant(2);
      } else {
        document.getElementById('declarant-2-inputs').style.display = 'none';
        document.getElementById('declarant-2-result').style.display = 'none';
        document.getElementById('declarant-1-result').style.display = 'none';
        document.querySelectorAll('.is-quotient').forEach((element) => {
          element.style.display = 'flex';
        });
        document.querySelector('.is-single-widow').style.display = 'grid';
        applyConditionsForDeclarant(1);
      }
    });
  });

  // --- Parent isolé vs veuf ---
  /* singleParent.addEventListener('change', () => {
    if (singleParent.checked) {
      widowed.checked = false;
      document.querySelector('.simulator_parent-isole-warning-text').style.display = 'none';

      const hasDependents = checkHasDependents();
      if (!hasDependents) {
        singleParent.checked = false;
        document.querySelector('.simulator_parent-isole-warning-text').style.display = 'block';
        // parentAlertDiv.style.display = 'block';
        setTimeout(() => {
          // parentAlertDiv.style.display = 'none';
          document.querySelector('.simulator_parent-isole-warning-text').style.display = 'none';
        }, 5000);
      }
    }
  });

  widowed.addEventListener('change', () => {
    if (widowed.checked) {
      singleParent.checked = false;
    }
  });

  // Vérifie si au moins une personne à charge est présente (enfants ou personnes invalides)
  function checkHasDependents() {
    const ids = [
      'children-full-custody',
      'children-shared-custody'
    ];

    return ids.some(id => {
      const el = document.getElementById(id);
      return el && parseInt(el.value || '0') > 0;
    });
  }*/

  // --- Vérifie s'il y a au moins un enfant/personne à charge ---
  function checkHasDependents() {
    const ids = [
      'children-full-custody',
      'children-shared-custody',
      'disabled-full-custody-children',
      'disabled-shared-custody-children',
      'additional-disabled-dependent'
    ];

    return ids.some(id => {
      const el = document.getElementById(id);
      const value = parseFloat(el?.dataset.actualValue || el?.value || '0');
      return value > 0;
    });
  }

  // --- Gestion des cases "parent isolé" et "veuf" ---
  singleParent.addEventListener('change', () => {
    if (singleParent.checked) {
      // Empêche de cocher "parent isolé" si "veuf" est coché
      widowed.checked = false;

      // Vérifie qu’il y a bien une personne à charge
      const hasDependents = checkHasDependents();
      if (!hasDependents) {
        singleParent.checked = false;
        const warning = document.querySelector('.simulator_parent-isole-warning-text');
        warning.style.display = 'block';
        setTimeout(() => warning.style.display = 'none', 5000);
      }
    }
  });

  widowed.addEventListener('change', () => {
    if (widowed.checked) {
      singleParent.checked = false;
    }
  });

  // --- Sur modification d’un slider enfants, on revérifie que "parent isolé" reste valide ---
  const childSliders = [
    'children-full-custody',
    'children-shared-custody',
    'disabled-full-custody-children',
    'disabled-shared-custody-children',
    'additional-disabled-dependent'
  ];

  childSliders.forEach(id => {
    const slider = document.getElementById(id);
    if (slider) {
      slider.addEventListener('input', () => {
        const hasDependents = checkHasDependents();
        if (!hasDependents && singleParent.checked) {
          singleParent.checked = false;
          const warning = document.querySelector('.simulator_parent-isole-warning-text');
          warning.style.display = 'block';
          setTimeout(() => warning.style.display = 'none', 5000);
        }
      });
    }
  });

});

function syncChildDisabilities() {
  const full = document.getElementById('children-full-custody');
  const fullDisabled = document.getElementById('disabled-full-custody-children');
  const shared = document.getElementById('children-shared-custody');
  const sharedDisabled = document.getElementById('disabled-shared-custody-children');

  function clampDisabled(disabledInput, childInput) {
    const childVal = parseInt(childInput.value) || 0;
    let disabledVal = parseInt(disabledInput.value) || 0;

    disabledInput.max = childVal;

    if (disabledVal > childVal) {
      disabledInput.value = childVal;
      disabledVal = childVal;
    }
  }

  const inputs = [full, fullDisabled, shared, sharedDisabled];
  inputs.forEach(input => {
    input.addEventListener('input', () => {
      clampDisabled(fullDisabled, full);
      clampDisabled(sharedDisabled, shared);
      runAppropriateSimulation(); // pour recalculer en direct si ça modifie les parts
    });
  });

  // Initial clamp
  clampDisabled(fullDisabled, full);
  clampDisabled(sharedDisabled, shared);
}

syncChildDisabilities();

/*const secondTaxpayerRadios = document.querySelectorAll('input[name="has-second-taxpayer"]');

secondTaxpayerRadios.forEach(radio => {
  radio.addEventListener('change', () => {
    const selected = document.querySelector('input[name="has-second-taxpayer"]:checked');
    if (selected.value === 'yes') {
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        ['input', 'change', 'blur', 'keyup'].forEach(event => {
          input.addEventListener(event, runTaxSimulationTwo);
        });
      });

      runTaxSimulationTwo(); // initialisation au chargement
    } else if (selected.value === 'no') {
      const inputs = document.querySelectorAll('input');
      inputs.forEach(input => {
        ['input', 'change', 'blur', 'keyup'].forEach(event => {
          input.addEventListener(event, runTaxSimulationOne);
        });
      });

      runTaxSimulationOne(); // initialisation au chargement
    }
  });
});*/


document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('input');

  inputs.forEach(input => {
    ['input', 'change', 'blur', 'keyup'].forEach(event => {
      input.addEventListener(event, runAppropriateSimulation);
    });
  });

  const secondTaxpayerRadios = document.querySelectorAll('input[name="has-second-taxpayer"]');
  secondTaxpayerRadios.forEach(radio => {
    radio.addEventListener('change', runAppropriateSimulation);
  });

  runAppropriateSimulation(); // initialisation
});

function hasSecondTaxpayer() {
  const selected = document.querySelector('input[name="has-second-taxpayer"]:checked');
  return selected && selected.value === 'yes';
}

function runAppropriateSimulation() {
  if (hasSecondTaxpayer()) {
    runTaxSimulationTwo();
  } else {
    runTaxSimulationOne();
  }
}

// Barème de l’impôt sur le revenu
function calculateTax(revenue) {
  if (revenue <= 11497) return 0;
  else if (revenue <= 29315) return (revenue - 11497) * 0.11;
  else if (revenue <= 83823) return (revenue - 29315) * 0.30 + (29315 - 11497) * 0.11;
  else if (revenue <= 180294) return (revenue - 83823) * 0.41 + (83823 - 29315) * 0.30 + (29315 - 11497) * 0.11;
  else return (revenue - 180294) * 0.45 + (180294 - 83823) * 0.41 + (83823 - 29315) * 0.30 + (29315 - 11497) * 0.11;
}

runAppropriateSimulation(); // initialisation au chargement

const inputIds = [
  'actual-expenses-number-1',
  'income-deduction-1',
  'tax-reduction-1',
  'tax-credit-1',
  'actual-expenses-number-2',
  'income-deduction-2',
  'tax-reduction-2',
  'tax-credit-2'
];

inputIds.forEach(id => {
  const input = document.getElementById(id);
  if (input) {
    input.addEventListener('input', () => {
      const value = parseFloat(input.value);
      if (value < 0) {
        input.value = 0;
      }
    });
  }
});



// ----------------------------
// SIMULATEUR D'IMPÔT (1 déclarant)
// ----------------------------

/*document.addEventListener('DOMContentLoaded', () => {
  const fields = [
    'net-income-1', 'rental-income-1', 'actual-expenses-number-1',
    'income-deduction-1', 'tax-reduction-1', 'tax-credit-1',
    'children-full-custody', 'disabled-full-custody-children',
    'children-shared-custody', 'disabled-shared-custody-children',
    'additional-disabled-dependent',
    'retirement-1', 'standard-deduction-1', 'actual-expenses-checkbox-1',
    'over-65-1', 'disabled-1', 'single-parent', 'widowed'
  ];

  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', runTaxSimulationOne);
      el.addEventListener('change', runTaxSimulationOne);
    }
  });

  runTaxSimulationOne(); // Run once at load
});*/

function runTaxSimulationOne() {
  // Étape 1 : Récupération des champs
  const getValue = id => parseFloat(document.getElementById(id)?.value || '0');
  const getActualValue = id => parseFloat(document.getElementById(id)?.dataset.actualValue || '0');
  const isChecked = id => document.getElementById(id)?.checked || false;

  const Revenu = getActualValue('net-income-1');
  const RevenuF = getActualValue('rental-income-1');
  const FraisR = getValue('actual-expenses-number-1');
  const Déduction = getValue('income-deduction-1');
  const Réduction = getValue('tax-reduction-1');
  const Crédit = getValue('tax-credit-1');

  const EnfantE = getActualValue('children-full-custody');
  const EnfantEH = getActualValue('disabled-full-custody-children');
  const EnfantA = getActualValue('children-shared-custody');
  const EnfantAH = getActualValue('disabled-shared-custody-children');
  const Invalide = getActualValue('additional-disabled-dependent');

  const CaseInvalide = isChecked('disabled-1') ? 0.5 : 0;
  const ParenI = isChecked('single-parent') ? 1 : 0;
  const Veuf = isChecked('widowed') ? 1 : 0;
  const Retraite = isChecked('retirement-1');
  const Abattement = isChecked('standard-deduction-1');
  const FraisReelsCoche = isChecked('actual-expenses-checkbox-1');
  const Over65 = isChecked('over-65-1');

  // Étape 2 : Revenu après abattement / frais réels
  let RevenuSR = Revenu;
  if (FraisReelsCoche) {
    RevenuSR = Revenu - FraisR;
  } else if (Abattement && Retraite) {
    RevenuSR = Revenu * 0.1 <= 450 ? Revenu - 450 : Math.max(Revenu * 0.9, Revenu - 4399);
  } else if (Abattement && !Retraite) {
    RevenuSR = Revenu * 0.1 <= 504 ? Revenu - 504 : Math.max(Revenu * 0.9, Revenu - 14426);
  }

  // Étape 3 : Revenu net global
  const RevenuNetGlobal = RevenuSR + RevenuF - Déduction;

  // Étape 4 : AbattementS
  let AbattementS = 0;
  if (Over65 || CaseInvalide > 0) {
    if (RevenuNetGlobal <= 17510) {
      AbattementS = 2796;
    } else if (RevenuNetGlobal <= 28170 && RevenuNetGlobal > 17510) {
      AbattementS = 1398;
    } else {
      AbattementS = 0;
    }
  }

  // Étape 5 : Rimposable
  const Rimposable = Math.max(Math.ceil(RevenuNetGlobal - AbattementS), 0);

  // Étape 6 : RFR
  const RFR = Math.max(Math.ceil(RevenuSR + RevenuF - AbattementS), 0);

  // Étape 7 : Parts fiscales
  let ParentIValue = 0;
  if (ParenI && EnfantA === 1 && EnfantE === 0 && Invalide === 0) {
    ParentIValue = 0.25;
  } else if (ParenI) {
    ParentIValue = 0.5;
  } else {
    ParentIValue = 0;
  }

  const VeufValue = Veuf && (EnfantE + EnfantA + Invalide > 0) ? 1 : 0;

  // let Parts = 1 + ParentIValue + VeufValue + CaseInvalide;
  let Parts = ParentIValue + VeufValue + CaseInvalide;
  const enfantsTotal = EnfantE + Invalide;
  const enfantsHand = EnfantEH + EnfantAH;

  if (enfantsTotal >= 2) {
    Parts += 1.5 * Invalide + 0.5 * (EnfantEH + EnfantA) + 0.25 * EnfantAH + EnfantE;
  } else if (enfantsTotal === 1 && EnfantA > 0) {
    // Parts += 1.25 + enfantsTotal + EnfantAH * 0.25;
    Parts += 1.25 + (EnfantEH + Invalide + EnfantA) * 0.5 + EnfantAH * 0.25;
  } else if (enfantsTotal === 1 && EnfantA === 0) {
    // Parts += 1.5 + enfantsHand * 0.25;
    Parts += 1.5 + (EnfantEH + Invalide) * 0.5 + EnfantAH * 0.25;
  } else if (enfantsTotal === 0 && EnfantA > 1) {
    // Parts += 0.5 + enfantsTotal + EnfantAH * 0.25;
    Parts += 0.5 + (EnfantEH + Invalide + EnfantA) * 0.5 + EnfantAH * 0.25;
  } else if (enfantsTotal === 0 && EnfantA < 2) {
    // Parts += (enfantsHand + EnfantA) * 0.25;
    Parts += 1 + (EnfantEH + Invalide) * 0.5 + (EnfantAH + EnfantA) * 0.25;
  }

  // Étape 8 : Quotient
  const quotient = Rimposable / Parts;

  // Étape 9 : Impôt intermédiaire
  const impotQuotient = calculateTax(quotient);
  const ImpotIntermediaire = impotQuotient * Parts;

  // Étape 10 : Plafonnement
  const plafonnement = Math.min(
    2 * 1791 * (Parts - 1) +
    (2 * CaseInvalide + EnfantEH + EnfantA / 2 + Invalide) * 1785 +
    ParentIValue * 642 +
    VeufValue * 1993,
    calculateTax(Rimposable) - ImpotIntermediaire
  );

  // Étape 11 : Impôt après plafonnement
  // const ImpotApresPlaf = calculateTax(Rimposable) - plafonnement;
  // const ImpotApresPlaf = Math.ceil(calculateTax(Rimposable) - plafonnement);
  // console.log('ImpotApresPlaf : ' + ImpotApresPlaf);

  // Étape 12 : Décote
  // const decote = ImpotApresPlaf <= 1964 ? -Math.min(889 + ImpotApresPlaf * 0.4525, 0) : 0;
  // const decote = ImpotApresPlaf <= 1964 ? -Math.min(889 - ImpotApresPlaf * 0.4525, 0) : 0;
  // console.log('decote : ' + decote);

  // Étape 11 : Impôt après plafonnement
  const ImpotApresPlafRaw = calculateTax(Rimposable) - plafonnement;
  let ImpotApresPlaf = Math.ceil(ImpotApresPlafRaw);

  // Étape 12 : Décote
  // let decote = ImpotApresPlafRaw <= 1964 ? Math.max(889 - ImpotApresPlafRaw * 0.4525, 0) : 0;
  let decote = ImpotApresPlafRaw <= 1964 ? Math.max(889 - ImpotApresPlafRaw * 0.4525, 0) : 0;
  // const decote = ImpotApresPlaf <= 1964 ? -Math.min(889 + ImpotApresPlaf * 0.4525, 0) : 0;

  // Étape 13 : Réduction min
  // const reductionMin = Math.min(ImpotApresPlaf - decote, Réduction);
  let reductionMin = Math.min(ImpotApresPlaf + decote, Réduction);

  // Étape 14 : Hauts revenus
  let HautsRevenus = 0;
  if (RFR > 250000 && RFR < 500001) {
    HautsRevenus = (RFR - 250001) * 0.03;
  } else if (RFR > 500000) {
    HautsRevenus = (RFR - 500000) * 0.04;
  }

  // Étape 15 : Prélèvements sociaux fonciers
  let PrelevSociauxFoncier = RevenuF * 0.172;

  // Étape 16 : Impôt final
  // const Impot = Math.ceil(ImpotApresPlaf + decote + reductionMin - Crédit + HautsRevenus + PrelevSociauxFoncier);
  // const Impot = Math.ceil(ImpotApresPlaf - decote - reductionMin - Crédit + HautsRevenus + PrelevSociauxFoncier);
  /*const Impot = Math.max(
    0,
    Math.ceil(ImpotApresPlaf - decote - reductionMin - Crédit + HautsRevenus + PrelevSociauxFoncier)
  );*/

  let Impot = ImpotApresPlaf - decote - reductionMin - Crédit + HautsRevenus + PrelevSociauxFoncier;

  if (Impot <= 0) {
    ImpotApresPlaf = 0;
    decote = 0;
    reductionMin = 0;
    HautsRevenus = 0;
    PrelevSociauxFoncier = 0;
    if (Crédit === 0) {
      Impot = 0;
    } else {
      Impot = -Crédit;
    }
  }

  // Étape 17 : Taux
  const Taux = Revenu <= 0 ? 0 : Math.max(0, ((Impot / Revenu) * 100).toFixed(1));

  // Injection des résultats
  document.getElementById('household-taxable-reference-income').innerText = RFR.toLocaleString('fr-FR');
  document.getElementById('household-taxable-income').innerText = Rimposable.toLocaleString('fr-FR');
  document.getElementById('household-tax-amount').innerText = Number(Impot.toFixed(2)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });;
  document.getElementById('household-tax-rate').innerText = Taux.toLocaleString('fr-FR');
  document.getElementById('household-tax-shares').innerText = Parts.toFixed(2);
  document.getElementById('household-quotient').innerText = (Math.ceil(quotient)).toLocaleString('fr-FR');
  document.getElementById('household-tax-after-plafonnement').innerHTML = (Math.ceil(ImpotApresPlaf)).toLocaleString('fr-FR');
  document.getElementById('household-decote').innerHTML = (Math.ceil(decote)).toLocaleString('fr-FR');
  document.getElementById('household-tax-reduction-applied').innerHTML = reductionMin.toLocaleString('fr-FR');
  document.getElementById('household-tax-credit-applied').innerHTML = Crédit.toLocaleString('fr-FR');
  document.getElementById('household-high-income-contribution').innerHTML = HautsRevenus.toLocaleString('fr-FR');
  document.getElementById('household-social-contribution-realestate').innerHTML = PrelevSociauxFoncier.toLocaleString('fr-FR');
}


// ----------------------------
// SIMULATEUR D'IMPÔT (2 déclarants)
// ----------------------------

// Fonction appelée automatiquement à chaque changement
/*document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    ['input', 'change', 'blur', 'keyup'].forEach(event => {
      input.addEventListener(event, runTaxSimulationTwo);
    });
  });

  runTaxSimulationTwo(); // initialisation au chargement
});*/

/*function getNumber(id) {
  return parseFloat(document.getElementById(id)?.value || '0');
}*/

function getNumber(id) {
  const span = document.getElementById(id + '-value');
  const raw = span?.textContent?.replace(/\s/g, '').replace(/[^\d.]/g, '');
  const parsed = parseFloat(raw);
  return isNaN(parsed) ? 0 : parsed;
}


function isChecked(id) {
  return document.getElementById(id)?.checked || false;
}

function runTaxSimulationTwo() {
  // Récupération des données déclarant 1

  const getValue = id => parseFloat(document.getElementById(id)?.value || '0');
  const getActualValue = id => parseFloat(document.getElementById(id)?.dataset.actualValue || '0');

  const revenu1 = getActualValue('net-income-1');
  const revenuF1 = getActualValue('rental-income-1');
  const fraisR1 = getValue('actual-expenses-number-1');
  const deduction1 = getValue('income-deduction-1');
  const reduc1 = getValue('tax-reduction-1');
  const credit1 = getValue('tax-credit-1');
  const abattement1 = isChecked('standard-deduction-1');
  const retraite1 = isChecked('retirement-1');
  const fraisRCoche1 = isChecked('actual-expenses-checkbox-1');
  const Plus651 = isChecked('over-65-1');
  const caseInvalide1 = isChecked('disabled-1') ? 0.5 : 0;

  // Récupération des données déclarant 2
  const revenu2 = getActualValue('net-income-2');
  const revenuF2 = getActualValue('rental-income-2');
  const fraisR2 = getValue('actual-expenses-number-2');
  const deduction2 = getValue('income-deduction-2');
  const reduc2 = getValue('tax-reduction-2');
  const credit2 = getValue('tax-credit-2');
  const abattement2 = isChecked('standard-deduction-2');
  const retraite2 = isChecked('retirement-2');
  const fraisRCoche2 = isChecked('actual-expenses-checkbox-2');
  const Plus652 = isChecked('over-65-2');
  const caseInvalide2 = isChecked('disabled-2') ? 0.5 : 0;

  // Personnes à charge
  const EnfantE = getActualValue('children-full-custody');
  const EnfantEH = getActualValue('disabled-full-custody-children');
  const EnfantA = getActualValue('children-shared-custody');
  const EnfantAH = getActualValue('disabled-shared-custody-children');
  const Invalide = getActualValue('additional-disabled-dependent');
  const PI = isChecked('single-parent') ? 1 : 0;

  // RevenuSR
  let RS1 = revenu1;
  let RS2 = revenu2;

  if (fraisRCoche1) RS1 = revenu1 - fraisR1;
  else if (abattement1 && retraite1) RS1 = revenu1 * 0.1 <= 450 ? revenu1 - 450 : Math.max(revenu1 * 0.9, revenu1 - 4399);
  else if (abattement1 && !retraite1) RS1 = revenu1 * 0.1 <= 504 ? revenu1 - 504 : Math.max(revenu1 * 0.9, revenu1 - 14426);

  if (fraisRCoche2) RS2 = revenu2 - fraisR2;
  else if (abattement2 && retraite2) RS2 = revenu2 * 0.1 <= 450 ? revenu2 - 450 : Math.max(revenu2 * 0.9, revenu2 - 4399);
  else if (abattement2 && !retraite2) RS2 = revenu2 * 0.1 <= 504 ? revenu2 - 504 : Math.max(revenu2 * 0.9, revenu2 - 14426);

  // Revenu net global
  let revenuNet1 = RS1 + revenuF1 - deduction1;
  let revenuNet2 = RS2 + revenuF2 - deduction2;
  let revenuNetGlobal;

  /*if ((retraite1 && retraite2 && revenu1 < 4500 && revenu2 < 450) || ((revenu1 + revenu2) * 0.1 < 4399 && retraite1 && retraite2)) {
    revenuNetGlobal = revenu1 + revenu2 - 4399;
  } else {
    revenuNetGlobal = revenuNet1 + revenuNet2;
  }*/

  if ((retraite1 && retraite2 && revenu1 < 4500 && (450 + revenu2 * 0.1) > 4399) || (retraite1 && retraite2 && revenu2 < 4500 && (450 + revenu1 * 0.1) > 4399)) {
    revenuNetGlobal = revenu1 + revenu2 - 4399;
  } else {
    revenuNetGlobal = revenuNet1 + revenuNet2;
  }

  // AbattementS
  function getAbattement(R, plus65, ci) {
    if (plus65 || ci) {
      if (R <= 17510) return 2796;
      if (R <= 28170 && R > 17510) return 1398;
    }
    return 0;
  }

  const Ab1 = getAbattement(revenuNet1, Plus651, caseInvalide1);
  const Ab2 = getAbattement(revenuNet2, Plus652, caseInvalide2);

  const AbT = Ab1 + Ab2;

  function getAbattementTotal(revenuNetGlobal, plus65_1, plus65_2, ci_1, ci_2) {
    const eligible1 = plus65_1 || ci_1;
    const eligible2 = plus65_2 || ci_2;

    if (eligible1 && eligible2) {
      if (revenuNetGlobal <= 17510) return 2 * 2796;
      if (revenuNetGlobal <= 28170 && revenuNetGlobal > 17510) return 2 * 1398;
      return 0;
    }

    if (eligible1 || eligible2) {
      if (revenuNetGlobal <= 17510) return 2796;
      if (revenuNetGlobal <= 28170 && revenuNetGlobal > 17510) return 1398;
      return 0;
    }

    return 0;
  }

  const AbTotal = getAbattementTotal(revenuNetGlobal, Plus651, Plus652, caseInvalide1, caseInvalide2);


  // Rimposable
  const Rimpo1 = Math.max(revenuNet1 - Ab1, 0);
  const Rimpo2 = Math.max(revenuNet2 - Ab2, 0);
  const Rimpo = Math.max(revenuNetGlobal - AbTotal, 0);

  // RFR
  const RFR1 = Math.max(RS1 + revenuF1 - Ab1, 0);
  const RFR2 = Math.max(RS2 + revenuF2 - Ab2, 0);
  // const RFR = Math.max(revenuNet1 + revenuNet2 + deduction1 + deduction2 - AbTotal, 0);
  const RFR = Math.max(revenuNet1 + revenuNet2 + deduction1 + deduction2 - AbTotal, revenuNetGlobal + deduction1 + deduction2 - AbTotal, 0);

  // Parts fiscales
  // let Parts = 1 + caseInvalide1 + caseInvalide2;
  let Parts = caseInvalide1 + caseInvalide2;

  console.log('Parts : ' + Parts);
  console.log('caseInvalide1 : ' + caseInvalide1);
  console.log('caseInvalide2 : ' + caseInvalide2);

  const totalEnfants = EnfantE + Invalide;

  if (totalEnfants >= 2) {
    Parts += 1 + Invalide * 1.5 + (EnfantEH + EnfantA) * 0.5 + EnfantAH * 0.25 + EnfantE;
  } else if (totalEnfants === 1 && EnfantA > 0) {
    // Parts += 1.25 + EnfantEH * 0.5 + Invalide * 0.5 + EnfantA * 0.5 + EnfantAH * 0.25;
    Parts += 2.25 + (EnfantEH + Invalide + EnfantA) * 0.5 + EnfantAH * 0.25;
  } else if (totalEnfants === 1 && EnfantA === 0) {
    // Parts += 1.5 + (EnfantEH + Invalide) * 0.5 + EnfantAH * 0.25;
    Parts += 2.5 + (EnfantEH + Invalide) * 0.5 + EnfantAH * 0.25;
  } else if (totalEnfants === 0 && EnfantA > 1) {
    // Parts += 0.5 + (EnfantEH + Invalide + EnfantA) * 0.5 + EnfantAH * 0.25;
    Parts += 1.5 + (EnfantEH + Invalide + EnfantA) * 0.5 + EnfantAH * 0.25;
  } else if (totalEnfants === 0 && EnfantA < 2) {
    // Parts += (EnfantAH + EnfantA) * 0.25;
    Parts += 2 + (EnfantEH + Invalide) * 0.5 + (EnfantAH + EnfantA) * 0.25;
  }

  const Quotient = Rimpo / Parts;
  const ImpInter = calculateTax(Quotient) * Parts;
  /*const quotient1 = Rimpo1 / ((Parts - caseInvalide1 + caseInvalide2) * 0.5);
  const quotient2 = Rimpo2 / ((Parts - caseInvalide2 + caseInvalide1) * 0.5);
  const ImpInter1 = calculateTax(quotient1) * ((Parts - caseInvalide1 + caseInvalide2) * 0.5);
  const ImpInter2 = calculateTax(quotient2) * ((Parts - caseInvalide2 + caseInvalide1) * 0.5);*/
  const partsWithoutCI2 = Parts - caseInvalide2 + caseInvalide1;
  const partsWithoutCI1 = Parts - caseInvalide1 + caseInvalide2;

  const Rimposable1ParPart = Rimpo1 / (partsWithoutCI2 * 0.5);
  const Rimposable2ParPart = Rimpo2 / (partsWithoutCI1 * 0.5);

  const ImpotIntermediaire1 = calculateTax(Rimposable1ParPart) * (partsWithoutCI2 * 0.5);
  const ImpotIntermediaire2 = calculateTax(Rimposable2ParPart) * (partsWithoutCI1 * 0.5);

  // Plafonnement
  // const ImpBrut = calculateTax(Rimpo);
  const ImpBrut = calculateTax(Rimpo / 2) * 2;
  const Plaf = Math.min(
    2 * 1791 * (Parts - 2) + (2 * (caseInvalide1 + caseInvalide2) + EnfantEH + EnfantA / 2 + Invalide) * 1785,
    ImpBrut - ImpInter
  );

  // Plafonnement 1
  const Plaf1Base = 2 * 1791 * ((Parts - caseInvalide2 + caseInvalide1) * 0.5 - 1);
  const Plaf1Supp = (4 * caseInvalide1 + EnfantEH + EnfantAH / 2 + Invalide) * 1785 / 2;
  const Plaf1 = Math.min(
    Plaf1Base + Plaf1Supp,
    calculateTax(Rimpo1) - ImpotIntermediaire1
  );

  // Plafonnement 2
  const Plaf2Base = 2 * 1791 * ((Parts - caseInvalide1 + caseInvalide2) * 0.5 - 1);
  const Plaf2Supp = (4 * caseInvalide2 + EnfantEH + EnfantAH / 2 + Invalide) * 1785 / 2;
  const Plaf2 = Math.min(
    Plaf2Base + Plaf2Supp,
    calculateTax(Rimpo2) - ImpotIntermediaire2
  );

  // const ImpPlaf = ImpBrut - Plaf;
  // Impôt après plafonnement pour déclarant 1
  const ImpPlaf1 = calculateTax(Rimpo1) - Plaf1;

  // Impôt après plafonnement pour déclarant 2
  const ImpPlaf2 = calculateTax(Rimpo2) - Plaf2;

  // Impôt après plafonnement global
  let ImpPlaf = calculateTax(Rimpo / 2) * 2 - Plaf;


  // Décote
  // const Decote = ImpPlaf <= 3248 ? -Math.min(1470 - ImpPlaf * 0.4525, 0) : 0;
  let Decote = ImpPlaf <= 3248 ? Math.max(1470 - ImpPlaf * 0.4525, 0) : 0;

  // const Decote1 = ImpPlaf1 <= 1964 ? -Math.min(889 - ImpPlaf1 * 0.4525, 0) : 0;
  // const Decote2 = ImpPlaf2 <= 1964 ? -Math.min(889 - ImpPlaf2 * 0.4525, 0) : 0;
  const Decote1 = ImpPlaf1 <= 1964 ? Math.max(889 - ImpPlaf * 0.4525, 0) : 0;
  const Decote2 = ImpPlaf2 <= 1964 ? Math.max(889 - ImpPlaf * 0.4525, 0) : 0;


  // Réduction min
  // const RedMin1 = Math.min(ImpPlaf1 - Decote1, reduc1);
  // const RedMin2 = Math.min(ImpPlaf2 - Decote2, reduc2);
  // let RedMin = Math.min(ImpPlaf - Decote, reduc1 + reduc2);

  const RedMin1 = Math.min(ImpPlaf1 + Decote1, reduc1);
  const RedMin2 = Math.min(ImpPlaf2 + Decote2, reduc2);
  let RedMin = Math.min(ImpPlaf + Decote, reduc1 + reduc2);

  // Hauts revenus
  let HR = 0;
  if (RFR > 500000 && RFR < 1000001) HR = (RFR - 500001) * 0.03;
  else if (RFR >= 1000001) HR = (RFR - 1000000) * 0.04 + 15000;

  // Prélèvements sociaux
  const PF1 = revenuF1 * 0.172;
  const PF2 = revenuF2 * 0.172;
  let PF = PF1 + PF2;

  // Impôt final
  // const Impot = Math.ceil(ImpPlaf + Decote + RedMin - credit1 - credit2 + HR + PF);
  let Impot = ImpPlaf - Decote - RedMin - credit1 - credit2 + HR + PF;

  const Taux = revenu1 + revenu2 > 0 ? Math.max((Impot / (revenu1 + revenu2)) * 100, 0).toFixed(1) : '0';

  // Répartition entre déclarants
  // const Imp1 = Math.ceil((Impot * revenu1) / (revenu1 + revenu2));
  // const Imp2 = Impot - Imp1;
 /* const ImpotInter1 = Math.max(
    0,
    Math.ceil(ImpPlaf1 - Decote1 - RedMin1 - credit1 + HR * (revenu1 / (revenu1 + revenu2)) + PF1)
  );
  const ImpotInter2 = Math.max(
    0,
    Math.ceil(ImpPlaf2 - Decote2 - RedMin2 - credit2 + HR * (revenu2 / (revenu1 + revenu2)) + PF2)
  );*/

  const ImpotInter1 = ImpPlaf1 - Decote1 - RedMin1 - credit1 + HR * (revenu1 / (revenu1 + revenu2)) + PF1;
  const ImpotInter2 = ImpPlaf2 - Decote2 - RedMin2 - credit2 + HR * (revenu2 / (revenu1 + revenu2)) + PF2;


  // Calcul de la répartition de l’impôt entre chaque déclarant
  // const TauxI1 = revenu1 > 0 ? (ImpotInter1 / (ImpotInter1 + ImpotInter2)) * 100 : 0;
  // const TauxI2 = revenu2 > 0 ? (ImpotInter2 / (ImpotInter1 + ImpotInter2)) * 100 : 0;
  const TauxI1 = revenu1 > 0 ? (ImpotInter1 / (ImpotInter1 + ImpotInter2)) : 0;
  const TauxI2 = revenu2 > 0 ? (ImpotInter2 / (ImpotInter1 + ImpotInter2)) : 0;

  // const Taux1 = revenu1 > 0 ? (Imp1 / revenu1) * 100 : 0;
  // const Taux2 = revenu2 > 0 ? (Imp2 / revenu2) * 100 : 0;

  // Calcul final de l’impôt de chaque déclarant
  // const Impot1 = Math.max(0, Math.ceil(Impot * TauxI1));
  // const Impot2 = Math.max(0,Math.ceil(Impot * TauxI2));

  // const Impot1 = Math.max(0, Math.ceil(Impot * TauxI1));
  // const Impot2 = Math.max(0, Math.ceil(Impot * TauxI2));

  let Impot1 = Impot * TauxI1;
  let Impot2 = Impot * TauxI2;

  // Calcul du taux d’imposition de chaque déclarant
  // const Taux1 = Impot1 / revenu1;
  // const Taux2 = Impot2 / revenu2;
  const Taux1 = revenu1 > 0 ? Impot1 / revenu1 : 0;
  const Taux2 = revenu2 > 0 ? Impot2 / revenu2 : 0;

  let Taux1Pourcent = (Taux1 * 100).toFixed(1); // ex: 9.2%
  let Taux2Pourcent = (Taux2 * 100).toFixed(1);

  const credit = credit1 + credit2;

  if (Impot <= 0) {
    // Impot = credit1 - credit2;
    ImpPlaf = 0;
    Decote = 0;
    RedMin = 0;
    HR = 0;
    PF = 0;
    if (credit === 0) {
      Impot = 0;
    } else {
      Impot = -credit;
    }
  }

  if (Impot1 <= 0 || isNaN(Impot1)) {
    Impot1 = 0;
    Taux1Pourcent = 0;
  }
  if (Impot2 <= 0 || isNaN(Impot2)) {
    Impot2 = 0;
    Taux2Pourcent = 0;
  }

  // Résultats globaux
  // setResult('household-taxable-reference-income', RFR, { round: 'euro' });
  // setResult('household-taxable-income', Rimpo, { round: 'euro' });
  // setResult('household-tax-amount', Impot, { round: 'euro' });
  // setResult('household-tax-rate', Taux, { round: 'decimal' });
  // setResult('household-tax-shares', Parts, { round: 'decimal' });
  // setResult('household-quotient', Quotient, { round: 'euro' });

  // Résultats par déclarant
  // setResult('reference-taxable-income-1', Rimpo1, { round: 'euro' });
  // setResult('reference-taxable-income-2', Rimpo2, { round: 'euro' });
  // setResult('tax-amount-1', Impot1, { round: 'euro' });
  // setResult('tax-amount-2', Impot2, { round: 'euro' });
  // setResult('tax-rate-1', Taux1Pourcent, { round: 'decimal' });
  // setResult('tax-rate-2', Taux2Pourcent, { round: 'decimal' });

  // document.getElementById('household-taxable-reference-income').innerHTML = (Math.ceil(RFR)).toLocaleString('fr-FR');
  // setResult('household-taxable-reference-income', RFR);

  document.getElementById('household-taxable-reference-income').innerText = RFR.toLocaleString('fr-FR');
  document.getElementById('household-taxable-income').innerText = Rimpo.toLocaleString('fr-FR');
  document.getElementById('household-tax-amount').innerText = Number(Impot.toFixed(2)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });;
  document.getElementById('household-tax-rate').innerText = Taux.toLocaleString('fr-FR');
  document.getElementById('household-tax-shares').innerText = Parts.toFixed(2);
  document.getElementById('household-quotient').innerText = (Math.ceil(Quotient)).toLocaleString('fr-FR');
  document.getElementById('household-tax-after-plafonnement').innerHTML = (Math.ceil(ImpPlaf)).toLocaleString('fr-FR');
  document.getElementById('household-decote').innerHTML = (Math.ceil(Decote)).toLocaleString('fr-FR');
  document.getElementById('household-tax-reduction-applied').innerHTML = RedMin.toLocaleString('fr-FR');
  document.getElementById('household-tax-credit-applied').innerHTML = credit.toLocaleString('fr-FR');
  document.getElementById('household-high-income-contribution').innerHTML = HR.toLocaleString('fr-FR');
  document.getElementById('household-social-contribution-realestate').innerHTML = PF.toLocaleString('fr-FR');

  document.getElementById('reference-taxable-income-1').innerHTML = Rimpo1.toLocaleString('fr-FR');
  document.getElementById('reference-taxable-income-2').innerHTML = Rimpo2.toLocaleString('fr-FR');
  document.getElementById('tax-amount-1').innerHTML = Number(Impot1.toFixed(2)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('tax-amount-2').innerHTML = Number(Impot2.toFixed(2)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  document.getElementById('tax-rate-1').innerHTML = Taux1Pourcent.toLocaleString('fr-FR');
  document.getElementById('tax-rate-2').innerHTML = Taux2Pourcent.toLocaleString('fr-FR');
  
  // document.getElementById('household-decote').innerHTML = (Math.ceil(Decote)).toLocaleString('fr-FR');
  // document.getElementById('household-tax-reduction-applied').innerHTML = (Math.ceil(RedMin)).toLocaleString('fr-FR');
  // document.getElementById('household-tax-credit-applied').innerHTML = credit.toLocaleString('fr-FR');
  // document.getElementById('household-high-income-contribution').innerHTML = HR.toLocaleString('fr-FR');
  // document.getElementById('household-social-contribution-realestate').innerHTML = PF.toLocaleString('fr-FR');
}

function setResult(id, value) {
  document.getElementById(id).innerHTML = (Math.ceil(value)).toLocaleString('fr-FR');
}

/*function setResult(id, value, options = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  if (options.round === 'euro') value = Math.ceil(value);
  if (options.round === 'decimal') value = Math.round(value * 10) / 10;
  el.innerText = isNaN(value) ? '0' : value;
}*/
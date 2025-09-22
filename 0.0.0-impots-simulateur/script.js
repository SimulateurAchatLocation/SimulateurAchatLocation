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
  // IDs statiques
  const singleParent = document.getElementById('single-parent');
  const widowed = document.getElementById('widowed');
  const secondTaxpayerRadios = document.querySelectorAll('input[name="has-second-taxpayer"]');

  // Création de l’alerte parent isolé
  const parentAlertDiv = document.createElement('div');
  parentAlertDiv.textContent = "Veuillez ajouter des personnes à charge pour être parent isolé.";
  parentAlertDiv.style.display = 'none';
  parentAlertDiv.style.color = 'red';
  parentAlertDiv.id = 'parent-alert';
  singleParent.parentElement.appendChild(parentAlertDiv);

  // Applique toutes les logiques conditionnelles à un déclarant
  function applyConditionsForDeclarant(num) {
    const retirement = document.getElementById(`retirement-${num}`);
    const over65 = document.getElementById(`over-65-${num}`);
    const disabled = document.getElementById(`disabled-${num}`);
    const standardDeduction = document.getElementById(`standard-deduction-${num}`);
    const actualExpensesCheckbox = document.getElementById(`actual-expenses-checkbox-${num}`);
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
        actualExpensesCheckbox.checked = false;
      }
    });

    standardDeduction.addEventListener('change', () => {
      if (standardDeduction.checked) {
        griserFraisReels(true);
        actualExpensesCheckbox.checked = false;
      }
    });

    actualExpensesCheckbox.addEventListener('change', () => {
      if (actualExpensesCheckbox.checked) {
        standardDeduction.checked = false;
        retirement.checked = false;
        griserFraisReels(false);
      } else {
        griserFraisReels(true);
      }
    });

    // Initialiser le champ correctement à l’ouverture
    if (retirement.checked || standardDeduction.checked) {
      griserFraisReels(true);
    } else if (actualExpensesCheckbox.checked) {
      griserFraisReels(false);
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
        applyConditionsForDeclarant(2);
      } else {
        document.getElementById('declarant-2-inputs').style.display = 'none';
        document.getElementById('declarant-2-result').style.display = 'none';
      }
    });
  });

  // --- Parent isolé vs veuf ---
  singleParent.addEventListener('change', () => {
    if (singleParent.checked) {
      widowed.checked = false;

      const hasDependents = checkHasDependents();
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


// ----------------------------
// SIMULATEUR D'IMPÔT (1 déclarant)
// ----------------------------

document.addEventListener('DOMContentLoaded', () => {
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
      el.addEventListener('input', runTaxSimulation);
      el.addEventListener('change', runTaxSimulation);
    }
  });

  runTaxSimulation(); // Run once at load
});

function runTaxSimulation() {
  // Étape 1 : Récupération des champs
  const getValue = id => parseFloat(document.getElementById(id)?.value || '0');
  const isChecked = id => document.getElementById(id)?.checked || false;

  const Revenu = getValue('net-income-1');
  const RevenuF = getValue('rental-income-1');
  const FraisR = getValue('actual-expenses-number-1');
  const Déduction = getValue('income-deduction-1');
  const Réduction = getValue('tax-reduction-1');
  const Crédit = getValue('tax-credit-1');

  const EnfantE = getValue('children-full-custody');
  const EnfantEH = getValue('disabled-full-custody-children');
  const EnfantA = getValue('children-shared-custody');
  const EnfantAH = getValue('disabled-shared-custody-children');
  const Invalide = getValue('additional-disabled-dependent');

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
      AbattementS = 2769;
    } else if (RevenuNetGlobal <= 28170) {
      AbattementS = 1398;
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
  }

  const VeufValue = Veuf && (EnfantE + EnfantA + Invalide > 0) ? 1 : 0;

  let Parts = 1 + ParentIValue + VeufValue + CaseInvalide;
  const enfantsTotal = EnfantE + Invalide;
  const enfantsHand = EnfantEH + EnfantAH;

  if (enfantsTotal >= 2) {
    Parts += 1.5 * Invalide + 0.5 * (EnfantEH + EnfantA) + 0.25 * EnfantAH + EnfantE;
  } else if (enfantsTotal === 1 && EnfantA > 0) {
    Parts += 1.25 + enfantsTotal + EnfantAH * 0.25;
  } else if (enfantsTotal === 1 && EnfantA === 0) {
    Parts += 1.5 + enfantsHand * 0.25;
  } else if (enfantsTotal === 0 && EnfantA > 1) {
    Parts += 0.5 + enfantsTotal + EnfantAH * 0.25;
  } else if (enfantsTotal === 0 && EnfantA < 2) {
    Parts += (enfantsHand + EnfantA) * 0.25;
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
  const ImpotApresPlaf = calculateTax(Rimposable) - plafonnement;

  // Étape 12 : Décote
  const decote = ImpotApresPlaf <= 1964 ? Math.min(889 + ImpotApresPlaf * 0.4525, 0) : 0;

  // Étape 13 : Réduction min
  const reductionMin = Math.min(ImpotApresPlaf + decote, Réduction);

  // Étape 14 : Hauts revenus
  let HautsRevenus = 0;
  if (RFR > 250000 && RFR < 500001) {
    HautsRevenus = (RFR - 250001) * 0.03;
  } else if (RFR > 500000) {
    HautsRevenus = (RFR - 500001) * 0.04 + 7500;
  }

  // Étape 15 : Prélèvements sociaux fonciers
  const PrelevSociauxFoncier = RevenuF * 0.172;

  // Étape 16 : Impôt final
  const Impot = Math.ceil(ImpotApresPlaf + decote + reductionMin - Crédit + HautsRevenus + PrelevSociauxFoncier);

  // Étape 17 : Taux
  const Taux = Revenu <= 0 ? 0 : Math.max(0, ((Impot / Revenu) * 100).toFixed(1));

  // Injection des résultats
  document.getElementById('household-taxable-reference-income').innerText = RFR;
  document.getElementById('household-taxable-income').innerText = Rimposable;
  document.getElementById('household-tax-amount').innerText = Impot;
  document.getElementById('household-tax-rate').innerText = Taux;
  document.getElementById('household-tax-shares').innerText = Parts.toFixed(2);
  document.getElementById('household-quotient').innerText = Math.ceil(quotient);
}

// Barème de l’impôt sur le revenu
function calculateTax(revenue) {
  if (revenue <= 11497) return 0;
  else if (revenue <= 29315) return (revenue - 11497) * 0.11;
  else if (revenue <= 83823) return (revenue - 29315) * 0.30 + (29315 - 11497) * 0.11;
  else if (revenue <= 180294) return (revenue - 83823) * 0.41 + (83823 - 29315) * 0.30 + (29315 - 11497) * 0.11;
  else return (revenue - 180294) * 0.45 + (180294 - 83823) * 0.41 + (83823 - 29315) * 0.30 + (29315 - 11497) * 0.11;
}
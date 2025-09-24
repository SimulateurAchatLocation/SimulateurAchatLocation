document.addEventListener('DOMContentLoaded', () => {
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
      runTaxSimulation(); // pour recalculer en direct si ça modifie les parts
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
      el.addEventListener('input', runTaxSimulationOne);
      el.addEventListener('change', runTaxSimulationOne);
    }
  });

  runTaxSimulationOne(); // Run once at load
});

function runTaxSimulationOne() {
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
  // const Impot = Math.ceil(ImpotApresPlaf + decote + reductionMin - Crédit + HautsRevenus + PrelevSociauxFoncier);
  // const Impot = Math.ceil(ImpotApresPlaf - decote - reductionMin - Crédit + HautsRevenus + PrelevSociauxFoncier);
  const Impot = Math.max(
    0,
    Math.ceil(ImpotApresPlaf - decote - reductionMin - Crédit + HautsRevenus + PrelevSociauxFoncier)
  );

  // Étape 17 : Taux
  const Taux = Revenu <= 0 ? 0 : Math.max(0, ((Impot / Revenu) * 100).toFixed(1));

  // Injection des résultats
  document.getElementById('household-taxable-reference-income').innerText = RFR;
  document.getElementById('household-taxable-income').innerText = Rimposable;
  document.getElementById('household-tax-amount').innerText = Impot;
  document.getElementById('household-tax-rate').innerText = Taux;
  document.getElementById('household-tax-shares').innerText = Parts.toFixed(2);
  document.getElementById('household-quotient').innerText = Math.ceil(quotient);
  document.getElementById('household-tax-after-plafonnement').innerHTML = Math.ceil(ImpotApresPlaf);
  document.getElementById('household-decote').innerHTML = - Math.ceil(decote);
  document.getElementById('household-tax-reduction-applied').innerHTML = - Math.ceil(reductionMin);
  document.getElementById('household-tax-credit-applied').innerHTML = - Math.ceil(Crédit);
  document.getElementById('household-high-income-contribution').innerHTML = Math.ceil(HautsRevenus);
  document.getElementById('household-social-contribution-realestate').innerHTML = Math.ceil(PrelevSociauxFoncier);
}

// Barème de l’impôt sur le revenu
function calculateTax(revenue) {
  if (revenue <= 11497) return 0;
  else if (revenue <= 29315) return (revenue - 11497) * 0.11;
  else if (revenue <= 83823) return (revenue - 29315) * 0.30 + (29315 - 11497) * 0.11;
  else if (revenue <= 180294) return (revenue - 83823) * 0.41 + (83823 - 29315) * 0.30 + (29315 - 11497) * 0.11;
  else return (revenue - 180294) * 0.45 + (180294 - 83823) * 0.41 + (83823 - 29315) * 0.30 + (29315 - 11497) * 0.11;
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

function getNumber(id) {
  return parseFloat(document.getElementById(id)?.value || '0');
}

function isChecked(id) {
  return document.getElementById(id)?.checked || false;
}

function setResult(id, value, options = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  if (options.round === 'euro') value = Math.ceil(value);
  if (options.round === 'decimal') value = Math.round(value * 10) / 10;
  el.innerText = isNaN(value) ? '0' : value;
}

function runTaxSimulationTwo() {
  // Récupération des données déclarant 1
  const R1 = getNumber('net-income-1');
  const RF1 = getNumber('rental-income-1');
  const F1 = getNumber('actual-expenses-number-1');
  const D1 = getNumber('income-deduction-1');
  const Red1 = getNumber('tax-reduction-1');
  const C1 = getNumber('tax-credit-1');
  const A1 = isChecked('standard-deduction-1');
  const Ret1 = isChecked('retirement-1');
  const FR1 = isChecked('actual-expenses-checkbox-1');
  const Plus651 = isChecked('over-65-1');
  const CI1 = isChecked('disabled-1') ? 0.5 : 0;

  // Récupération des données déclarant 2
  const R2 = getNumber('net-income-2');
  const RF2 = getNumber('rental-income-2');
  const F2 = getNumber('actual-expenses-number-2');
  const D2 = getNumber('income-deduction-2');
  const Red2 = getNumber('tax-reduction-2');
  const C2 = getNumber('tax-credit-2');
  const A2 = isChecked('standard-deduction-2');
  const Ret2 = isChecked('retirement-2');
  const FR2 = isChecked('actual-expenses-checkbox-2');
  const Plus652 = isChecked('over-65-2');
  const CI2 = isChecked('disabled-2') ? 0.5 : 0;

  // Personnes à charge
  const EnfantE = getNumber('children-full-custody');
  const EnfantEH = getNumber('disabled-full-custody-children');
  const EnfantA = getNumber('children-shared-custody');
  const EnfantAH = getNumber('disabled-shared-custody-children');
  const Invalide = getNumber('additional-disabled-dependent');
  const PI = isChecked('single-parent') ? 1 : 0;

  // RevenuSR
  let RS1 = R1;
  let RS2 = R2;

  if (FR1) RS1 = R1 - F1;
  else if (A1 && Ret1) RS1 = R1 * 0.1 <= 450 ? R1 - 450 : Math.max(R1 * 0.9, R1 - 4399);
  else if (A1 && !Ret1) RS1 = R1 * 0.1 <= 504 ? R1 - 504 : Math.max(R1 * 0.9, R1 - 14426);

  if (FR2) RS2 = R2 - F2;
  else if (A2 && Ret2) RS2 = R2 * 0.1 <= 450 ? R2 - 450 : Math.max(R2 * 0.9, R2 - 4399);
  else if (A2 && !Ret2) RS2 = R2 * 0.1 <= 504 ? R2 - 504 : Math.max(R2 * 0.9, R2 - 14426);

  // Revenu net global
  let RNet1 = RS1 + RF1 - D1;
  let RNet2 = RS2 + RF2 - D2;

  if ((Ret1 && Ret2 && R1 < 450 && R2 < 450) || ((R1 + R2) * 0.1 < 4399 && Ret1 && Ret2)) {
    var RNet = R1 + R2 - 4399;
  } else {
    var RNet = RNet1 + RNet2;
  }

  // AbattementS
  function getAbattement(R, plus65, ci) {
    if (plus65 || ci) {
      if (R <= 17510) return 2769;
      if (R <= 28170) return 1398;
    }
    return 0;
  }

  const Ab1 = getAbattement(RNet1, Plus651, CI1);
  const Ab2 = getAbattement(RNet2, Plus652, CI2);

  const AbTotal = Ab1 + Ab2;

  // Rimposable
  const Rimpo1 = Math.max(RNet1 - Ab1, 0);
  const Rimpo2 = Math.max(RNet2 - Ab2, 0);
  const Rimpo = Math.max(RNet - AbTotal, 0);

  // RFR
  const RFR1 = Math.max(RS1 + RF1 - Ab1, 0);
  const RFR2 = Math.max(RS2 + RF2 - Ab2, 0);
  const RFR = Math.max(RNet1 + RNet2 + D1 + D2 - AbTotal, 0);

  // Parts fiscales
  let Parts = 1 + CI1 + CI2;

  const totalEnfants = EnfantE + Invalide;

  if (totalEnfants >= 2) {
    Parts += Invalide * 1.5 + (EnfantEH + EnfantA) * 0.5 + EnfantAH * 0.25 + EnfantE;
  } else if (totalEnfants === 1 && EnfantA > 0) {
    Parts += 1.25 + EnfantEH * 0.5 + Invalide * 0.5 + EnfantA * 0.5 + EnfantAH * 0.25;
  } else if (totalEnfants === 1 && EnfantA === 0) {
    Parts += 1.5 + (EnfantEH + Invalide) * 0.5 + EnfantAH * 0.25;
  } else if (totalEnfants === 0 && EnfantA > 1) {
    Parts += 0.5 + (EnfantEH + Invalide + EnfantA) * 0.5 + EnfantAH * 0.25;
  } else if (totalEnfants === 0 && EnfantA < 2) {
    Parts += (EnfantAH + EnfantA) * 0.25;
  }

  const Quotient = Rimpo / Parts;
  const ImpInter = calculateTax(Quotient) * Parts;

  // Plafonnement
  const ImpBrut = calculateTax(Rimpo);
  const Plaf = Math.min(
    2 * 1791 * (Parts - 2) + (2 * (CI1 + CI2) + EnfantEH + EnfantA / 2 + Invalide) * 1785,
    ImpBrut - ImpInter
  );

  const ImpPlaf = ImpBrut - Plaf;

  // Décote
  const Decote = ImpPlaf <= 3248 ? Math.min(1470 - ImpPlaf * 0.4525, 0) : 0;

  // Réduction min
  const RedMin1 = Math.min(ImpPlaf + Decote, Red1);
  const RedMin2 = Math.min(ImpPlaf + Decote, Red2);
  const RedMin = Math.min(ImpPlaf + Decote, Red1 + Red2);

  // Hauts revenus
  let HR = 0;
  if (RFR > 500000 && RFR < 1000001) HR = (RFR - 500001) * 0.03;
  else if (RFR >= 1000001) HR = (RFR - 1000001) * 0.04 + 15000;

  // Prélèvements sociaux
  const PF1 = RF1 * 0.172;
  const PF2 = RF2 * 0.172;
  const PF = PF1 + PF2;

  // Impôt final
  const Impot = Math.ceil(ImpPlaf + Decote + RedMin - C1 - C2 + HR + PF);
  const Taux = R1 + R2 > 0 ? Math.max((Impot / (R1 + R2)) * 100, 0).toFixed(1) : '0';

  // Répartition entre déclarants
  const Imp1 = Math.ceil((Impot * R1) / (R1 + R2));
  const Imp2 = Impot - Imp1;

  const Taux1 = R1 > 0 ? (Imp1 / R1) * 100 : 0;
  const Taux2 = R2 > 0 ? (Imp2 / R2) * 100 : 0;

  // Résultats globaux
  setResult('household-taxable-reference-income', RFR, { round: 'euro' });
  setResult('household-taxable-income', Rimpo, { round: 'euro' });
  setResult('household-tax-amount', Impot, { round: 'euro' });
  setResult('household-tax-rate', Taux, { round: 'decimal' });
  setResult('household-tax-shares', Parts, { round: 'decimal' });
  setResult('household-quotient', Quotient, { round: 'euro' });

  // Résultats par déclarant
  setResult('reference-taxable-income-1', Rimpo1, { round: 'euro' });
  setResult('reference-taxable-income-2', Rimpo2, { round: 'euro' });
  setResult('tax-amount-1', Imp1, { round: 'euro' });
  setResult('tax-amount-2', Imp2, { round: 'euro' });
  setResult('tax-rate-1', Taux1, { round: 'decimal' });
  setResult('tax-rate-2', Taux2, { round: 'decimal' });
}








// === FONCTION COMMUNE DE CALCUL DE L'IMPOT ===
/*function calculateTax(revenu) {
  if (revenu <= 11497) return 0;
  else if (revenu <= 29315) return (revenu - 11497) * 0.11;
  else if (revenu <= 83823) return (revenu - 29315) * 0.3 + (29315 - 11497) * 0.11;
  else if (revenu <= 180294) return (revenu - 83823) * 0.41 + (83823 - 29315) * 0.3 + (29315 - 11497) * 0.11;
  else return (revenu - 180294) * 0.45 + (180294 - 83823) * 0.41 + (83823 - 29315) * 0.3 + (29315 - 11497) * 0.11;
}

function getNumber(id) {
  return parseFloat(document.getElementById(id)?.value || '0');
}

function isChecked(id) {
  return document.getElementById(id)?.checked || false;
}

function setResult(id, value, options = {}) {
  const el = document.getElementById(id);
  if (!el) return;
  if (options.round === 'euro') value = Math.ceil(value);
  if (options.round === 'decimal') value = Math.round(value * 10) / 10;
  el.innerText = isNaN(value) ? '0' : value;
}

// === LISTENERS UNIVERSELS ===
document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    ['input', 'change', 'blur', 'keyup'].forEach(event => {
      input.addEventListener(event, runAppropriateSimulation);
    });
  });

  runAppropriateSimulation();
});

function hasSecondTaxpayer() {
  const yesInput = document.querySelector('input[name="has-second-taxpayer"][value="oui"]');
  return yesInput?.checked || false;
}

function runAppropriateSimulation() {
  if (hasSecondTaxpayer()) {
    runTaxSimulationOne();
    runTaxSimulationWithTwo();
  } else {
    runTaxSimulationOne();
  }
}

// === FONCTION POUR UN SEUL DECLARANT ===
function runTaxSimulationOne() {
  const Revenu = getNumber('net-income-1');
  const RevenuF = getNumber('rental-income-1');
  const FraisR = getNumber('actual-expenses-number-1');
  const Déduction = getNumber('income-deduction-1');
  const Réduction = getNumber('tax-reduction-1');
  const Crédit = getNumber('tax-credit-1');
  const EnfantE = getNumber('children-full-custody');
  const EnfantEH = getNumber('disabled-full-custody-children');
  const EnfantA = getNumber('children-shared-custody');
  const EnfantAH = getNumber('disabled-shared-custody-children');
  const Invalide = getNumber('additional-disabled-dependent');
  const CaseInvalide = isChecked('disabled-1') ? 0.5 : 0;
  const ParenI = isChecked('single-parent') ? 1 : 0;
  const Veuf = isChecked('widowed') ? 1 : 0;
  const Retraite = isChecked('retirement-1');
  const Abattement = isChecked('standard-deduction-1');
  const FraisReelsCoche = isChecked('actual-expenses-checkbox-1');
  const Over65 = isChecked('over-65-1');

  let RevenuSR = Revenu;
  if (FraisReelsCoche) {
    RevenuSR = Revenu - FraisR;
  } else if (Abattement && Retraite) {
    RevenuSR = Revenu * 0.1 <= 450 ? Revenu - 450 : Math.max(Revenu * 0.9, Revenu - 4399);
  } else if (Abattement && !Retraite) {
    RevenuSR = Revenu * 0.1 <= 504 ? Revenu - 504 : Math.max(Revenu * 0.9, Revenu - 14426);
  }

  const RevenuNetGlobal = RevenuSR + RevenuF - Déduction;

  let AbattementS = 0;
  if (Over65 || CaseInvalide > 0) {
    if (RevenuNetGlobal <= 17510) {
      AbattementS = 2769;
    } else if (RevenuNetGlobal <= 28170) {
      AbattementS = 1398;
    }
  }

  const Rimposable = Math.max(Math.ceil(RevenuNetGlobal - AbattementS), 0);
  const RFR = Math.max(Math.ceil(RevenuSR + RevenuF - AbattementS), 0);

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

  const quotient = Rimposable / Parts;
  const impotQuotient = calculateTax(quotient);
  const ImpotIntermediaire = impotQuotient * Parts;

  const plafonnement = Math.min(
    2 * 1791 * (Parts - 1) +
    (2 * CaseInvalide + EnfantEH + EnfantA / 2 + Invalide) * 1785 +
    ParentIValue * 642 +
    VeufValue * 1993,
    calculateTax(Rimposable) - ImpotIntermediaire
  );

  const ImpotApresPlaf = calculateTax(Rimposable) - plafonnement;
  const decote = ImpotApresPlaf <= 1964 ? Math.min(889 + ImpotApresPlaf * 0.4525, 0) : 0;
  const reductionMin = Math.min(ImpotApresPlaf + decote, Réduction);

  let HautsRevenus = 0;
  if (RFR > 250000 && RFR < 500001) {
    HautsRevenus = (RFR - 250001) * 0.03;
  } else if (RFR > 500000) {
    HautsRevenus = (RFR - 500001) * 0.04 + 7500;
  }

  const PrelevSociauxFoncier = RevenuF * 0.172;
  const Impot = Math.ceil(ImpotApresPlaf + decote + reductionMin - Crédit + HautsRevenus + PrelevSociauxFoncier);
  const Taux = Revenu <= 0 ? 0 : Math.max(0, ((Impot / Revenu) * 100).toFixed(1));

  setResult('household-taxable-reference-income', RFR, { round: 'euro' });
  setResult('household-taxable-income', Rimposable, { round: 'euro' });
  setResult('household-tax-amount', Impot, { round: 'euro' });
  setResult('household-tax-rate', Taux, { round: 'decimal' });
  setResult('household-tax-shares', Parts, { round: 'decimal' });
  setResult('household-quotient', quotient, { round: 'euro' });
}

// === FONCTION POUR DEUX DECLARANTS ===
function runTaxSimulationWithTwo() {
  // Récupération des données déclarant 1
  const R1 = getNumber('net-income-1');
  const RF1 = getNumber('rental-income-1');
  const F1 = getNumber('actual-expenses-number-1');
  const D1 = getNumber('income-deduction-1');
  const Red1 = getNumber('tax-reduction-1');
  const C1 = getNumber('tax-credit-1');
  const A1 = isChecked('standard-deduction-1');
  const Ret1 = isChecked('retirement-1');
  const FR1 = isChecked('actual-expenses-checkbox-1');
  const Plus651 = isChecked('over-65-1');
  const CI1 = isChecked('disabled-1') ? 0.5 : 0;

  // Récupération des données déclarant 2
  const R2 = getNumber('net-income-2');
  const RF2 = getNumber('rental-income-2');
  const F2 = getNumber('actual-expenses-number-2');
  const D2 = getNumber('income-deduction-2');
  const Red2 = getNumber('tax-reduction-2');
  const C2 = getNumber('tax-credit-2');
  const A2 = isChecked('standard-deduction-2');
  const Ret2 = isChecked('retirement-2');
  const FR2 = isChecked('actual-expenses-checkbox-2');
  const Plus652 = isChecked('over-65-2');
  const CI2 = isChecked('disabled-2') ? 0.5 : 0;

  // Personnes à charge
  const EnfantE = getNumber('children-full-custody');
  const EnfantEH = getNumber('disabled-full-custody-children');
  const EnfantA = getNumber('children-shared-custody');
  const EnfantAH = getNumber('disabled-shared-custody-children');
  const Invalide = getNumber('additional-disabled-dependent');
  const PI = isChecked('single-parent') ? 1 : 0;

  // RevenuSR
  let RS1 = R1;
  let RS2 = R2;

  if (FR1) RS1 = R1 - F1;
  else if (A1 && Ret1) RS1 = R1 * 0.1 <= 450 ? R1 - 450 : Math.max(R1 * 0.9, R1 - 4399);
  else if (A1 && !Ret1) RS1 = R1 * 0.1 <= 504 ? R1 - 504 : Math.max(R1 * 0.9, R1 - 14426);

  if (FR2) RS2 = R2 - F2;
  else if (A2 && Ret2) RS2 = R2 * 0.1 <= 450 ? R2 - 450 : Math.max(R2 * 0.9, R2 - 4399);
  else if (A2 && !Ret2) RS2 = R2 * 0.1 <= 504 ? R2 - 504 : Math.max(R2 * 0.9, R2 - 14426);

  // Revenu net global
  let RNet1 = RS1 + RF1 - D1;
  let RNet2 = RS2 + RF2 - D2;

  if ((Ret1 && Ret2 && R1 < 450 && R2 < 450) || ((R1 + R2) * 0.1 < 4399 && Ret1 && Ret2)) {
    var RNet = R1 + R2 - 4399;
  } else {
    var RNet = RNet1 + RNet2;
  }

  // AbattementS
  function getAbattement(R, plus65, ci) {
    if (plus65 || ci) {
      if (R <= 17510) return 2769;
      if (R <= 28170) return 1398;
    }
    return 0;
  }

  const Ab1 = getAbattement(RNet1, Plus651, CI1);
  const Ab2 = getAbattement(RNet2, Plus652, CI2);

  const AbTotal = Ab1 + Ab2;

  // Rimposable
  const Rimpo1 = Math.max(RNet1 - Ab1, 0);
  const Rimpo2 = Math.max(RNet2 - Ab2, 0);
  const Rimpo = Math.max(RNet - AbTotal, 0);

  // RFR
  const RFR1 = Math.max(RS1 + RF1 - Ab1, 0);
  const RFR2 = Math.max(RS2 + RF2 - Ab2, 0);
  const RFR = Math.max(RNet1 + RNet2 + D1 + D2 - AbTotal, 0);

  // Parts fiscales
  let Parts = 1 + CI1 + CI2;

  const totalEnfants = EnfantE + Invalide;

  if (totalEnfants >= 2) {
    Parts += Invalide * 1.5 + (EnfantEH + EnfantA) * 0.5 + EnfantAH * 0.25 + EnfantE;
  } else if (totalEnfants === 1 && EnfantA > 0) {
    Parts += 1.25 + EnfantEH * 0.5 + Invalide * 0.5 + EnfantA * 0.5 + EnfantAH * 0.25;
  } else if (totalEnfants === 1 && EnfantA === 0) {
    Parts += 1.5 + (EnfantEH + Invalide) * 0.5 + EnfantAH * 0.25;
  } else if (totalEnfants === 0 && EnfantA > 1) {
    Parts += 0.5 + (EnfantEH + Invalide + EnfantA) * 0.5 + EnfantAH * 0.25;
  } else if (totalEnfants === 0 && EnfantA < 2) {
    Parts += (EnfantAH + EnfantA) * 0.25;
  }

  const Quotient = Rimpo / Parts;
  const ImpInter = calculateTax(Quotient) * Parts;

  // Plafonnement
  const ImpBrut = calculateTax(Rimpo);
  const Plaf = Math.min(
    2 * 1791 * (Parts - 2) + (2 * (CI1 + CI2) + EnfantEH + EnfantA / 2 + Invalide) * 1785,
    ImpBrut - ImpInter
  );

  const ImpPlaf = ImpBrut - Plaf;

  // Décote
  const Decote = ImpPlaf <= 3248 ? Math.min(1470 - ImpPlaf * 0.4525, 0) : 0;

  // Réduction min
  const RedMin1 = Math.min(ImpPlaf + Decote, Red1);
  const RedMin2 = Math.min(ImpPlaf + Decote, Red2);
  const RedMin = Math.min(ImpPlaf + Decote, Red1 + Red2);

  // Hauts revenus
  let HR = 0;
  if (RFR > 500000 && RFR < 1000001) HR = (RFR - 500001) * 0.03;
  else if (RFR >= 1000001) HR = (RFR - 1000001) * 0.04 + 15000;

  // Prélèvements sociaux
  const PF1 = RF1 * 0.172;
  const PF2 = RF2 * 0.172;
  const PF = PF1 + PF2;

  // Impôt final
  const Impot = Math.ceil(ImpPlaf + Decote + RedMin - C1 - C2 + HR + PF);
  const Taux = R1 + R2 > 0 ? Math.max((Impot / (R1 + R2)) * 100, 0).toFixed(1) : '0';

  // Répartition entre déclarants
  const Imp1 = Math.ceil((Impot * R1) / (R1 + R2));
  const Imp2 = Impot - Imp1;

  const Taux1 = R1 > 0 ? (Imp1 / R1) * 100 : 0;
  const Taux2 = R2 > 0 ? (Imp2 / R2) * 100 : 0;

  // Résultats globaux
  setResult('household-taxable-reference-income', RFR, { round: 'euro' });
  setResult('household-taxable-income', Rimpo, { round: 'euro' });
  setResult('household-tax-amount', Impot, { round: 'euro' });
  setResult('household-tax-rate', Taux, { round: 'decimal' });
  setResult('household-tax-shares', Parts, { round: 'decimal' });
  setResult('household-quotient', Quotient, { round: 'euro' });

  // Résultats par déclarant
  setResult('reference-taxable-income-1', Rimpo1, { round: 'euro' });
  setResult('reference-taxable-income-2', Rimpo2, { round: 'euro' });
  setResult('tax-amount-1', Imp1, { round: 'euro' });
  setResult('tax-amount-2', Imp2, { round: 'euro' });
  setResult('tax-rate-1', Taux1, { round: 'decimal' });
  setResult('tax-rate-2', Taux2, { round: 'decimal' });
}


document.addEventListener('DOMContentLoaded', () => {
  const inputs = document.querySelectorAll('input');
  inputs.forEach(input => {
    ['input', 'change', 'blur', 'keyup'].forEach(event => {
      input.addEventListener(event, runAppropriateSimulation);
    });
  });

  // Ajout spécifique : écouteur pour le changement de déclarant
  const toggleSecondTaxpayer = document.querySelector('input[name="has-second-taxpayer"]');
  if (toggleSecondTaxpayer) {
    toggleSecondTaxpayer.addEventListener('change', runAppropriateSimulation);
  }

  runAppropriateSimulation();
});*/

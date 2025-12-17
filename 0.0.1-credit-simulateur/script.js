/**********************************************************
 * UTILITAIRES D'AFFICHAGE
 **********************************************************/

function formatEuro(value) {
  const n = Math.round(value || 0);
  return n.toLocaleString("fr-FR") + " €";
}

function formatNumber(value) {
  const n = Math.round(value || 0);
  return n.toLocaleString("fr-FR");
}

function setEuroText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = formatEuro(value);
}

function setNumberText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = formatNumber(value);
}

function setYearsText(id, years) {
  const el = document.getElementById(id);
  if (!el) return;
  const n = Math.round(years || 0);
  el.textContent = n.toLocaleString("fr-FR");
}

function setText(id, value) {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = value ?? "";
}

/**********************************************************
 * LECTURE DES CHAMPS
 **********************************************************/

function getNumericValue(id) {
  const el = document.getElementById(id);
  if (!el) return 0;

  if (el.type === "range") {
    return parseFloat(el.dataset.actualValue || el.value || 0);
  }

  const val = parseFloat(el.value);
  return isNaN(val) ? 0 : val;
}

// Pour les taux en %, renvoyés en décimal
function getRateValue(id) {
  return getNumericValue(id) / 100;
}

/**********************************************************
 * CALCUL D’UN CRÉDIT (A1, A2, B1, B2) – FORMULES PDF
 *
 * TCr et TAss sont en DÉCIMAL (donc 3,9 % → 0,039)
 *
 * CAssurance X = Capital X * TAssurance X * Durée X
 *
 * Mensualité X =
 * (
 *   (Capital X * TCrédit X) /
 *     (1 - (1 + TCrédit X / 12)^(-Durée X * 12))
 *   + CAssurance X / Durée X
 * ) * (1/12)
 *
 * CCrédit (part X) = 12 * Durée X * Mensualité X
 *                    - Capital X - CAssurance X + CFixes X
 *
 * CTotal (part X) = CCrédit (part X) + CAssurance X
 **********************************************************/

function computeSingleLoan(prefix) {
  const capital = getNumericValue(prefix + "_capital");
  const cFixes  = getNumericValue(prefix + "_fixed_fees");
  const tCr     = getRateValue(prefix + "_rate_credit");     // décimal
  const tAss    = getRateValue(prefix + "_rate_insurance");  // décimal
  const duree   = getNumericValue(prefix + "_duration");     // années

  if (!capital || !duree) {
    setEuroText(prefix + "_monthly_payment", 0);
    setEuroText(prefix + "_credit_cost", 0);
    setEuroText(prefix + "_insurance_cost", 0);
    setEuroText(prefix + "_total_cost", 0);

    return {
      capital: 0,
      duree: 0,
      mensualite: 0,
      cAssurance: 0,
      cCreditPart: 0,
      cTotalPart: 0,
      cFixes: 0
    };
  }

  // CAssurance X = Capital X * TAssurance X * Durée X
  const cAssurance = capital * tAss * duree;

  // Mensualité (formule du PDF)
  let mensualite = 0;
  if (tCr === 0) {
    // cas limite : pas d’intérêts
    mensualite = ((capital / (duree * 12)) + (cAssurance / duree)) * (1 / 12);
  } else {
    const numerator   = capital * tCr;
    const denominator = 1 - Math.pow(1 + tCr / 12, -duree * 12);
    const fraction1   = numerator / denominator;
    const fraction2   = cAssurance / duree;
    mensualite        = (fraction1 + fraction2) * (1 / 12);
  }

  // CCrédit partiel : 12*Durée*Mensualité - Capital - CAssurance + CFixes
  const cCreditPart = 12 * duree * mensualite - capital - cAssurance + cFixes;

  // CTotal partiel = CCrédit partiel + CAssurance
  const cTotalPart = cCreditPart + cAssurance;

  // Injection dans le tableau « simple »
  setEuroText(prefix + "_monthly_payment", mensualite);
  setEuroText(prefix + "_credit_cost", cCreditPart);
  setEuroText(prefix + "_insurance_cost", cAssurance);
  setEuroText(prefix + "_total_cost", cTotalPart);

  return {
    capital,
    duree,
    mensualite,
    cAssurance,
    cCreditPart,
    cTotalPart,
    cFixes
  };
}

/**********************************************************
 * CALCUL D’UN MONTAGE COMPLET (A ou B)
 *
 * CAssurance montage = CAss1 + CAss2
 * CCrédit montage    = somme des CCrédit partiels
 * CTotal montage     = CCrédit montage + CAssurance montage
 **********************************************************/

function computeMontage(letter) {
  // checkbox « j’associe un second crédit »
  const cbSecond = document.getElementById("has_second_loan_" + letter);
  const hasSecond = cbSecond ? cbSecond.checked : false;

  // Crédit 1 : A1 ou B1
  const loan1Prefix = "loan1" + letter;
  const loan1 = computeSingleLoan(loan1Prefix);

  // Crédit 2 : A2 ou B2 (si non coché, tout sera à 0)
  const loan2Prefix = "loan2" + letter;
  let loan2 = {
    capital: 0,
    duree: 0,
    mensualite: 0,
    cAssurance: 0,
    cCreditPart: 0,
    cTotalPart: 0,
    cFixes: 0
  };

  if (hasSecond) {
    loan2 = computeSingleLoan(loan2Prefix);
  } else {
    setEuroText(loan2Prefix + "_monthly_payment", 0);
    setEuroText(loan2Prefix + "_credit_cost", 0);
    setEuroText(loan2Prefix + "_insurance_cost", 0);
    setEuroText(loan2Prefix + "_total_cost", 0);
  }

  const capitalTotal    = loan1.capital + loan2.capital;
  const cAssuranceTotal = loan1.cAssurance + loan2.cAssurance;
  const cCreditTotal    = loan1.cCreditPart + loan2.cCreditPart;
  const cTotalMontage   = cCreditTotal + cAssuranceTotal;

  // Comparaison avancée : capital + coût total
  setEuroText("situation" + letter + "_total_capital", capitalTotal);
  setEuroText("situation" + letter + "_total_credit_cost", cTotalMontage);

  return {
    letter,
    loan1,
    loan2,
    capitalTotal,
    cAssuranceTotal,
    cCreditTotal,
    cTotalMontage,
    mensualite1: loan1.mensualite,
    mensualite2: loan2.mensualite,
    duree1: loan1.duree,
    duree2: loan2.duree
  };
}

/**********************************************************
 * FORMULES ÉPARGNE / PLACEMENT / TOTAL (PDF)
 **********************************************************/

function computeMensMax(mA1, mA2, mB1, mB2) {
  const mensA = mA1 + mA2;
  const mensB = mB1 + mB2;
  return Math.max(mensA, mensB);
}

function computeDureeMax(dA1, dB1) {
  return Math.max(dA1, dB1);
}

/**
 * Épargne :
 * 12 * ( (MensMax - Mens1 - Mens2)*DuréeMax
 *        + Mens2*(DuréeMax - Durée2)
 *        + Mens1*(DuréeMax - Durée1) )
 */
function computeEpargne(m1, m2, d1, d2, mensMax, dureeMax) {
  const term1 = (mensMax - m1 - m2) * dureeMax;
  const term2 = m2 * (dureeMax - d2);
  const term3 = m1 * (dureeMax - d1);
  return 12 * (term1 + term2 + term3);
}

/**
 * Placement sup :
 * (12*(MensMax-M1-M2)*((1+t)^DurMax -1)/t
 *  + 12*M2*((1+t)^(DurMax-D2)-1)/t
 *  + 12*M1*((1+t)^(DurMax-D1)-1)/t
 * ) - Epargne
 */
function computePlacementSup(m1, m2, d1, d2, mensMax, dureeMax, t, epargne) {
  if (t === 0) return 0;

  const factor1 = (Math.pow(1 + t, dureeMax) - 1) / t;
  const factor2 = (Math.pow(1 + t, dureeMax - d2) - 1) / t;
  const factor3 = (Math.pow(1 + t, dureeMax - d1) - 1) / t;

  const term1 = 12 * (mensMax - m1 - m2) * factor1;
  const term2 = 12 * m2 * factor2;
  const term3 = 12 * m1 * factor3;

  const capitalPlusInterets = term1 + term2 + term3;
  return capitalPlusInterets - epargne;
}

/**
 * Situation totale :
 * Total = Capital - CTotal + Epargne + PlacementSup
 */
function computeTotalSituation(capital, cTotalMontage, epargne, placementSup) {
  return capital - cTotalMontage + epargne + placementSup;
}

/**********************************************************
 * FONCTION PRINCIPALE – CALCUL COMPLET
 **********************************************************/

/*function runAppropriateSimulation() {
  // 1. Montages A et B
  const montageA = computeMontage("A");
  const montageB = computeMontage("B");

  // Détection des seconds crédits
  const hasSecondLoanA = document.getElementById("has_second_loan_A")?.checked;
  const hasSecondLoanB = document.getElementById("has_second_loan_B")?.checked;

  // Totaux par crédit
  const totalA1 = montageA.loan1.cTotalPart;
  const totalB1 = montageB.loan1.cTotalPart;

  const totalA2 = hasSecondLoanA ? montageA.loan2.cTotalPart : 0;
  const totalB2 = hasSecondLoanB ? montageB.loan2.cTotalPart : 0;

  // Totaux globaux
  const totalAResult = totalA1 + totalA2;
  const totalBResult = totalB1 + totalB2;

  // 2. Mensualité max & Durée max
  const mensMax = computeMensMax(
    montageA.mensualite1,
    montageA.mensualite2,
    montageB.mensualite1,
    montageB.mensualite2
  );
  const dureeMax = computeDureeMax(montageA.duree1, montageB.duree1);

  setEuroText("global_max_monthly_payment", mensMax);
  setNumberText("global_max_duration_years", dureeMax); // valeur numérique
  setYearsText("global_max_duration_years", dureeMax);  // si tu veux "25 ans"

  // 3. Taux d’épargne (en décimal)
  const tEpargne = getRateValue("global_savings_rate");

  // 4. Épargne / Placement A
  const epargneA = computeEpargne(
    montageA.mensualite1,
    montageA.mensualite2,
    montageA.duree1,
    montageA.duree2,
    mensMax,
    dureeMax
  );
  const placementSupA = computePlacementSup(
    montageA.mensualite1,
    montageA.mensualite2,
    montageA.duree1,
    montageA.duree2,
    mensMax,
    dureeMax,
    tEpargne,
    epargneA
  );

  // 5. Épargne / Placement B
  const epargneB = computeEpargne(
    montageB.mensualite1,
    montageB.mensualite2,
    montageB.duree1,
    montageB.duree2,
    mensMax,
    dureeMax
  );
  const placementSupB = computePlacementSup(
    montageB.mensualite1,
    montageB.mensualite2,
    montageB.duree1,
    montageB.duree2,
    mensMax,
    dureeMax,
    tEpargne,
    epargneB
  );

  // 6. Totaux
  const totalA = computeTotalSituation(
    montageA.capitalTotal,
    montageA.cTotalMontage,
    epargneA,
    placementSupA
  );
  const totalB = computeTotalSituation(
    montageB.capitalTotal,
    montageB.cTotalMontage,
    epargneB,
    placementSupB
  );

  // highlightBestSimulation(totalA, totalB);

  // Crédit 1 : min
  highlightBestForTable("loan_result_1", totalA1, totalB1);

  // Crédit 2 : min (si affiché)
  if (hasSecondLoanA || hasSecondLoanB) {
    highlightBestForTable("loan_result_2", totalA2, totalB2);
  }

  // Projection / situation financière : max
  highlightBestForTableMax("loan_result_total", totalA, totalB);

  // 7. Injection dans le bloc « avancé »

  // Épargne accumulée
  setEuroText("savingsA_accumulated", epargneA);
  setEuroText("savingsB_accumulated", epargneB);

  // Intérêts de l’épargne
  setEuroText("savingsA_interest", placementSupA);
  setEuroText("savingsB_interest", placementSupB);

  // Total épargne + intérêts
  setEuroText("savingsA_total", epargneA + placementSupA);
  setEuroText("savingsB_total", epargneB + placementSupB);

  // Argent complémentaire économisé et placé
  setEuroText("savingsA_extra_amount", epargneA + placementSupA);
  setEuroText("savingsB_extra_amount", epargneB + placementSupB);

  // Situation financière globale
  setEuroText("situationA_financial_result", totalA);
  setEuroText("situationB_financial_result", totalB);
}*/

function runAppropriateSimulation() {
  // Petite sécurité NaN
  const safe = (n) => (Number.isFinite(n) ? n : 0);

  // 1) Montages A et B
  const montageA = computeMontage("A");
  const montageB = computeMontage("B");

  const hasSecondLoanA = !!document.getElementById("has_second_loan_A")?.checked;
  const hasSecondLoanB = !!document.getElementById("has_second_loan_B")?.checked;

  // 2) Totaux "coûts" (crédit+assurance) pour le tableau Résultat (min = best)
  // -> on compare le total réel du montage (crédit 1 + éventuel crédit 2)
  const totalA1 = safe(montageA?.loan1?.cTotalPart);
  const totalB1 = safe(montageB?.loan1?.cTotalPart);

  const totalA2 = hasSecondLoanA ? safe(montageA?.loan2?.cTotalPart) : 0;
  const totalB2 = hasSecondLoanB ? safe(montageB?.loan2?.cTotalPart) : 0;

  const totalAResult = totalA1 + totalA2;
  const totalBResult = totalB1 + totalB2;

  // 3) Mensualité max & Durée max (pour la partie avancée)
  const mensMax = safe(
    computeMensMax(
      safe(montageA?.mensualite1),
      safe(montageA?.mensualite2),
      safe(montageB?.mensualite1),
      safe(montageB?.mensualite2)
    )
  );

  const dureeMax = safe(
    computeDureeMax(
      safe(montageA?.duree1),
      safe(montageB?.duree1)
    )
  );

  setEuroText("global_max_monthly_payment", mensMax);
  setYearsText("global_max_duration_years", dureeMax); // => "X ans" dans ton UI

  // 4) Taux placement épargne (décimal attendu par tes formules)
  const tEpargne = safe(getRateValue("global_savings_rate"));

  // 5) Épargne + intérêts (PDF)
  const epargneA = safe(
    computeEpargne(
      safe(montageA?.mensualite1),
      safe(montageA?.mensualite2),
      safe(montageA?.duree1),
      safe(montageA?.duree2),
      mensMax,
      dureeMax
    )
  );

  const placementSupA = safe(
    computePlacementSup(
      safe(montageA?.mensualite1),
      safe(montageA?.mensualite2),
      safe(montageA?.duree1),
      safe(montageA?.duree2),
      mensMax,
      dureeMax,
      tEpargne,
      epargneA
    )
  );

  const epargneB = safe(
    computeEpargne(
      safe(montageB?.mensualite1),
      safe(montageB?.mensualite2),
      safe(montageB?.duree1),
      safe(montageB?.duree2),
      mensMax,
      dureeMax
    )
  );

  const placementSupB = safe(
    computePlacementSup(
      safe(montageB?.mensualite1),
      safe(montageB?.mensualite2),
      safe(montageB?.duree1),
      safe(montageB?.duree2),
      mensMax,
      dureeMax,
      tEpargne,
      epargneB
    )
  );

  // 6) Situation financière (PDF) : Total = Capital - CTotal + Épargne + Intérêts
  const totalA = safe(
    computeTotalSituation(
      safe(montageA?.capitalTotal),
      safe(montageA?.cTotalMontage),
      epargneA,
      placementSupA
    )
  );

  const totalB = safe(
    computeTotalSituation(
      safe(montageB?.capitalTotal),
      safe(montageB?.cTotalMontage),
      epargneB,
      placementSupB
    )
  );

  // 7) Highlight "Résultat"
  // Tableau Résultat (loan_result_1) : le + économique = total le PLUS BAS
  highlightBestForTable("loan_result", totalAResult, totalBResult);

  // Tableau projection (loan_result_total) : le meilleur = résultat le PLUS HAUT
  highlightBestForTableMax("loan_result_advanced", totalA, totalB);

  // 8) Injection avancée (IDs que tu cites)
  setEuroText("savingsA_accumulated", epargneA);
  setEuroText("savingsB_accumulated", epargneB);

  setEuroText("savingsA_interest", placementSupA);
  setEuroText("savingsB_interest", placementSupB);

  setEuroText("situationA_financial_result", totalA);
  setEuroText("situationB_financial_result", totalB);
}

function highlightBestForTable(tableId, totalA, totalB) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const linesA = table.querySelectorAll(".credit-sim_answer-item-wrapper.is-a");
  const linesB = table.querySelectorAll(".credit-sim_answer-item-wrapper.is-b");

  const pastilleA = table.querySelectorAll(".credit-sim_pastille-eco.is-a");
  const pastielleB = table.querySelectorAll('.credit-sim_pastille-eco.is-b');

  // Reset
  [...linesA, ...linesB].forEach(el =>
    el.classList.remove("is-best")
  );

  [...pastilleA, ...pastielleB].forEach(el =>
    el.style.display = 'none'
  );

  // Le plus économique = total le PLUS BAS
  if (totalA < totalB) {
    linesA.forEach(el => el.classList.add("is-best"));
    pastilleA.forEach(el => el.style.display = 'flex');
  } else if (totalB < totalA) {
    linesB.forEach(el => el.classList.add("is-best"));
    pastielleB.forEach(el => el.style.display = 'flex');
  }
}

function highlightBestForTableMax(tableId, valueA, valueB) {
  const table = document.getElementById(tableId);
  if (!table) return;

  const linesA = table.querySelectorAll(".credit-sim_answer-item-wrapper.is-a");
  const linesB = table.querySelectorAll(".credit-sim_answer-item-wrapper.is-b");

  const pastilleA = table.querySelectorAll(".credit-sim_pastille-eco.is-a");
  const pastielleB = table.querySelectorAll('.credit-sim_pastille-eco.is-b');

  [...linesA, ...linesB].forEach(el =>
    el.classList.remove("is-best")
  );

  [...pastilleA, ...pastielleB].forEach(el =>
    el.style.display = 'none'
  );

  if (valueA > valueB) {
    linesA.forEach(el => el.classList.add("is-best"));
    pastilleA.forEach(el => el.style.display = 'flex');
  } else if (valueB > valueA) {
    linesB.forEach(el => el.classList.add("is-best"));
    pastielleB.forEach(el => el.style.display = 'flex');
  }
}


/**********************************************************
 * GESTION DES SLIDERS, INPUTS & AFFICHAGE DES BLOCS
 **********************************************************/

document.addEventListener("DOMContentLoaded", () => {
  syncLoan2DurationWithLoan1("A");
  syncLoan2DurationWithLoan1("B");

  /*********** Sliders (taux, durées, etc.) ***********/
  document.querySelectorAll(".range-slider").forEach(sliderWrapper => {
    const rangeInput = sliderWrapper.querySelector('input[type="range"]');
    const valueDisplay = sliderWrapper.querySelector(".range-value");

    const initialValue = parseFloat(rangeInput.value);
    rangeInput.dataset.actualValue = initialValue;
    valueDisplay.textContent = initialValue;

    function updateDurationYearsIfNeeded(id, value) {
      // Quand on modifie les sliders de durée, on met à jour les textes "xx ans"
      const v = Math.round(value || 0);
      if (id === "loan1A_duration") setYearsText("loan1A_duration_years", v);
      if (id === "loan2A_duration") setYearsText("loan2A_duration_years", v);
      if (id === "loan1B_duration") setYearsText("loan1B_duration_years", v);
      if (id === "loan2B_duration") setYearsText("loan2B_duration_years", v);
    }

    // Slider → span + dataset
    rangeInput.addEventListener("input", () => {
      const value = parseFloat(rangeInput.value);
      rangeInput.dataset.actualValue = value;
      valueDisplay.textContent = value;

      updateDurationYearsIfNeeded(rangeInput.id, value);

      if (rangeInput.id === "loan1A_duration") {
        syncLoan2DurationWithLoan1("A");
      }

      if (rangeInput.id === "loan1B_duration") {
        syncLoan2DurationWithLoan1("B");
      }

      runAppropriateSimulation();
    });

    // Span (contenteditable) → slider + dataset
    function updateFromSpan() {
      const raw = valueDisplay.textContent
        .replace(/\s/g, "")
        .replace(/[^\d.,-]/g, "")
        .replace(",", ".");
      const parsed = parseFloat(raw);

      if (!isNaN(parsed)) {
        rangeInput.dataset.actualValue = parsed;
        const max = parseFloat(rangeInput.max);
        rangeInput.value = Math.min(parsed, max);
        valueDisplay.textContent = parsed;

        updateDurationYearsIfNeeded(rangeInput.id, parsed);
        runAppropriateSimulation();
      } else {
        valueDisplay.textContent = rangeInput.dataset.actualValue;
      }
    }

    valueDisplay.addEventListener("blur", updateFromSpan);
    valueDisplay.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        e.preventDefault();
        valueDisplay.blur();
      }
    });

    // Initialisation des textes "xx ans" si ce slider est une durée
    updateDurationYearsIfNeeded(rangeInput.id, initialValue);
  });

  /*********** Inputs number (capital, frais fixes, etc.) ***********/
  document.querySelectorAll('input[type="number"]').forEach(input => {
    input.addEventListener("input", () => {
      runAppropriateSimulation();
    });
  });
});

/*********** Affichage des blocs pour 2e crédit et résultats ***********/
const cbA = document.getElementById("has_second_loan_A");
const cbB = document.getElementById("has_second_loan_B");
const creditA2 = document.getElementById("credit_simulation_A2");
const creditB2 = document.getElementById("credit_simulation_B2");
const creditA2Text = document.querySelectorAll(".credit-sim_credit.is-a2");
const creditB2Text = document.querySelectorAll(".credit-sim_credit.is-b2");
const creditResult2 = document.getElementById("loan_result_2");

function updateSecondLoanUI() {
  const hasA = cbA && cbA.checked;
  const hasB = cbB && cbB.checked;

  if (hasA) {
    creditA2.style.display = "block";
    creditA2Text.forEach(element => {
      element.style.display = "block";
    });
  } else {
    creditA2.style.display = "none";
    creditA2Text.forEach(element => {
      element.style.display = "none";
    });
  }

  if (hasB) {
    creditB2.style.display = "block";
    creditB2Text.forEach(element => {
      element.style.display = "block";
    });
  } else {
    creditB2.style.display = "none";
    creditB2Text.forEach(element => {
      element.style.display = "none";
    });
  }

  runAppropriateSimulation();
}

if (cbA) cbA.addEventListener("change", updateSecondLoanUI);
if (cbB) cbB.addEventListener("change", updateSecondLoanUI);

/*********** 1er calcul ***********/
updateSecondLoanUI(); // appelle aussi runAppropriateSimulation()


function syncLoan2DurationWithLoan1(letter) {
  const loan1 = document.getElementById(`loan1${letter}_duration`);
  const loan2 = document.getElementById(`loan2${letter}_duration`);
  const loan2Value = document.getElementById(`loan2${letter}_duration_years`);

  if (!loan1 || !loan2) return;

  const d1 = parseFloat(loan1.dataset.actualValue || loan1.value || 0);

  // 1️⃣ Brider le max
  loan2.max = d1;

  // 2️⃣ Si la valeur actuelle dépasse → on la corrige
  const currentD2 = parseFloat(loan2.dataset.actualValue || loan2.value || 0);
  if (currentD2 > d1) {
    loan2.value = d1;
    loan2.dataset.actualValue = d1;
    if (loan2Value) loan2Value.textContent = d1;
  }
}

function buildMensualiteDetails(m1, d1, m2, d2) {
  if (!m2 || !d2) {
    return [
      {
        amount: m1,
        duration: d1
      }
    ];
  }

  return [
    {
      amount: m1 + m2,
      duration: d2
    },
    {
      amount: m1,
      duration: d1 - d2
    }
  ];
}

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
  

document.addEventListener("DOMContentLoaded", () => {
  const rangeInput = document.getElementById("deposit");
  const spanInput = document.getElementById("deposit-value");
  const realEstatePriceInput = document.getElementById("real-estate-price");
  const acquisitionCostsInput = document.getElementById("acquisition-costs");

  // Fonction de calcul du capital emprunté
  function calculBorrowedCapital(realEstatePrice, acquisitionCosts, deposit) {
    const borrowedCapitalText = document.getElementById('borrowed-capital');
    const borrowedCapitalResult = Math.round(realEstatePrice + acquisitionCosts - deposit);
    borrowedCapitalText.textContent = borrowedCapitalResult.toLocaleString("fr-FR");
    return borrowedCapitalResult;
  }

  // Fonction de mise à jour des calculs
  const updateCalculations = (deposit) => {
    const realEstatePrice = parseFloat(realEstatePriceInput.value);
    const acquisitionCosts = parseFloat(acquisitionCostsInput.value);
    calculBorrowedCapital(realEstatePrice, acquisitionCosts, deposit);
  };

  // Synchronisation : Curseur → Champ manuel
  rangeInput.addEventListener("input", () => {
    const value = parseInt(rangeInput.value, 10);
    spanInput.textContent = value.toLocaleString("fr-FR"); // Formatage avec espace
    updateCalculations(value);
  });

  // Synchronisation : Champ manuel → Curseur et Calculs
  spanInput.addEventListener("input", () => {
    let rawValue = spanInput.textContent.replace(/\s+/g, ""); // Supprime les espaces
    let value = parseInt(rawValue, 10);

    if (!isNaN(value)) {
      if (value >= parseInt(rangeInput.min, 10) && value <= parseInt(rangeInput.max, 10)) {
        rangeInput.value = value; // Mettre à jour le curseur si dans la plage
      } else if (value > parseInt(rangeInput.max, 10)) {
        rangeInput.value = rangeInput.max; // Curseur au max si valeur au-delà de la plage
      }
      updateCalculations(value); // Mise à jour des calculs
    }
  });

  // Nettoyage et validation à la perte de focus
  spanInput.addEventListener("blur", () => {
    let rawValue = spanInput.textContent.replace(/\s+/g, ""); // Supprime les espaces
    let value = parseInt(rawValue, 10);

    if (!isNaN(value)) {
      spanInput.textContent = value.toLocaleString("fr-FR"); // Reformate avec espaces
      updateCalculations(value);
    } else {
      // Réinitialiser à la dernière valeur connue si la saisie est invalide
      spanInput.textContent = parseInt(rangeInput.value, 10).toLocaleString("fr-FR");
    }
  });

  // Empêche les caractères non numériques
  spanInput.addEventListener("keypress", (event) => {
    if (!/[\d\s]/.test(event.key)) {
      event.preventDefault();
    }
  });

  // Initialiser les calculs à partir de la valeur par défaut
  updateCalculations(parseInt(rangeInput.value, 10));
});


document.addEventListener("DOMContentLoaded", () => {
  const monthlyPropertyChargesInput = document.getElementById('monthly-property-charges');
  const initialSavingsInput = document.getElementById('initial-savings');
  const monthlySavingsCapacityInput = document.getElementById('monthly-savings-capacity');
  const taxBracketInput = document.getElementById('tax-bracket');

  const realEstatePriceInput = document.getElementById('real-estate-price');
  const aquisitionCostsInput = document.getElementById('acquisition-costs');
  const depositSlider = document.getElementById('deposit');
  const loanRateSlider = document.getElementById('loan-rate');
  const insuranceRateSlider = document.getElementById('insurance-rate');
  const loanDurationSlider = document.getElementById('loan-duration');

  const netInvestmentSavingqRateSlider = document.getElementById('net-investment-savings-rate');
  const rateOfChangeSlider = document.getElementById('rate-of-change');
  const rentalIncomeRevaluationRateSlider = document.getElementById('rental-income-revaluation-rate');
  const inflationRateChargesSlider = document.getElementById('inflation-rate-charges');

  const monthlyPropertyChargesRpSlider = document.getElementById('monthly-property-charges-rp');
  const annualPropertyTaxRpSlider = document.getElementById('annual-property-tax-rp');

  const grossMonthlyRentReceivedSlider = document.getElementById('gross-monthly-rent-received');
  const agencyFeesSlider = document.getElementById('agency-fees');
  const annualPropertyTaxOfRentedPropertySlider = document.getElementById('annual-property-tax-of-rented-property');
  const monthlyPropertyChargesOfRentedPropertySlider = document.getElementById('monthly-property-charges-of-rented-property');

  calculOnInputEventListener(monthlyPropertyChargesInput, updateCalculations);
  calculOnInputEventListener(initialSavingsInput, updateCalculations);
  calculOnInputEventListener(monthlySavingsCapacityInput, updateCalculations);
  calculOnInputEventListener(taxBracketInput, updateCalculations);

  calculOnInputEventListener(realEstatePriceInput, updateCalculations);
  calculOnInputEventListener(aquisitionCostsInput, updateCalculations);
  calculOnInputEventListener(depositSlider, updateCalculations);
  calculOnInputEventListener(loanRateSlider, updateCalculations);
  calculOnInputEventListener(insuranceRateSlider, updateCalculations);
  calculOnInputEventListener(loanDurationSlider, updateCalculations);

  calculOnInputEventListener(netInvestmentSavingqRateSlider, updateCalculations);
  calculOnInputEventListener(rateOfChangeSlider, updateCalculations);
  calculOnInputEventListener(rentalIncomeRevaluationRateSlider, updateCalculations);
  calculOnInputEventListener(inflationRateChargesSlider, updateCalculations);

  calculOnInputEventListener(monthlyPropertyChargesRpSlider, updateCalculations);
  calculOnInputEventListener(annualPropertyTaxRpSlider, updateCalculations);

  calculOnInputEventListener(grossMonthlyRentReceivedSlider, updateCalculations);
  calculOnInputEventListener(agencyFeesSlider, updateCalculations);
  calculOnInputEventListener(annualPropertyTaxOfRentedPropertySlider, updateCalculations);
  calculOnInputEventListener(monthlyPropertyChargesOfRentedPropertySlider, updateCalculations);

  // Fonction générique qui met à jour les calculs
  function updateCalculations() {
    const monthlyPropertyCharges = parseFloat(monthlyPropertyChargesInput.value);
    const initialSavings = parseFloat(initialSavingsInput.value);
    const monthlySavingsCapacity = parseFloat(monthlySavingsCapacityInput.value);
    const taxBracket = parseFloat(taxBracketInput.value) / 100;

    const realEstatePrice = parseFloat(realEstatePriceInput.value);
    const aquisitionCosts = parseFloat(aquisitionCostsInput.value);
    const deposit = parseFloat(depositSlider.value);
    const loanRate = parseFloat(loanRateSlider.value) / 100;
    const insuranceRate = parseFloat(insuranceRateSlider.value) / 100;
    const monthlyLoanDuration = parseFloat(loanDurationSlider.value) * 12;
    const loanDuration = parseFloat(loanDurationSlider.value);

    const netInvestmentSavingsRate = parseFloat(netInvestmentSavingqRateSlider.dataset.actualValue) / 100;
    const rateOfChange = parseFloat(rateOfChangeSlider.dataset.actualValue) / 100;
    const rentalIncomeRevaluationRate = parseFloat(rentalIncomeRevaluationRateSlider.dataset.actualValue) / 100;
    const inflationRateCharges = parseFloat(inflationRateChargesSlider.dataset.actualValue) / 100;

    const monthlyPropertyChargesRp = parseFloat(monthlyPropertyChargesRpSlider.value);
    const annualPropertyTaxRp = parseFloat(annualPropertyTaxRpSlider.value);

    const grossMonthlyRentReceived = parseFloat(grossMonthlyRentReceivedSlider.value);
    const agencyFees = parseFloat(agencyFeesSlider.value);
    const annualPropertyTaxOfRentedProperty = parseFloat(annualPropertyTaxOfRentedPropertySlider.value);
    const monthlyPropertyChargesOfRentedProperty = parseFloat(monthlyPropertyChargesOfRentedPropertySlider.value);

    document.getElementById('loan-duration-result').textContent = loanDuration;

    const borrowedCapitalAmount = calculBorrowedCapital(realEstatePrice, aquisitionCosts, deposit);
    // calculCostOfInsurance(borrowedCapitalAmount, loanDuration, insuranceRateSlider);
    const costOfInsuranceAmount = calculCostOfInsurance(borrowedCapitalAmount, loanDuration, insuranceRateSlider);
    const monthlyLoanPaymentAmount = calculMonthlyLoanPayment(borrowedCapitalAmount, loanDuration, loanRateSlider, costOfInsuranceAmount);
    calculLoanCost(loanDuration, borrowedCapitalAmount, costOfInsuranceAmount, monthlyLoanPaymentAmount);
    const remainingSavingsAmount = calculRemainaingSavings(initialSavings, depositSlider);
    const propertyValueAmount = calculValueOfProperty(realEstatePrice, rateOfChange, loanDuration);
    // calculAddtionalSavingsPlacedScenario1(monthlySavingsCapacity, monthlyPropertyCharges, monthlyLoanPaymentAmount, monthlyPropertyChargesRp, annualPropertyTaxRp, netInvestmentSavingqRate, loanDuration);
    calculInitialSavingsPlaced(remainingSavingsAmount, netInvestmentSavingsRate, loanDuration);
    calculAdditionalCostOfInflationRpCharges(monthlyPropertyChargesRp, annualPropertyTaxRp, loanDuration, inflationRateCharges);
    calculAdditionalSavingsPlacedScenario2(monthlySavingsCapacity, loanDuration, netInvestmentSavingsRate);
    calculInitialSavingsPlacedScenario2(initialSavings, netInvestmentSavingsRate, loanDuration);
    calculAdditionalCostOfInflationRentalCharges(monthlyPropertyCharges, loanDuration, inflationRateCharges);
    calculTotalScenario2(monthlySavingsCapacity, loanDuration, netInvestmentSavingsRate, initialSavings, monthlyPropertyCharges, inflationRateCharges);
    calculRevaluationOfRentalIncome(grossMonthlyRentReceived, taxBracket, rentalIncomeRevaluationRate, loanDuration);
    calculAdditionalCostInflationChargesOfTheRentedProperty(annualPropertyTaxOfRentedProperty, monthlyPropertyChargesOfRentedProperty, loanDuration, inflationRateCharges);
    calculAddtionalSavingsPlacedScenario3(monthlySavingsCapacity, monthlyLoanPaymentAmount, monthlyPropertyChargesOfRentedProperty, annualPropertyTaxOfRentedProperty, agencyFees, grossMonthlyRentReceived, taxBracket, loanDuration);
    calculTotalScenario3(propertyValueAmount, monthlySavingsCapacity, monthlyLoanPaymentAmount, monthlyPropertyChargesOfRentedProperty, annualPropertyTaxOfRentedProperty, agencyFees, grossMonthlyRentReceived, taxBracket, loanDuration, netInvestmentSavingsRate, remainingSavingsAmount, monthlyPropertyCharges, inflationRateCharges, rentalIncomeRevaluationRate);
    calculAddtionalSavingsPlacedScenario1(monthlySavingsCapacity, monthlyPropertyCharges, monthlyLoanPaymentAmount, monthlyPropertyChargesRp, annualPropertyTaxRp, netInvestmentSavingsRate, loanDuration);
    calculTotalScenario1(propertyValueAmount, monthlySavingsCapacity, monthlyPropertyCharges, monthlyLoanPaymentAmount, monthlyPropertyChargesRp, annualPropertyTaxRp, netInvestmentSavingsRate, loanDuration, remainingSavingsAmount, inflationRateCharges);
    calculBestResult(propertyValueAmount, monthlySavingsCapacity, monthlyPropertyCharges, monthlyLoanPaymentAmount, monthlyPropertyChargesRp, annualPropertyTaxRp, netInvestmentSavingsRate, loanDuration, remainingSavingsAmount, inflationRateCharges, initialSavings, monthlyPropertyChargesOfRentedProperty, annualPropertyTaxOfRentedProperty, agencyFees, grossMonthlyRentReceived, taxBracket, rentalIncomeRevaluationRate);
  }
});

function calculOnInputEventListener(input, calculFunction) {
    input.addEventListener('input', calculFunction);
}

function calculBorrowedCapital(realEstatePrice, aquisitionCosts, deposit) {
    const borrowedCapitalText = document.getElementById('borrowed-capital');

    const borrowedCapitalResult = Math.round(realEstatePrice + aquisitionCosts - deposit);
    borrowedCapitalText.textContent = borrowedCapitalResult.toLocaleString("fr-FR");

    return borrowedCapitalResult;
}

/*function calculMonthlyLoanPayment(borrowedCapitalAmount, loanDuration, loanRate, costOfInsuranceAmount) {
    const monthlyLoadPaymentText = document.getElementById('monthly-loan-payment');

    const monthlyLoanPaymentResult = Math.round(
      ((borrowedCapitalAmount * loanDuration / 
      (1 - Math.pow(1 + (loanRate / 12), -12 * loanDuration))) + 
      (costOfInsuranceAmount / loanDuration)) / 12
    );
    monthlyLoadPaymentText.textContent = monthlyLoanPaymentResult.toLocaleString("fr-FR");

    return monthlyLoanPaymentResult;
}*/

function calculMonthlyLoanPayment(borrowedCapitalAmount, loanDuration, loanRateSlider, costOfInsuranceAmount) {
  const monthlyLoadPaymentText = document.getElementById('monthly-loan-payment');

  const annualLoanRate = parseFloat(loanRateSlider.dataset.actualValue);
  const monthlyLoanRate = annualLoanRate / 12 / 100;
  const totalMonths = loanDuration * 12;

  const monthlyPayment = borrowedCapitalAmount * monthlyLoanRate / (1 - Math.pow(1 + monthlyLoanRate, -totalMonths));

  const totalMonthlyPayment = Math.round(monthlyPayment + (costOfInsuranceAmount / totalMonths));
  monthlyLoadPaymentText.textContent = totalMonthlyPayment.toLocaleString("fr-FR");

  return totalMonthlyPayment;
}

function calculCostOfInsurance(borrowedCapitalAmount, loanDuration, insuranceRateSlider) {
    const costOfInsuranceText = document.getElementById('cost-of-insurance');

    const insuranceRate = parseFloat(insuranceRateSlider.value);

    const costOfInsuranceResult = Math.round(borrowedCapitalAmount * loanDuration * (insuranceRate / 100));
    costOfInsuranceText.textContent = costOfInsuranceResult.toLocaleString("fr-FR");

    return costOfInsuranceResult;
}

function calculLoanCost(loanDuration, borrowedCapitalAmount, costOfInsuranceAmount, monthlyLoanPaymentAmount) {
    const loanCostText = document.getElementById('loan-cost');

    const loanCostResult = Math.round(12 * loanDuration * monthlyLoanPaymentAmount - borrowedCapitalAmount - costOfInsuranceAmount);
    loanCostText.textContent = loanCostResult.toLocaleString("fr-FR");

    return loanCostResult;
}

function calculRemainaingSavings(initialSavings, depositSlider) {
    const remainingSavingsText = document.getElementById('remaining-savings');

    const deposit = parseFloat(depositSlider.value);

    const remainingSavingsResult = Math.round(initialSavings - deposit);
    remainingSavingsText.textContent = remainingSavingsResult.toLocaleString("fr-FR");

    return remainingSavingsResult;
}

function calculValueOfProperty(realEstatePrice, rateOfChange, loanDuration) {
  const valueOfPropertyText = document.querySelectorAll('.value-of-property');

  const valueOfPropertyResult = Math.round(realEstatePrice * Math.pow(1 + rateOfChange, loanDuration));
  valueOfPropertyText.forEach((text) => {
    text.textContent = valueOfPropertyResult.toLocaleString("fr-FR");
  });

  return valueOfPropertyResult;
}

function calculInitialSavingsPlaced(remainingSavingsAmount, netInvestmentSavingsRate, loanDuration) {
  const initialSavingsPlacedText = document.querySelectorAll('.initial-savings-placed');

  const initialSavingsPlacedResult = Math.round(remainingSavingsAmount * Math.pow(1 + netInvestmentSavingsRate, loanDuration));
  initialSavingsPlacedText.forEach((text) => {
    text.textContent = initialSavingsPlacedResult.toLocaleString("fr-FR");
  });

  return initialSavingsPlacedResult;
}

function calculAdditionalCostOfInflationRentalCharges(monthlyPropertyCharges, loanDuration, inflationRateCharges) {
  const additionalCostOfInflationRentalChargesText = document.querySelectorAll('.additional-cost-of-inflation-rental-charges');

  const additionalCostOfInflationRentalChargesResult = Math.round(
    12 * monthlyPropertyCharges *
    (loanDuration - (Math.pow(1 + inflationRateCharges, loanDuration) - 1) / inflationRateCharges)
  );  

  additionalCostOfInflationRentalChargesText.forEach((text) => {
    text.textContent = additionalCostOfInflationRentalChargesResult.toLocaleString("fr-FR");
  });

  return additionalCostOfInflationRentalChargesResult;
}


// calcul scenario 1

function calculAddtionalSavingsPlacedScenario1(monthlySavingsCapacity, monthlyPropertyCharges, monthlyLoanPaymentAmount, monthlyPropertyChargesRp, annualPropertyTaxRp, netInvestmentSavingsRate, loanDuration) {
  const additionalSavingsPlacedText = document.getElementById('additional-savings-placed-1');

  let additionalSavingsPlacedResult;

  if ((monthlySavingsCapacity + monthlyPropertyCharges - monthlyLoanPaymentAmount - monthlyPropertyChargesRp - (annualPropertyTaxRp / 12)) > 0) {
    additionalSavingsPlacedResult = 12 * (monthlySavingsCapacity + monthlyPropertyCharges - monthlyLoanPaymentAmount - monthlyPropertyChargesRp - (annualPropertyTaxRp / 12)) * (
      (Math.pow(1 + netInvestmentSavingsRate, loanDuration) - 1) / netInvestmentSavingsRate
    );
  } else {
    additionalSavingsPlacedResult = 12 * (monthlySavingsCapacity + monthlyPropertyCharges - monthlyLoanPaymentAmount - monthlyPropertyChargesRp - (annualPropertyTaxRp / 12)) * loanDuration;
  }  

  additionalSavingsPlacedText.textContent = additionalSavingsPlacedResult.toLocaleString("fr-FR");

  return additionalSavingsPlacedResult;
}


function calculAdditionalCostOfInflationRpCharges(monthlyPropertyChargesRp, annualPropertyTaxRp, loanDuration, inflationRateCharges) {
  const additionalCostOfInflationRpChargesText = document.getElementById('additional-cost-of-inflation-rp-charges');

  const charges = 12 * monthlyPropertyChargesRp + annualPropertyTaxRp;
  const inflationFactor = (Math.pow(1 + inflationRateCharges, loanDuration) - 1) / inflationRateCharges;

  const additionalCostOfInflationRpChargesResult = Math.round(charges * inflationFactor);

  additionalCostOfInflationRpChargesText.textContent = additionalCostOfInflationRpChargesResult.toLocaleString("fr-FR");

  return additionalCostOfInflationRpChargesResult;
}

function calculTotalScenario1(propertyValueAmount, monthlySavingsCapacity, monthlyPropertyCharges, monthlyLoanPaymentAmount, monthlyPropertyChargesRp, annualPropertyTaxRp, netInvestmentSavingsRate, loanDuration, remainingSavingsAmount, inflationRateCharges) {
  const totalText = document.getElementById('total-scenario-1');

  const additionalSavingsPlaced = calculAddtionalSavingsPlacedScenario1(monthlySavingsCapacity, monthlyPropertyCharges, monthlyLoanPaymentAmount, monthlyPropertyChargesRp, annualPropertyTaxRp, netInvestmentSavingsRate, loanDuration);

  const initialSavingsPlaced = calculInitialSavingsPlaced(remainingSavingsAmount, netInvestmentSavingsRate, loanDuration);

  const additionalCostOfInflationRpCharges = calculAdditionalCostOfInflationRpCharges(monthlyPropertyChargesRp, annualPropertyTaxRp, loanDuration, inflationRateCharges); 

  const totalResult = Math.round(propertyValueAmount + additionalSavingsPlaced + initialSavingsPlaced + additionalCostOfInflationRpCharges);
  totalText.textContent = totalResult.toLocaleString("fr-FR");

  return totalResult;
}



// calcul scenario 2

function calculAdditionalSavingsPlacedScenario2(monthlySavingsCapacity, loanDuration, netInvestmentSavingsRate) {
  const additionalSavingsPlacedText = document.getElementById('additional-savings-placed-2');

  const additionalSavingsPlacedResult = Math.round(
    (12 * monthlySavingsCapacity * ((Math.pow(1 + netInvestmentSavingsRate, loanDuration)) - 1)) 
    / netInvestmentSavingsRate
  );  

  additionalSavingsPlacedText.textContent = additionalSavingsPlacedResult.toLocaleString("fr-FR");

  return additionalSavingsPlacedResult;
}

function calculInitialSavingsPlacedScenario2(initialSavings, netInvestmentSavingsRate, loanDuration) {
  const initialSavingsPlacedText = document.getElementById('initial-savings-placed-2');

  const initialSavingsPlacedResult = Math.round(initialSavings * Math.pow(1 + netInvestmentSavingsRate, loanDuration));
  initialSavingsPlacedText.textContent = initialSavingsPlacedResult.toLocaleString("fr-FR");

  return initialSavingsPlacedResult;
}

function calculTotalScenario2(monthlySavingsCapacity, loanDuration, netInvestmentSavingsRate, initialSavings, monthlyPropertyCharges, inflationRateCharges) {
  const totalText = document.getElementById('total-scenario-2');

  const additionalSavingsPlaced = calculAdditionalSavingsPlacedScenario2(monthlySavingsCapacity, loanDuration, netInvestmentSavingsRate);

  const initialSavingsPlaced = calculInitialSavingsPlacedScenario2(initialSavings, netInvestmentSavingsRate, loanDuration);

  const additionalCostOfInflationRentalCharges = calculAdditionalCostOfInflationRentalCharges(monthlyPropertyCharges, loanDuration, inflationRateCharges); 

  const totalResult = Math.round(additionalSavingsPlaced + initialSavingsPlaced + additionalCostOfInflationRentalCharges);
  totalText.textContent = totalResult.toLocaleString("fr-FR");

  return totalResult;
}



// calcul scenario 3

/*function calculAddtionalSavingsPlacedScenario3(monthlySavingsCapacity, monthlyLoanPaymentAmount, monthlyPropertyChargesOfRentedProperty, annualPropertyTaxOfRentedProperty, agencyFees, grossMonthlyRentReceived, taxBracket, loanDuration) {
  const additionalSavingsPlacedText = document.getElementById('additional-savings-placed-3');

  let additionalSavingsPlacedResult;

  if (monthlySavingsCapacity - monthlyLoanPaymentAmount - monthlyPropertyChargesOfRentedProperty - (annualPropertyTaxOfRentedProperty / 12) - agencyFees + grossMonthlyRentReceived * (1 - 0.7 * (taxBracket + 0.172)) > 0) {
    additionalSavingsPlacedResult = Math.round(12 * (monthlySavingsCapacity - monthlyLoanPaymentAmount - monthlyPropertyChargesOfRentedProperty - (annualPropertyTaxOfRentedProperty / 12) - agencyFees + grossMonthlyRentReceived * (1 - 0.7 * (taxBracket + 0.172))) * (((1 + netInvestmentSavingsRate) ^ loanDuration) - 1) / netInvestmentSavingsRate);
  } else {
    additionalSavingsPlacedResult = Math.round(12 * loanDuration * (monthlySavingsCapacity - monthlyLoanPaymentAmount - monthlyPropertyChargesOfRentedProperty - (annualPropertyTaxOfRentedProperty / 12) - agencyFees + grossMonthlyRentReceived * (1 - 0.7 * (taxBracket + 0.172))));
  }  

  additionalSavingsPlacedText.textContent = additionalSavingsPlacedResult.toLocaleString("fr-FR");

  return additionalSavingsPlacedResult;
}*/

function calculAddtionalSavingsPlacedScenario3(
  monthlySavingsCapacity, 
  monthlyLoanPaymentAmount, 
  monthlyPropertyChargesOfRentedProperty, 
  annualPropertyTaxOfRentedProperty, 
  agencyFees, 
  grossMonthlyRentReceived, 
  taxBracket, 
  loanDuration, 
  netInvestmentSavingsRate
) {
  const additionalSavingsPlacedText = document.getElementById('additional-savings-placed-3');

  let additionalSavingsPlacedResult;

  const availableAmount = monthlySavingsCapacity - monthlyLoanPaymentAmount - monthlyPropertyChargesOfRentedProperty - (annualPropertyTaxOfRentedProperty / 12) - agencyFees + grossMonthlyRentReceived * (1 - 0.7 * (taxBracket + 0.172));

  if (availableAmount > 0) {
    additionalSavingsPlacedResult = Math.round(
      12 * availableAmount * (Math.pow(1 + netInvestmentSavingsRate, loanDuration) - 1) / netInvestmentSavingsRate
    );
  } else {
    additionalSavingsPlacedResult = Math.round(
      12 * loanDuration * availableAmount
    );
  }

  additionalSavingsPlacedText.textContent = additionalSavingsPlacedResult.toLocaleString("fr-FR");

  return additionalSavingsPlacedResult;
}


function calculRevaluationOfRentalIncome(grossMonthlyRentReceived, taxBracket, rentalIncomeRevaluationRate, loanDuration) {
  const revaluationOfRentalIncomeText = document.getElementById('revaluation-of-rental-income');

  const revaluationOfRentalIncomeResult = Math.round(12 * grossMonthlyRentReceived * (1 - 0.7 * (taxBracket + 0.172)) * (((((1 + rentalIncomeRevaluationRate) ** loanDuration) - 1) / rentalIncomeRevaluationRate) - loanDuration));
  revaluationOfRentalIncomeText.textContent = revaluationOfRentalIncomeResult.toLocaleString("fr-FR");

  return revaluationOfRentalIncomeResult;
}

function calculAdditionalCostInflationChargesOfTheRentedProperty(annualPropertyTaxOfRentedProperty, monthlyPropertyChargesOfRentedProperty, loanDuration, inflationRateCharges) {
  const additionalCostInflationChargesOfTheRentedPropertyText = document.getElementById('additional-cost-inflation-charges-of-the-rented-property');

  const additionalCostInflationChargesOfTheRentedPropertyResult = Math.round((annualPropertyTaxOfRentedProperty + 12 * monthlyPropertyChargesOfRentedProperty) * (loanDuration - ((((1 + inflationRateCharges) ** loanDuration) - 1) / inflationRateCharges)));
  additionalCostInflationChargesOfTheRentedPropertyText.textContent = additionalCostInflationChargesOfTheRentedPropertyResult.toLocaleString("fr-FR");

  return additionalCostInflationChargesOfTheRentedPropertyResult;
}

function calculTotalScenario3(propertyValueAmount, monthlySavingsCapacity, monthlyLoanPaymentAmount, monthlyPropertyChargesOfRentedProperty, annualPropertyTaxOfRentedProperty, agencyFees, grossMonthlyRentReceived, taxBracket, loanDuration, netInvestmentSavingsRate, remainingSavingsAmount, monthlyPropertyCharges, inflationRateCharges, rentalIncomeRevaluationRate) {
  const totalText = document.getElementById('total-scenario-3');

  const additionalSavingsPlaced = calculAddtionalSavingsPlacedScenario3(monthlySavingsCapacity,monthlyLoanPaymentAmount, monthlyPropertyChargesOfRentedProperty, annualPropertyTaxOfRentedProperty, agencyFees, grossMonthlyRentReceived, taxBracket, loanDuration, netInvestmentSavingsRate);

  const initialSavingsPlaced = calculInitialSavingsPlaced(remainingSavingsAmount, netInvestmentSavingsRate, loanDuration);

  const additionalCostOfInflationRentalCharges = calculAdditionalCostOfInflationRentalCharges(monthlyPropertyCharges, loanDuration, inflationRateCharges); 

  const revaluationOfRentalIncome = calculRevaluationOfRentalIncome(grossMonthlyRentReceived, taxBracket, rentalIncomeRevaluationRate, loanDuration);

  const additionalCostInflationChargesOfTheRentedProperty =  calculAdditionalCostInflationChargesOfTheRentedProperty(annualPropertyTaxOfRentedProperty, monthlyPropertyChargesOfRentedProperty, loanDuration, inflationRateCharges)

  const totalResult = Math.round(propertyValueAmount + additionalSavingsPlaced + initialSavingsPlaced + additionalCostOfInflationRentalCharges + revaluationOfRentalIncome + additionalCostInflationChargesOfTheRentedProperty);
  totalText.textContent = totalResult.toLocaleString("fr-FR");

  return totalResult;
}




function calculBestResult(propertyValueAmount, monthlySavingsCapacity, monthlyPropertyCharges, monthlyLoanPaymentAmount, monthlyPropertyChargesRp, annualPropertyTaxRp, netInvestmentSavingsRate, loanDuration, remainingSavingsAmount, inflationRateCharges, initialSavings, monthlyPropertyChargesOfRentedProperty, annualPropertyTaxOfRentedProperty, agencyFees, grossMonthlyRentReceived, taxBracket, rentalIncomeRevaluationRate) {
  const resultWrapperScenario1 = document.getElementById('result-wrapper-1');
  const resultWrapperScenario2 = document.getElementById('result-wrapper-2');
  const resultWrapperScenario3 = document.getElementById('result-wrapper-3');

  resultWrapperScenario1.classList.remove('is-best-result');
  resultWrapperScenario2.classList.remove('is-best-result');
  resultWrapperScenario3.classList.remove('is-best-result');

  // const resultProfitableScenario1 = document.querySelector('.simulator_profitable-grid.is-scenario1');
  // const resultProfitableScenario2 = document.querySelector('.simulator_profitable-grid.is-scenario2');
  // const resultProfitableScenario3 = document.querySelector('.simulator_profitable-grid.is-scenario3');

  const resultProfitableScenario1 = document.getElementById('result-profitable-1');
  const resultProfitableScenario2 = document.getElementById('result-profitable-2');
  const resultProfitableScenario3 = document.getElementById('result-profitable-3');

  resultProfitableScenario1.classList.add('hide');
  resultProfitableScenario2.classList.add('hide');
  resultProfitableScenario3.classList.add('hide');

  const totalResultScenario1 = calculTotalScenario1(propertyValueAmount, monthlySavingsCapacity, monthlyPropertyCharges, monthlyLoanPaymentAmount, monthlyPropertyChargesRp, annualPropertyTaxRp, netInvestmentSavingsRate, loanDuration, remainingSavingsAmount, inflationRateCharges);

  const totalResultScenario2 = calculTotalScenario2(monthlySavingsCapacity, loanDuration, netInvestmentSavingsRate, initialSavings, monthlyPropertyCharges, inflationRateCharges);

  const totalResultScenario3 = calculTotalScenario3(propertyValueAmount, monthlySavingsCapacity, monthlyLoanPaymentAmount, monthlyPropertyChargesOfRentedProperty, annualPropertyTaxOfRentedProperty, agencyFees, grossMonthlyRentReceived, taxBracket, loanDuration, netInvestmentSavingsRate, remainingSavingsAmount, monthlyPropertyCharges, inflationRateCharges, rentalIncomeRevaluationRate);

  if (totalResultScenario1 > totalResultScenario2 && totalResultScenario1 > totalResultScenario3) {
    resultWrapperScenario1.classList.add('is-best-result');
    resultProfitableScenario1.classList.remove('hide');
  } else if (totalResultScenario2 > totalResultScenario1 && totalResultScenario2 > totalResultScenario3) {
    resultWrapperScenario2.classList.add('is-best-result');
    resultProfitableScenario2.classList.remove('hide');
  } else {
    resultWrapperScenario3.classList.add('is-best-result');
    resultProfitableScenario3.classList.remove('hide');
  }
}

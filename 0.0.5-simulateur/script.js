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
  const initialSavingsInput = document.getElementById("initial-savings");

  function calculBorrowedCapital(realEstatePrice, acquisitionCosts, deposit) {
    const borrowedCapitalText = document.getElementById('borrowed-capital');
    const borrowedCapitalResult = Math.round(realEstatePrice + acquisitionCosts - deposit);
    borrowedCapitalText.textContent = borrowedCapitalResult.toLocaleString("fr-FR");
    return borrowedCapitalResult;
  }

  const updateCalculations = (deposit) => {
    const realEstatePrice = parseFloat(realEstatePriceInput.value);
    const acquisitionCosts = parseFloat(acquisitionCostsInput.value);
    calculBorrowedCapital(realEstatePrice, acquisitionCosts, deposit);
  };

  const validateDepositLimit = (value) => {
    const maxDeposit = parseFloat(initialSavingsInput.value) || 0;
    return Math.min(value, maxDeposit);
  };

  rangeInput.addEventListener("input", () => {
    let value = parseInt(rangeInput.value, 10);
    value = validateDepositLimit(value);
    rangeInput.value = value;
    spanInput.textContent = value.toLocaleString("fr-FR");
    updateCalculations(value);
  });

  spanInput.addEventListener("input", () => {
    let rawValue = spanInput.textContent.replace(/\s+/g, "");
    let value = parseInt(rawValue, 10);

    if (!isNaN(value)) {
      value = validateDepositLimit(value);
      rangeInput.value = value;
      updateCalculations(value);
    }
  });

  spanInput.addEventListener("blur", () => {
    let rawValue = spanInput.textContent.replace(/\s+/g, "");
    let value = parseInt(rawValue, 10);

    if (!isNaN(value)) {
      value = validateDepositLimit(value);
      spanInput.textContent = value.toLocaleString("fr-FR");
      rangeInput.value = value;
      updateCalculations(value);
    } else {
      spanInput.textContent = parseInt(rangeInput.value, 10).toLocaleString("fr-FR");
    }
  });

  spanInput.addEventListener("keypress", (event) => {
    if (!/[\d\s]/.test(event.key)) {
      event.preventDefault();
    }
  });

  initialSavingsInput.addEventListener("input", () => {
    const maxSavings = parseFloat(initialSavingsInput.value) || 0;
    let currentDeposit = parseInt(rangeInput.value, 10);
    if (currentDeposit > maxSavings) {
      rangeInput.value = maxSavings;
      spanInput.textContent = maxSavings.toLocaleString("fr-FR");
      updateCalculations(maxSavings);
    }
  });

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

  function validateDepositLimit() {
    const initialSavings = parseFloat(initialSavingsInput.value) || 0;
    const depositValue = parseFloat(depositSlider.value) || 0;

    if (depositValue > initialSavings) {
      depositSlider.value = initialSavings;
    }
  }

  initialSavingsInput.addEventListener('input', validateDepositLimit);
  depositSlider.addEventListener('input', validateDepositLimit);

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

    if (!areRequiredFieldsFilled(monthlyPropertyCharges, initialSavings, monthlySavingsCapacity, realEstatePrice, aquisitionCosts)) {
      document.getElementById('borrowed-capital').innerHTML = 'O';
      console.log("Veuillez remplir tous les champs requis avant de lancer les calculs.");
      return;
    }

    const borrowedCapitalAmount = calculBorrowedCapital(realEstatePrice, aquisitionCosts, deposit);
    const costOfInsuranceAmount = calculCostOfInsurance(borrowedCapitalAmount, loanDuration, insuranceRateSlider);
    const monthlyLoanPaymentAmount = calculMonthlyLoanPayment(borrowedCapitalAmount, loanDuration, loanRateSlider, costOfInsuranceAmount);
    calculLoanCost(loanDuration, borrowedCapitalAmount, costOfInsuranceAmount, monthlyLoanPaymentAmount);
    const remainingSavingsAmount = calculRemainaingSavings(initialSavings, depositSlider);
    const propertyValueAmount = calculValueOfProperty(realEstatePrice, rateOfChange, loanDuration);
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
    showAttentionPicto(remainingSavingsAmount, propertyValueAmount, monthlySavingsCapacity, loanDuration, netInvestmentSavingsRate, initialSavings, monthlyPropertyCharges, inflationRateCharges, monthlyLoanPaymentAmount, monthlyPropertyChargesRp, annualPropertyTaxRp, monthlyPropertyChargesOfRentedProperty, annualPropertyTaxOfRentedProperty, agencyFees, grossMonthlyRentReceived, taxBracket, rentalIncomeRevaluationRate);
  }

  function areRequiredFieldsFilled(monthlyPropertyCharges, initialSavings, monthlySavingsCapacity, realEstatePrice, aquisitionCosts) {
    return (
        !isNaN(monthlyPropertyCharges) &&
        !isNaN(initialSavings) &&
        !isNaN(monthlySavingsCapacity) &&
        !isNaN(realEstatePrice) &&
        !isNaN(aquisitionCosts)
    );
  }
});

function calculOnInputEventListener(input, calculFunction) {
    input.addEventListener('input', calculFunction);
}

function calculBorrowedCapital(realEstatePrice, aquisitionCosts, deposit) {
    const borrowedCapitalText = document.getElementById('borrowed-capital');

    const borrowedCapitalResult = realEstatePrice + aquisitionCosts - deposit;
    borrowedCapitalText.textContent = Math.round(borrowedCapitalResult).toLocaleString("fr-FR");

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

  const monthlyPayment = borrowedCapitalAmount * monthlyLoanRate / (1 - (1 + monthlyLoanRate) ** -totalMonths);

  const totalMonthlyPayment = monthlyPayment + (costOfInsuranceAmount / totalMonths);
  monthlyLoadPaymentText.textContent = Math.round(totalMonthlyPayment).toLocaleString("fr-FR");

  return totalMonthlyPayment;
}

function calculCostOfInsurance(borrowedCapitalAmount, loanDuration, insuranceRateSlider) {
    const costOfInsuranceText = document.getElementById('cost-of-insurance');

    const insuranceRate = parseFloat(insuranceRateSlider.value);

    const costOfInsuranceResult = borrowedCapitalAmount * loanDuration * (insuranceRate / 100);
    costOfInsuranceText.textContent = Math.round(costOfInsuranceResult).toLocaleString("fr-FR");

    return costOfInsuranceResult;
}

function calculLoanCost(loanDuration, borrowedCapitalAmount, costOfInsuranceAmount, monthlyLoanPaymentAmount) {
    const loanCostText = document.getElementById('loan-cost');

    const loanCostResult = 12 * loanDuration * monthlyLoanPaymentAmount - borrowedCapitalAmount - costOfInsuranceAmount;
    loanCostText.textContent = Math.round(loanCostResult).toLocaleString("fr-FR");

    return loanCostResult;
}

function calculRemainaingSavings(initialSavings, depositSlider) {
    const remainingSavingsText = document.getElementById('remaining-savings');

    const deposit = parseFloat(depositSlider.value);

    const remainingSavingsResult = initialSavings - deposit;
    remainingSavingsText.textContent = Math.round(remainingSavingsResult).toLocaleString("fr-FR");

    return remainingSavingsResult;
}

function calculValueOfProperty(realEstatePrice, rateOfChange, loanDuration) {
  const valueOfPropertyText = document.querySelectorAll('.value-of-property');

  const valueOfPropertyResult = realEstatePrice * (1 + rateOfChange) ** loanDuration;
  valueOfPropertyText.forEach((text) => {
    text.textContent = Math.round(valueOfPropertyResult).toLocaleString("fr-FR");
  });

  return valueOfPropertyResult;
}

function calculInitialSavingsPlaced(remainingSavingsAmount, netInvestmentSavingsRate, loanDuration) {
  const initialSavingsPlacedText = document.querySelectorAll('.initial-savings-placed');

  const initialSavingsPlacedResult = remainingSavingsAmount * (1 + netInvestmentSavingsRate) ** loanDuration;
  initialSavingsPlacedText.forEach((text) => {
    text.textContent = Math.round(initialSavingsPlacedResult).toLocaleString("fr-FR");
  });

  return initialSavingsPlacedResult;
}

function calculAdditionalCostOfInflationRentalCharges(monthlyPropertyCharges, loanDuration, inflationRateCharges) {
  const additionalCostOfInflationRentalChargesText = document.querySelectorAll('.additional-cost-of-inflation-rental-charges');

  const additionalCostOfInflationRentalChargesResult = 12 * monthlyPropertyCharges * (loanDuration - ((1 + inflationRateCharges) ** loanDuration - 1) / inflationRateCharges);

  additionalCostOfInflationRentalChargesText.forEach((text) => {
    text.textContent = Math.round(additionalCostOfInflationRentalChargesResult).toLocaleString("fr-FR");
  });

  return additionalCostOfInflationRentalChargesResult;
}


// calcul scenario 1

function calculAddtionalSavingsPlacedScenario1(monthlySavingsCapacity, monthlyPropertyCharges, monthlyLoanPaymentAmount, monthlyPropertyChargesRp, annualPropertyTaxRp, netInvestmentSavingsRate, loanDuration) {
  const additionalSavingsPlacedText = document.getElementById('additional-savings-placed-1');

  let additionalSavingsPlacedResult;

  if ((monthlySavingsCapacity + monthlyPropertyCharges - monthlyLoanPaymentAmount - monthlyPropertyChargesRp - (annualPropertyTaxRp / 12)) > 0) {
    additionalSavingsPlacedResult = 12 * (monthlySavingsCapacity + monthlyPropertyCharges - monthlyLoanPaymentAmount - monthlyPropertyChargesRp - (annualPropertyTaxRp / 12)) * (
      ((1 + netInvestmentSavingsRate) ** loanDuration - 1) / netInvestmentSavingsRate
    );    
  } else {
    additionalSavingsPlacedResult = 12 * (monthlySavingsCapacity + monthlyPropertyCharges - monthlyLoanPaymentAmount - monthlyPropertyChargesRp - (annualPropertyTaxRp / 12)) * loanDuration;
  }  

  additionalSavingsPlacedText.textContent = Math.round(additionalSavingsPlacedResult).toLocaleString("fr-FR");

  return additionalSavingsPlacedResult;
}


function calculAdditionalCostOfInflationRpCharges(monthlyPropertyChargesRp, annualPropertyTaxRp, loanDuration, inflationRateCharges) {
  const additionalCostOfInflationRpChargesText = document.getElementById('additional-cost-of-inflation-rp-charges');

  const charges = 12 * monthlyPropertyChargesRp + annualPropertyTaxRp;
  const inflationFactor = ((1 + inflationRateCharges) ** loanDuration - 1) / inflationRateCharges;

  // const additionalCostOfInflationRpChargesResult = Math.round(charges * inflationFactor);

  const additionalCostOfInflationRpChargesResult = (loanDuration - charges) * inflationFactor;

  additionalCostOfInflationRpChargesText.textContent = Math.round(additionalCostOfInflationRpChargesResult).toLocaleString("fr-FR");

  return additionalCostOfInflationRpChargesResult;
}

function calculTotalScenario1(propertyValueAmount, monthlySavingsCapacity, monthlyPropertyCharges, monthlyLoanPaymentAmount, monthlyPropertyChargesRp, annualPropertyTaxRp, netInvestmentSavingsRate, loanDuration, remainingSavingsAmount, inflationRateCharges) {
  const totalText = document.getElementById('total-scenario-1');

  const additionalSavingsPlaced = calculAddtionalSavingsPlacedScenario1(monthlySavingsCapacity, monthlyPropertyCharges, monthlyLoanPaymentAmount, monthlyPropertyChargesRp, annualPropertyTaxRp, netInvestmentSavingsRate, loanDuration);

  const initialSavingsPlaced = calculInitialSavingsPlaced(remainingSavingsAmount, netInvestmentSavingsRate, loanDuration);

  const additionalCostOfInflationRpCharges = calculAdditionalCostOfInflationRpCharges(monthlyPropertyChargesRp, annualPropertyTaxRp, loanDuration, inflationRateCharges); 

  const totalResult = propertyValueAmount + additionalSavingsPlaced + initialSavingsPlaced + additionalCostOfInflationRpCharges;
  totalText.textContent = Math.round(totalResult).toLocaleString("fr-FR");

  return totalResult;
}



// calcul scenario 2

function calculAdditionalSavingsPlacedScenario2(monthlySavingsCapacity, loanDuration, netInvestmentSavingsRate) {
  const additionalSavingsPlacedText = document.getElementById('additional-savings-placed-2');

  const additionalSavingsPlacedResult = (12 * monthlySavingsCapacity * ((1 + netInvestmentSavingsRate) ** loanDuration - 1)) / netInvestmentSavingsRate;

  additionalSavingsPlacedText.textContent = Math.round(additionalSavingsPlacedResult).toLocaleString("fr-FR");

  return additionalSavingsPlacedResult;
}

function calculInitialSavingsPlacedScenario2(initialSavings, netInvestmentSavingsRate, loanDuration) {
  const initialSavingsPlacedText = document.getElementById('initial-savings-placed-2');

  const initialSavingsPlacedResult = initialSavings * (1 + netInvestmentSavingsRate) ** loanDuration;
  initialSavingsPlacedText.textContent = Math.round(initialSavingsPlacedResult).toLocaleString("fr-FR");

  return initialSavingsPlacedResult;
}

function calculTotalScenario2(monthlySavingsCapacity, loanDuration, netInvestmentSavingsRate, initialSavings, monthlyPropertyCharges, inflationRateCharges) {
  const totalText = document.getElementById('total-scenario-2');

  const additionalSavingsPlaced = calculAdditionalSavingsPlacedScenario2(monthlySavingsCapacity, loanDuration, netInvestmentSavingsRate);

  const initialSavingsPlaced = calculInitialSavingsPlacedScenario2(initialSavings, netInvestmentSavingsRate, loanDuration);

  const additionalCostOfInflationRentalCharges = calculAdditionalCostOfInflationRentalCharges(monthlyPropertyCharges, loanDuration, inflationRateCharges); 

  const totalResult = additionalSavingsPlaced + initialSavingsPlaced + additionalCostOfInflationRentalCharges;
  totalText.textContent = Math.round(totalResult).toLocaleString("fr-FR");

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
    additionalSavingsPlacedResult = 12 * availableAmount * ((1 + netInvestmentSavingsRate) ** loanDuration - 1) / netInvestmentSavingsRate;
  } else {
    additionalSavingsPlacedResult = 12 * loanDuration * availableAmount;
  }

  additionalSavingsPlacedText.textContent = Math.round(additionalSavingsPlacedResult).toLocaleString("fr-FR");

  return additionalSavingsPlacedResult;
}


function calculRevaluationOfRentalIncome(grossMonthlyRentReceived, taxBracket, rentalIncomeRevaluationRate, loanDuration) {
  const revaluationOfRentalIncomeText = document.getElementById('revaluation-of-rental-income');

  const revaluationOfRentalIncomeResult = 12 * grossMonthlyRentReceived * (1 - 0.7 * (taxBracket + 0.172)) * (((((1 + rentalIncomeRevaluationRate) ** loanDuration) - 1) / rentalIncomeRevaluationRate) - loanDuration);
  revaluationOfRentalIncomeText.textContent = Math.round(revaluationOfRentalIncomeResult).toLocaleString("fr-FR");

  return revaluationOfRentalIncomeResult;
}

function calculAdditionalCostInflationChargesOfTheRentedProperty(annualPropertyTaxOfRentedProperty, monthlyPropertyChargesOfRentedProperty, loanDuration, inflationRateCharges) {
  const additionalCostInflationChargesOfTheRentedPropertyText = document.getElementById('additional-cost-inflation-charges-of-the-rented-property');

  const additionalCostInflationChargesOfTheRentedPropertyResult = (annualPropertyTaxOfRentedProperty + 12 * monthlyPropertyChargesOfRentedProperty) * (loanDuration - ((((1 + inflationRateCharges) ** loanDuration) - 1) / inflationRateCharges));
  additionalCostInflationChargesOfTheRentedPropertyText.textContent = Math.round(additionalCostInflationChargesOfTheRentedPropertyResult).toLocaleString("fr-FR");

  return additionalCostInflationChargesOfTheRentedPropertyResult;
}

function calculTotalScenario3(propertyValueAmount, monthlySavingsCapacity, monthlyLoanPaymentAmount, monthlyPropertyChargesOfRentedProperty, annualPropertyTaxOfRentedProperty, agencyFees, grossMonthlyRentReceived, taxBracket, loanDuration, netInvestmentSavingsRate, remainingSavingsAmount, monthlyPropertyCharges, inflationRateCharges, rentalIncomeRevaluationRate) {
  const totalText = document.getElementById('total-scenario-3');

  const additionalSavingsPlaced = calculAddtionalSavingsPlacedScenario3(monthlySavingsCapacity,monthlyLoanPaymentAmount, monthlyPropertyChargesOfRentedProperty, annualPropertyTaxOfRentedProperty, agencyFees, grossMonthlyRentReceived, taxBracket, loanDuration, netInvestmentSavingsRate);

  const initialSavingsPlaced = calculInitialSavingsPlaced(remainingSavingsAmount, netInvestmentSavingsRate, loanDuration);

  const additionalCostOfInflationRentalCharges = calculAdditionalCostOfInflationRentalCharges(monthlyPropertyCharges, loanDuration, inflationRateCharges); 

  const revaluationOfRentalIncome = calculRevaluationOfRentalIncome(grossMonthlyRentReceived, taxBracket, rentalIncomeRevaluationRate, loanDuration);

  const additionalCostInflationChargesOfTheRentedProperty =  calculAdditionalCostInflationChargesOfTheRentedProperty(annualPropertyTaxOfRentedProperty, monthlyPropertyChargesOfRentedProperty, loanDuration, inflationRateCharges)

  const totalResult = propertyValueAmount + additionalSavingsPlaced + initialSavingsPlaced + additionalCostOfInflationRentalCharges + revaluationOfRentalIncome + additionalCostInflationChargesOfTheRentedProperty;
  totalText.textContent = Math.round(totalResult).toLocaleString("fr-FR");

  return totalResult;
}




function calculBestResult(propertyValueAmount, monthlySavingsCapacity, monthlyPropertyCharges, monthlyLoanPaymentAmount, monthlyPropertyChargesRp, annualPropertyTaxRp, netInvestmentSavingsRate, loanDuration, remainingSavingsAmount, inflationRateCharges, initialSavings, monthlyPropertyChargesOfRentedProperty, annualPropertyTaxOfRentedProperty, agencyFees, grossMonthlyRentReceived, taxBracket, rentalIncomeRevaluationRate) {
  const resultWrapperScenario1 = document.getElementById('result-wrapper-1');
  const resultWrapperScenario2 = document.getElementById('result-wrapper-2');
  const resultWrapperScenario3 = document.getElementById('result-wrapper-3');

  resultWrapperScenario1.classList.remove('is-best-result');
  resultWrapperScenario2.classList.remove('is-best-result');
  resultWrapperScenario3.classList.remove('is-best-result');

  const resultProfitableScenario1 = document.getElementById('profitable-1');
  const resultProfitableScenario2 = document.getElementById('profitable-2');
  const resultProfitableScenario3 = document.getElementById('profitable-3');

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


function showAttentionPicto(remainingSavingsAmount, propertyValueAmount, monthlySavingsCapacity, loanDuration, netInvestmentSavingsRate, initialSavings, monthlyPropertyCharges, inflationRateCharges, monthlyLoanPaymentAmount, monthlyPropertyChargesRp, annualPropertyTaxRp, monthlyPropertyChargesOfRentedProperty, annualPropertyTaxOfRentedProperty, agencyFees, grossMonthlyRentReceived, taxBracket, rentalIncomeRevaluationRate) {
  const totalResultScenario2 = calculTotalScenario2(monthlySavingsCapacity, loanDuration, netInvestmentSavingsRate, initialSavings, monthlyPropertyCharges, inflationRateCharges);

  const notEnoughMoney2 = document.getElementById('not-enough-money-2');
  const savingsConsuming2 = document.getElementById('savings-consuming-2');

  notEnoughMoney2.classList.add('hide');
  savingsConsuming2.classList.add('hide');

  if (totalResultScenario2 < 0) {
    notEnoughMoney2.classList.remove('hide');
  } else if (0 < totalResultScenario2 && totalResultScenario2 < remainingSavingsAmount) {
    savingsConsuming2.classList.remove('hide');
  }

  const totalResultScenario1 = calculTotalScenario1(propertyValueAmount, monthlySavingsCapacity, monthlyPropertyCharges, monthlyLoanPaymentAmount, monthlyPropertyChargesRp, annualPropertyTaxRp, netInvestmentSavingsRate, loanDuration, remainingSavingsAmount, inflationRateCharges);

  const notEnoughMoney1 = document.getElementById('not-enough-money-1');
  const savingsConsuming1 = document.getElementById('savings-consuming-1');

  notEnoughMoney1.classList.add('hide');
  savingsConsuming1.classList.add('hide');

  if ((totalResultScenario1 - propertyValueAmount) < 0) {
    notEnoughMoney1.classList.remove('hide');
  } else if (0 < (totalResultScenario1 - propertyValueAmount) && (totalResultScenario1 - propertyValueAmount) < remainingSavingsAmount) {
    savingsConsuming1.classList.remove('hide');
  }

  const totalResultScenario3 = calculTotalScenario3(propertyValueAmount, monthlySavingsCapacity, monthlyLoanPaymentAmount, monthlyPropertyChargesOfRentedProperty, annualPropertyTaxOfRentedProperty, agencyFees, grossMonthlyRentReceived, taxBracket, loanDuration, netInvestmentSavingsRate, remainingSavingsAmount, monthlyPropertyCharges, inflationRateCharges, rentalIncomeRevaluationRate);

  const notEnoughMoney3 = document.getElementById('not-enough-money-3');
  const savingsConsuming3 = document.getElementById('savings-consuming-3');

  notEnoughMoney3.classList.add('hide');
  savingsConsuming3.classList.add('hide');

  if ((totalResultScenario3 - propertyValueAmount) < 0) {
    notEnoughMoney3.classList.remove('hide');
  } else if (0 < (totalResultScenario3 - propertyValueAmount) && (totalResultScenario3 - propertyValueAmount) < remainingSavingsAmount) {
    savingsConsuming3.classList.remove('hide');
  }
}
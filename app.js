const MAX_YEARS = 100;
const MAX_RATE = 100;

const elements = {
  form: document.getElementById("calculator-form"),
  startingAmount: document.getElementById("starting-amount"),
  monthlyContribution: document.getElementById("monthly-contribution"),
  interestRate: document.getElementById("interest-rate"),
  years: document.getElementById("years"),
  currency: document.getElementById("currency"),
  startingAmountError: document.getElementById("starting-amount-error"),
  monthlyContributionError: document.getElementById("monthly-contribution-error"),
  interestRateError: document.getElementById("interest-rate-error"),
  yearsError: document.getElementById("years-error"),
  resultValue: document.getElementById("result-value"),
  resultSummary: document.getElementById("result-summary"),
  contributionsValue: document.getElementById("contributions-value"),
  interestValue: document.getElementById("interest-value"),
  resultSection: document.getElementById("result-section")
};

function init() {
  elements.form.addEventListener("submit", handleSubmit);
  elements.currency.addEventListener("change", calculateAndRender);
  calculateAndRender();
}

function handleSubmit(event) {
  event.preventDefault();
  if (!validateInputs()) return;
  calculateAndRender();
  elements.resultSection.scrollIntoView({
    behavior: prefersReducedMotion() ? "auto" : "smooth",
    block: "start"
  });
}

function calculateAndRender() {
  if (!validateInputs()) return;
  const startingAmount = toNumber(elements.startingAmount.value);
  const monthlyContribution = toNumber(elements.monthlyContribution.value);
  const annualRate = toNumber(elements.interestRate.value);
  const years = toNumber(elements.years.value);
  const currency = elements.currency.value;
  const result = calculateCompoundInterest(startingAmount, monthlyContribution, annualRate, years);
  renderResult(result, years, annualRate, currency);
}

function calculateCompoundInterest(startingAmount, monthlyContribution, annualRate, years) {
  const totalMonths = Math.round(years * 12);
  const monthlyRate = annualRate / 100 / 12;
  let balance = startingAmount;
  for (let month = 0; month < totalMonths; month += 1) {
    balance *= 1 + monthlyRate;
    balance += monthlyContribution;
  }
  const totalContributions = startingAmount + monthlyContribution * totalMonths;
  return {
    futureBalance: balance,
    totalContributions,
    interestEarned: Math.max(0, balance - totalContributions)
  };
}

function renderResult(result, years, annualRate, currency) {
  elements.resultValue.textContent = formatMoney(result.futureBalance, currency);
  elements.contributionsValue.textContent = formatMoney(result.totalContributions, currency);
  elements.interestValue.textContent = formatMoney(result.interestEarned, currency);
  const yearLabel = years === 1 ? "year" : "years";
  elements.resultSummary.textContent = `After ${formatNumber(years)} ${yearLabel} at ${formatNumber(annualRate)}% annual interest.`;
}

function validateInputs() {
  clearErrors();
  const startingAmount = toNumber(elements.startingAmount.value);
  const monthlyContribution = toNumber(elements.monthlyContribution.value);
  const annualRate = toNumber(elements.interestRate.value);
  const years = toNumber(elements.years.value);
  let isValid = true;
  if (!Number.isFinite(startingAmount) || startingAmount < 0) {
    setError(elements.startingAmountError, "Enter a starting amount of 0 or more."); isValid = false;
  }
  if (!Number.isFinite(monthlyContribution) || monthlyContribution < 0) {
    setError(elements.monthlyContributionError, "Enter a monthly contribution of 0 or more."); isValid = false;
  }
  if (!Number.isFinite(annualRate) || annualRate < 0 || annualRate > MAX_RATE) {
    setError(elements.interestRateError, `Enter a rate between 0 and ${MAX_RATE}%.`); isValid = false;
  }
  if (!Number.isFinite(years) || years < 1 || years > MAX_YEARS) {
    setError(elements.yearsError, `Enter a time between 1 and ${MAX_YEARS} years.`); isValid = false;
  }
  return isValid;
}

function clearErrors() {
  elements.startingAmountError.textContent = "";
  elements.monthlyContributionError.textContent = "";
  elements.interestRateError.textContent = "";
  elements.yearsError.textContent = "";
}

function setError(element, message) { element.textContent = message; }
function formatMoney(value, currency) { return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 0 }).format(value); }
function formatNumber(value) { return new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value); }
function toNumber(value) { return Number.parseFloat(value); }
function prefersReducedMotion() { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; }

init();

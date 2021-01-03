export default () => {
  const selectors = [...document.querySelectorAll(
    'a, button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
  )];
  selectors[selectors.findIndex(el => el == document.activeElement) + 1].focus();
}

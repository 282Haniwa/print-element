import printElement from '../../src/printElement';

const printButton = document.getElementById('print-button');
// eslint-disable-next-line no-unused-expressions
printButton?.addEventListener('click', () => {
  printElement('#print-element');
});

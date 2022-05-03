/**************************************************
 * Set data when page opens
 *************************************************/

// Add local data into bills variable
bills = getFromLocalStorage('bills', bills);
overview = getFromLocalStorage('overview', overview);

//////
// Check if bills has anything
console.log(bills, bills[0]);



/**************************************************
 * DOM Elements
 *************************************************/

// Form to Add Bills
const addBillsForm = document.querySelector('.modal-wrapper .add-bills');

// Transaction (Bills) List
const txList = document.querySelector('.tx-list');

//////
// Check if elements are available
// console.log(addBillsForm, txList);


/**************************************************
 * DOM Events
 *************************************************/

 loadDataInDOM();

/**
 * Format Currency Input
 */

// Define arguments for SimpleMaskMoney.
const currencyArgs = {
  allowNegative: false,
  negativeSignAfter: false,
  prefix: 'R$',
  suffix: '',
  fixed: true,
  fractionDigits: 2,
  decimalSeparator: '.',
  thousandsSeparator: ',',
  cursor: 'end'
};

// Select the element to set the mask on
const currencyInput = SimpleMaskMoney.setMask('input[name="amount"]', currencyArgs);

// Convert the input value to a number, which you can save e.g. to a database:
currencyInput.formatToNumber();


/**
 * Sends Form
 * 
 * TODO: Add multiple bills behavior — will keep modal open when adding new bills
 * TODO: Add single bill behavior — will add bill and close the modal
 */
addBillsForm.addEventListener('submit', (e) => {
  // Prevent the default submit event
  e.preventDefault();

  const categoryEl = document.querySelector('[name="category"]');
  const categorySlug = categoryEl.options[categoryEl.selectedIndex].getAttribute('data-slug');

  // Add form values to `bill` Object
  const bill = {
    desc: (document.querySelector(['[name="description"]'])).value,
    amount: (document.querySelector(['[name="amount"]'])).value,
    amountRaw: (document.querySelector(['[name="amountRaw"]'])).value,
    category: {
      key: (document.querySelector(['[name="category"]'])).value,
      slug: categorySlug
    },
    duedate: (document.querySelector(['[name="duedate"]'])).value,
    spender: (document.querySelector(['[name="spender"]'])).value,
    
    paid: false, 
  };

  // Check if `bill` is passing form data.
  console.log(bill);

  addBill(bill);
});

/******************************************************
 * Close Options List when clicking outside.
 */
document.addEventListener('click', (e) => {
  const txElements = document.querySelectorAll('.tx');

  txElements.forEach((el, index) => {
    const isTx = el.parentElement.contains(e.target);

    if (!isTx) {
      toggleTxOpen(el);
    }
  });
});


/**************************************************
 * Hotkey Events
 *************************************************/

const hotKeys = (e) => {
  let windowEvent = window.event ? window.event : e;

  if (windowEvent.keyCode === 78 && e.ctrlKey) {
    if (!modal.classList.contains('open')) {
      toggleModal();
    }
  }

  if (windowEvent.keyCode === 27) {
    if (modal.classList.contains('open')) {
      // Add conditional:
      // If inputs are filled, ask if you want to clear changes
      toggleModal();
    }
  }
}

document.onkeydown = hotKeys;


function inputChanged(inputChanged, hiddenInput) {
  const hidden = hiddenInput.value = inputChanged;

  console.log(hidden);
}

document.querySelector('[name="amount"]').addEventListener('keyup', (e) => {
  let inputValue = updateInputAmount(e.target.value);
  inputChanged(inputValue, document.querySelector('input[name="amountRaw"]'));

});

const updateInputAmount = (input) => {
  return +input.replace(/[^\de.-]/gi, "");
}

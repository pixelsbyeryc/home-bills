/**************************************************
 * Variables
 *************************************************/

// Gathers a list of bills
let bills = [];

// Gather all DOM elements in this array
let elementsDOM = [];








/**************************************************
 * Functions: Managing Data
 *************************************************/

/**
 * Adds a new bill
 * 
 * @param {Object} data - Passes the object from a form or manual input.
 */
function addBill(data) {
    
    // If `data` isn't empty...
    if (data !== '') {
        // Grab all the data passed and add it to an Object
        const bill = {
            amount: data.amount,
            amountRaw: parseInt(data.amountRaw),
            desc: data.desc,
            category: data.category,
            duedate: data.duedate,
            spender: data.spender,
            paid: !data.paid ? false : true,
            key: Date.now()
        };
        
        // Push the object into the `bills` Array
        bills.push(bill);
        
        // Add bills to localStorage
        addToLocalStorage('bills', bills);
        
        // TODO: Update DOM
        txList.append(createTxElement(bill));
    }
}

/**
 * Removes a Bill
 * 
 * @param {String} billKey - Passes the key to the bill that'll be removed
 */
function removeBill(billKey) {

    // Removes Bill from localStorage
    bills = bills.filter((bill) => {
        return bill.key != billKey;
    });
    addToLocalStorage('bills', bills);

    // Removes element from DOM
    const el = elementsDOM.find(element => element.dataset.key == billKey);
    el.remove();
    
    // Removes element from elementsDOM
    elementsDOM = elementsDOM.filter((element) => {
        return element.id != 'tx-' + billKey;
    });
}

/**
 * Adds data to a specific key in localStorage
 * 
 * @param {String} key - Defines the localStorage key
 * @param {Object} data - Passes an object with the data
 */
function addToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

/**
 * Gets data from a specific key in localStorage
 * 
 * @param {String} key - Defines the localStorage key you want to grab data from
 * @param {Array} data - Defines the Array you want to parse the data into
 * @returns {Array}
 */
function getFromLocalStorage(key, data) {
    // Use item key as a reference
    const ref = localStorage.getItem(key);

    // If the item key exists, add it to the bills 
    if (ref) {
        data = JSON.parse(ref);
    }
    
    // Returns the 
    return data;
}

/**
 * Toggles Paid
 * 
 * @param {Event} e - Passes the event.
 */
function togglePaid(e) {

    // Gets current TX
    const tx = e.currentTarget.closest('.tx');
    
    // Gets the key to the currentTarget
    const key = parseInt(tx.getAttribute('data-key'));

    const date = tx.querySelector('.tx-date').dateTime;

    let status = {};

    // Will map through bills Array and update the current bill to paid or not paid.
    bills = bills.map((bill) => {
        if (bill.key === key) {
            if (bill.paid === false) {
                bill.paid = true;
                status = setTxStatus(bill.paid, date);
            } else {
                bill.paid = false;
                status = setTxStatus(bill.paid, date);
            }
        }
        return bill;
    });

    // Adds new Array to localStorage
    addToLocalStorage('bills', bills);
    // TODO: Update DOM
    updateTxPaid(tx, status, date);
}




/**************************************************
 * Functions: Manages DOM States
 *************************************************/

function updateTxPaid(tx, status, date) {
    const txStatus = tx.querySelector('.tx-status');
    const txSwitch = tx.querySelector('.switch-wrapper');
    const switchButton = txSwitch.querySelector('.switch');
    const switchLabel = txSwitch.querySelector('.label');
    const switchCheckbox = txSwitch.querySelector('.switch-checkbox');
    const isPaid = status.className === '--paid' ? true : false;
    
    
    
    if (!isPaid) {
        tx.classList.remove('--paid');
        txStatus.classList.remove('--paid');
        txStatus.classList.add(status.className);
        txStatus.innerText = status.text;
        tx.classList.add(status.className);
        
        switchButton.ariaChecked = "false";
        switchButton.dataset.state = "unchecked";
        switchButton.value = "due";
        switchLabel.innerText = "Not Paid";
        switchCheckbox.value = "due";
    } else {
        tx.classList.remove('--due');
        tx.classList.remove('--late');
        txStatus.classList.remove('--due');
        txStatus.classList.remove('--late');
        txStatus.classList.add(status.className);
        txStatus.innerText = status.text;
        tx.classList.add(status.className);

        switchButton.ariaChecked = "true";
        switchButton.dataset.state = "checked";
        switchButton.value = "paid";
        switchLabel.innerText = "Paid";
        switchCheckbox.value = "paid";
    }
    
    
    // console.log('updated tx: ', tx, 'updated status: ', txStatus);
}

/**
 * Toggles transaction boxes open/closed.
 * 
 * @param {Event} e - Passes the event information.
 */
function toggleTxOpen(e) {

    // Finds a transaction that was already opened
    const openTx = document.querySelector('.tx.--open');

    // If openTx is not null and is not this event, then close it.
    if (!!openTx && openTx !== this) {
        openTx.classList.remove('--open');
    }

    if (e.target !== undefined) {

        // Finds whether the user is clicking the transaction's actions.
        const isActions = e.target.closest('.tx-actions');

        // If user is not clicking inside the actions div, then toggle it open or closed.
        if (!isActions) {
            // console.log('this', this);
            this.classList.toggle('--open');
        }
    }
}

/**
 * Creates a new HTML element
 * 
 * @param {Object} {} - Defines the element's attributes.
 * @param {String} {ns} - Defines the namespaceURI. Default: null
 * @param {String} {tag} - Defines the HTML tag. Default: 'div'
 * @param {Array}  {classes} - Defines one or more classNames.
 * @param {Array.<{name: String, value: String}>}  {attrs} - Defines one or more attributes.
 * @param {String} {id} — Defines the element id
 * 
 * @returns {Object} the element you just created
 */
function newElement({ns = null, tag = 'div', classes = [], attrs = [], id = null, innerText = null} = {}) {

    // Creates the element
    const el = !!ns ? document.createElementNS(ns, tag) : document.createElement(tag);

    // Adds identifiers to the element
    !!id ? el.id = id : id;

    // Adds attributes to the element
    // const attr = attr;
    attrs.forEach((attr, index) => {
        !!attr ? el.setAttribute(attr.name, attr.value) : null;
    });

    // Adds classes to the element
    // const classes = classes;
    classes.forEach((item, index) => {
        el.classList.add(item);
    });

    // Adds innerText
    !!innerText ? el.innerText = innerText : innerText;

    // Returns the element
    return el;
}

/**
 * Loads data from localStorage, creates elements and append them to the DOM.
 */
function loadDataInDOM() {
    bills = getFromLocalStorage('bills', bills);
    
    bills.forEach((bill, index) => {
        createTxElement(bill);
    });

    elementsDOM.forEach((element, index) => {
        txList.append(element);
    });

     // Stores this month's bills in a const.
    const thisMonthsBills = getThisMonthsBills(thisMonth, bills);
    overview = calculateThisMonthsBills(thisMonthsBills);
}

/**
 * Creates a Tx Element to append to the txList
 * 
 * @param {Object} data — Gets bill data to create a transaction element
 * @returns
 */
function createTxElement(data) {
    // Get the TX Status
    const getStatus = setTxStatus(data.paid, data.duedate);
    
    // TX Element
    const tx = newElement({tag: 'article', classes: ['tx', getStatus.className], attrs: [{name:'data-key', value: data.key}], id: 'tx-' + data.key});

    // TX Wrapper
    const wrapper = newElement({tag: 'section', classes: ['tx-wrapper']});

    // TX Category
    const category = newElement({classes: ['tx-category', data.category ? '--' + data.category.slug : '']});

    // TX Block
    const block = newElement({tag: 'section', classes: ['tx-block']});

    // TX Description Details
    const descDetails = newElement({tag: 'section', classes: ['tx-details', '--desc']});

    // TX Title
    const title = newElement({tag: 'h3', classes: ['tx-title'], innerText: data.desc});

    // TX Date
    const date = newElement({tag: 'time', classes: ['tx-date'], attrs: [{name: 'datetime', value: data.duedate}], innerText: moment(data.duedate).format("MMM DD, YYYY")});

    // TX Amount Details
    const amountDetails = newElement({tag: 'section', classes: ['tx-details', '--amount']});

    // TX Amount
    const amount = newElement({tag: 'span', classes: ['tx-amount'], innerText: data.amount});

    // TX Status
    const status = newElement({tag: 'span', classes: ['tx-status', getStatus.className], innerText: getStatus.text});

    // TX Status
    const actions = newElement({tag: 'section', classes: ['tx-actions']})
    

    const switchButton = newTxSwitchButton(data, data.paid);

    const editButton = newTxButton(data.key, 'Edit', 'edit');

    const deleteButton = newTxButton(data.key, 'Delete', 'delete');
    
    // Append elements
    tx.append(wrapper);
    tx.append(actions);
    wrapper.append(category);
    wrapper.append(block);
    block.append(descDetails);
    block.append(amountDetails);
    descDetails.append(title);
    descDetails.append(date);
    amountDetails.append(amount);
    amountDetails.append(status);
    actions.append(switchButton);
    actions.append(editButton);
    actions.append(deleteButton);

    // Add Events to the Tx Actions
    tx.addEventListener('click', toggleTxOpen);
    switchButton.addEventListener('click', togglePaid);
    deleteButton.addEventListener('click', (e) => {
        removeBill(data.key);
    });

    // Pushes new Element to the elementsDOM Array
    elementsDOM.push(tx);

    // Returns tx
    return tx;
}

/**
 * Sets the tx status className and innerText
 * 
 * @param {Boolean} isPaid - Checks whether status should be paid or not
 * @param {String} date - Passes the transaction date to calculate whether it's due or late
 * @returns {Object} — Returns the status Object.
 */
function setTxStatus(isPaid, date) {

    // Set the status Object
    const status = {
        className: '',
        text: ''
    };

    // Set status data by calculating whether date is due, late, or paid.
    if (!isPaid) {
        if (moment(new Date()).format("YYMMDD") < moment(date).format("YYMMDD")) {
            status.className = '--due',
            status.text = 'Due'
        } else {
            status.className = '--late',
            status.text = 'Late'
        }
    } else {
        status.className = '--paid',
        status.text = 'Paid'
    }

    // Returns the status Object
    return status;
}

function newTxSwitchButton(data, isPaid) {
    
    // Create Paid Switch
    const switchWrapper = newElement({classes: ['tx-action', 'switch-wrapper']});

    // Switch Button
    const switchButton = newElement({tag: 'button', classes: ['switch'], attrs: [{name: 'type', value: 'button'}, {name: 'role', value: 'switch'}, {name: 'aria-checked', value: isPaid ? 'true' : 'false'}, {name: 'data-state', value: isPaid ? "checked" : "unchecked"}, {name: 'value', value: isPaid ? 'Paid' : 'Due'}]});

    // Switch Toggle
    const switchToggle = newElement({tag: 'span', classes: ['switch-toggle']});

    // Switch Label
    const switchLabel = newElement({tag: 'label', classes: ['label'], attrs: [{name: 'for', value: 'tx-' + data.key}], innerText: isPaid ? "Paid" : "Not Paid"});

    // Switch Checkbox
    const switchCheckbox = newElement({tag: 'input', classes: ['switch-checkbox'], attrs: [{name: 'type', value:'checkbox'}, {name: 'aria-hidden', value: 'true'}, {name: 'value', value: isPaid ? 'paid' : 'due'}, {name: 'name', value: 'tx-' + data.key}, isPaid ? {name: 'checked', value: ''} : null]})


    // Append Buttons
    switchWrapper.append(switchButton);
    switchWrapper.append(switchLabel);
    switchWrapper.append(switchCheckbox);
    switchButton.append(switchToggle);
    
    return switchWrapper;
}

/**
 * Creates a new Button for the TX Element
 * 
 * @param {Number} key — The transaction key
 * @param {String} text — The Button's innerText
 * @param {String} className — The Button's className.
 * @returns {Object} — Returns the Button as an object
 */
function newTxButton(key, text, className) {

    const button = newElement({tag: 'button', classes: ['tx-action', '--' + className], id: className + key});

    const buttonText = newElement({tag: 'span', innerText: text})

    const buttonIcon = ``;
    
    if (className === '--edit') {
        buttonIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="inherit" xmlns="http://www.w3.org/2000/svg">
        <path d="M7 17.013L11.413 16.998L21.045 7.45802C21.423 7.08002 21.631 6.57802 21.631 6.04402C21.631 5.51002 21.423 5.00802 21.045 4.63002L19.459 3.04402C18.703 2.28802 17.384 2.29202 16.634 3.04102L7 12.583V17.013V17.013ZM18.045 4.45802L19.634 6.04102L18.037 7.62302L16.451 6.03802L18.045 4.45802ZM9 13.417L15.03 7.44402L16.616 9.03002L10.587 15.001L9 15.006V13.417Z" fill="inherit"/>
        <path d="M5 21H19C20.103 21 21 20.103 21 19V10.332L19 12.332V19H8.158C8.132 19 8.105 19.01 8.079 19.01C8.046 19.01 8.013 19.001 7.979 19H5V5H11.847L13.847 3H5C3.897 3 3 3.897 3 5V19C3 20.103 3.897 21 5 21Z" fill="inherit"/>
      </svg>`;
    }

    if (className === '--delete') {
        buttonIcon = `<svg width="24" height="24" viewBox="0 0 24 24" fill="inherit" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 7H5V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V7H6ZM10 19H8V10H10V19ZM16 19H14V10H16V19ZM16.618 4L15 2H9L7.382 4H3V6H21V4H16.618Z" fill="inherit"/>
        </svg>`;
    }

    // Append to Elements
    button.append(buttonIcon);
    button.append(buttonText);

    return button;
}


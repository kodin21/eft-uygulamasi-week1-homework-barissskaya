import { User, UserBankAccountsInstance as UserBankAccounts } from './User';
import { IBAN_NUMBER_SIZE, MAX_FREE_TRANSFER_MONEY_LIMIT, MAX_TRANSFER_TIME_PERIOD, FAIL_PASSWORD_LIMIT } from './constants';

const bankAccountDropdown = document.querySelector('#bankAccount');
const transferAccountIbanNumberTextbox = document.querySelector('#transferAccountIbanNumber');
const transferMoneyTextbox = document.querySelector('#transferMoney');
const sendPriceButton = document.querySelector('#sendPriceButton');
const processTimeCounter = document.querySelector('#processTimeCounter');
const alertBox = document.querySelector('#alertBox');
var failPasswordCount = 0;
var timeCounter = MAX_TRANSFER_TIME_PERIOD;

bankAccountDropdown.addEventListener('change', handleSelectedBankAccount);
transferAccountIbanNumberTextbox.addEventListener('keyup', handleIbanNumber);
transferMoneyTextbox.addEventListener('keyup', handleTransferMoney);
sendPriceButton.addEventListener('click', handlePriceButton);

var timeCounterInterval = setInterval(function() {
    let nowTime = --timeCounter;
    if (nowTime > 0) {
        processTimeCounter.innerText = nowTime;
    } else {

        alert('Oturumunuz sonlanmıştır');
        location.reload();
    }
}, 1000);


function handleSelectedBankAccount() {
    let selectedBankAccountId = bankAccountDropdown.value;
    if (UserBankAccounts.isDefinedBankAccountById(selectedBankAccountId)) {
        let selectedBankAccount = UserBankAccounts.getAccountById(selectedBankAccountId);
        transferMoneyTextbox.setAttribute('max', selectedBankAccount.balance);
        checkMoneyTransferValidation();
    }
}

function handleIbanNumber() {
    checkMoneyTransferValidation();
}

const checkMoneyLimit = () => {
    let money = transferMoneyTextbox.value;
    let selectedBankAccountId = bankAccountDropdown.value;
    if (UserBankAccounts.isDefinedBankAccountById(selectedBankAccountId)) {
        if (UserBankAccounts.isValidBalanceLimit(selectedBankAccountId, money)) {
            toggleTransferButton(true);
            toggleAlertBox();
        } else {
            toggleTransferButton("false");
            toggleAlertBox('Bakiyenizin üzerinde tutar giremezsiniz.', 'alert-danger');
        }
    }
}

function handleTransferMoney() {
    checkMoneyTransferValidation();
}

function handlePriceButton() {
    let money = transferMoneyTextbox.value;

    if (money <= MAX_FREE_TRANSFER_MONEY_LIMIT) {

        toggleAlertBox('Başarılı', 'alert-success');

    } else {

        let password = prompt('Telefona gelen 4 haneli şifreyi giriniz', "Şifre");

        if (Number(password) === 1234) {

            toggleAlertBox('Başarılı', 'alert-success');

        } else {

            ++failPasswordCount;
            if (isAccountBlocked()) {
                toggleAlertBox('Hesabınız bloke oldu', 'alert-danger');
                blockedAccount();
            } else {
                toggleAlertBox('Şifre yanlış', 'alert-danger');
            }

        }
    }
}


const checkMoneyTransferValidation = () => {
    if (isSelectedBankAccount() && isFilledIbanNumber() && isFilledPrice()) {
        checkMoneyLimit();
    } else {
        toggleTransferButton(false);
    }
}

const isSelectedBankAccount = () => {
    return UserBankAccounts.isDefinedBankAccountById(bankAccountDropdown.value);
}

const isFilledIbanNumber = () => {
    return transferAccountIbanNumberTextbox.value.length == IBAN_NUMBER_SIZE;
}

const isFilledPrice = () => {
    return Number(transferMoneyTextbox.value) > 0
}


const isAccountBlocked = () => {
    return failPasswordCount > FAIL_PASSWORD_LIMIT;
}

const toggleTransferButton = (open = false) => {
    if (typeof open === 'boolean') {
        if (open) {
            sendPriceButton.classList.remove('disabled');
        } else {
            sendPriceButton.classList.add('disabled');
        }
    } else {
        console.error('Tip hatası. Boolean beklenen yere ' + typeof open + ' geldi.');
    }
}

const toggleAlertBox = (message = '', alertClass = '') => {
    alertBox.classList.forEach((classItem) => {
        if (classItem !== 'alert') {
            alertBox.classList.remove(classItem);
        }
    })
    if (message) {

        alertBox.classList.remove('d-none');
        alertBox.classList.add(alertClass);
        alertBox.innerText = message;

    } else {
        alertBox.classList.add('d-none');
        alertBox.innerText = message;
    }
}

const blockedAccount = () => {
    clearInterval(timeCounterInterval);
}
const resetTransferForm = () => {
    failPasswordCount = 0;
    toggleTransferButton(false);
    processTimeCounter.innerText = timeCounter;

    transferAccountIbanNumberTextbox.value = 'TR';
    transferAccountIbanNumberTextbox.setAttribute('maxlength', IBAN_NUMBER_SIZE);

    toggleAlertBox()

    UserBankAccounts.getAccounts().forEach((account, index) => {
        var opt = document.createElement('option');
        opt.innerText = `${account.name} - ${account.balance} (${account.type})`;
        opt.value = account.id;
        bankAccountDropdown.appendChild(opt);
    });
}
resetTransferForm();
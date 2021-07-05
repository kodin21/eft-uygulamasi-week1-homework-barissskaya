export const User = {
    id: 1,
    name: 'Barış',
    surname: 'KAYA',
}

class UserBankAccounts {
    constructor() {
        this.accounts = [{
                id: 1,
                name: 'AAAA Hesabı',
                type: 'try',
                balance: 4500
            },
            {
                id: 2,
                name: 'BBBB Hesabı',
                type: 'usd',
                balance: 1500
            },
            {
                id: 3,
                name: 'CCCC Hesabı',
                type: 'eur',
                balance: 500
            }
        ];
    }

    getAccounts() {
        return this.accounts;
    }

    getAccountById(accountId) {
        let selectedAccount = this.accounts.find((account) => {
            return account.id === Number(accountId)
        });
        return selectedAccount;
    }

    isDefinedBankAccountById(accountId) {
        return this.accounts.some(account => account.id === Number(accountId));
    }

    isValidBalanceLimit(accountId, money) {
        let selectedAccount = this.getAccountById(accountId);
        return money <= selectedAccount.balance;
    }
}

export const UserBankAccountsInstance = new UserBankAccounts();
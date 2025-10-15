function saveTransaction() {

    document.querySelector("#transaction-form").addEventListener("submit", (e) => { // form submit
        e.preventDefault();
        const type = document.getElementById('type-expense').classList.contains('bg-[color:var(--teal-start)]') ? 'expense' : 'income';
        console.log('Transaction type:', type);
        const amountInput = document.getElementById(`amount`);
        const descriptionInput = document.getElementById(`description`);
        const dateInput = document.getElementById(`date`);

        const amount = parseFloat(amountInput.value);
        const description = descriptionInput.value.trim();
        const date = dateInput.value;

        console.log('Amount:', amount);
        console.log('Description:', description);
        console.log('Date:', date);
        if (!amount || !description || !date) {
            alert('Please fill in all fields.');
            return;
        }

        const transaction = {
            id: Date.now(),
            type,
            amount,
            description,
            date
        };

        const transactions = JSON.parse(localStorage.getItem('transactions')) || [];

        transactions.push(transaction);

        localStorage.setItem('transactions', JSON.stringify(transactions));

        amountInput.value = '';
        descriptionInput.value = '';
        dateInput.value = '';
    });
}

function listTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    console.log('Transactions:', transactions);
    return transactions;
}

document.getElementById('save-btn')?.addEventListener('click', () => saveTransaction());
listTransactions();

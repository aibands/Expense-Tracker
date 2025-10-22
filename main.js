function updateMainPage() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    let balance = 0;
    let income = 0;
    let expense = 0;
    transactions.forEach(tx => {
        if (tx.type === 'income') {
            balance += tx.amount;
            income += tx.amount;
        } else if (tx.type === 'expense') {
            balance -= tx.amount;
            expense += tx.amount;
        }
    });

    $('#m-balance').text(balance.toFixed(2));
    $('#m-income').text(income.toFixed(2));
    $('#m-expense').text(expense.toFixed(2));
    console.log(transactions);
}

function saveTransaction() {

    const type = $('#type-expense').hasClass('bg-[color:var(--teal-start)]') ? 'expense' : 'income';
    // bg-[color:var(--teal-start)] == active
    const amount = parseFloat($('#amount').val());
    const description = $('#description').val().trim();
    const category = $('#category').val();
    const date = $('#date').val();

    if(!amount){
        return 0;
    }

    const transaction = {
        id: Date.now(),
        type,
        amount,
        description,
        category,
        date
    };


    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    $('#amount').val('');
    $('#description').val('');
    $('#date').val('');

    updateMainPage();
    listTransactions();
    window.location.href = "transaction.html";

}

function listTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    return transactions;
}

$(document).ready(function () {
    updateMainPage();
    listTransactions();
});


$("#transaction-form").on("submit", function (e) {
    e.preventDefault();
    saveTransaction();
});
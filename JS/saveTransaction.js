function loadCategories() {
    const categories = JSON.parse(localStorage.getItem("categories") || "[]");
    const $categorySelect = $("#category");

    $categorySelect.empty();
    console.log(categories);
    if (categories.length === 0) {
        $categorySelect.append('<option value="">No categories added</option>');
    } else {
        categories.forEach(category => {
            $categorySelect.append(`
                <option value="${category.name}" data-color="${category.color}" data-emoji="${category.emoji}">${category.emoji} ${category.name}</option>
            `);
        });
    }
}

//edit
let editingId = null;

// get id from URL: ?transactionId=123
function getEditIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('transactionId');
}

function fillFormForEdit(id) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const tx = transactions.find(t => t.id == id);
    if (!tx) return;

    $('#amount').val(tx.amount);
    $('#description').val(tx.description);
    $('#category').val(tx.category);
    $('#date').val(tx.date);

    if (tx.type === 'expense') {
        $('#type-expense').addClass('bg-[color:var(--teal-start)]');
        $('#type-income').removeClass('bg-[color:var(--teal-start)]');
    } else {
        $('#type-income').addClass('bg-[color:var(--teal-start)]');
        $('#type-expense').removeClass('bg-[color:var(--teal-start)]');
    }
}

function saveTransaction() {
    const type = $('#type-expense').hasClass('bg-[color:var(--teal-start)]') ? 'expense' : 'income';
    const amount = parseFloat($('#amount').val());
    const description = $('#description').val().trim();
    const category = $('#category').val();
    const date = $('#date').val();

    if (!amount) return 0;

    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

    if (editingId) { // if ID is not initial, edit
        transactions = transactions.map(tx => {
            if (tx.id == editingId) {
                return { ...tx, type, amount, description, category, date };
            }
            return tx;
        });
    } else { // if ID doesnt exists, create new one
        const transaction = {
            id: Date.now(),
            type,
            amount,
            description,
            category,
            date
        };
        transactions.push(transaction);
    }
    localStorage.setItem('transactions', JSON.stringify(transactions));

    $('#amount').val('');
    $('#description').val('');
    $('#date').val('');

    //listTransactions();
    window.location.href = "transaction.html";
}

/*function listTransactions() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    return transactions;
}

function testEditTransaction() {
    window.location.href = "saveTransaction.html?edit=1760822211963";
}
*/


$("#transaction-form").on("submit", function (e) {
    e.preventDefault();
    saveTransaction();
});

$(document).ready(function () {
    loadCategories();
    editingId = getEditIdFromUrl();
    if (editingId) {
        fillFormForEdit(editingId);
        $('#save-btn').text('Save Changes');
    } else {
        $('#save-btn').text('Add Transaction');
    }
    //listTransactions();
});
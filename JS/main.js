let categories = null;
//main page
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
}

let barChartInstance = null;

function getFilteredTransactions(period) {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const now = new Date();

    if (period === 'week') {
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - 1);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        return transactions.filter(tx => {
            const txDate = new Date(tx.date);
            return txDate >= startOfWeek && txDate <= endOfWeek;
        });
    }

    if (period === 'month') {
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();
        return transactions.filter(tx => {
            const txDate = new Date(tx.date);
            return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
        });
    }

    if (period === 'year') {
        const currentYear = now.getFullYear();
        return transactions.filter(tx => {
            const txDate = new Date(tx.date);
            return txDate.getFullYear() === currentYear;
        });
    }

 
    return transactions;
}

function renderDynamicBarChart(period = 'week') {
    const categories = JSON.parse(localStorage.getItem('categories')) || [];
    const categoryNames = categories.map(c => c.name);
    const filteredTx = getFilteredTransactions(period);

    const expensesCategory = categoryNames.map(cat => {
        const sum = filteredTx //expense sum in determined period
            .filter(tx => tx.type === 'expense' && tx.category === cat)
            .reduce((sum, tx) => sum + tx.amount, 0);
        return { name: cat, sum };
    }).filter(p => p.sum > 0); // remove if expense sum eq 0

    const labels = expensesCategory.map(p => p.name); // get labels
    const expenseByCategory = expensesCategory.map(p => p.sum);

    // Destroy last chart
    if (barChartInstance) {
        barChartInstance.destroy();
    }

    const barCtx = document.getElementById('barChart').getContext('2d');
    const maxValue = Math.max(...expenseByCategory, 0); 


    barChartInstance = new Chart(barCtx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: `Expenses by Category (${period.charAt(0).toUpperCase() + period.slice(1)})`,
                data: expenseByCategory,
                backgroundColor: [
                    'rgba(82, 142, 47, 0.7)',
                    'rgba(31, 107, 116, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    suggestedMax: maxValue
                }
            }
        }
    });
}

// Pie chart 
function renderPieChart() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const monthlyTx = transactions.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear;
    });

    const totalIncome = monthlyTx.filter(tx => tx.type === 'income').reduce((sum, tx) => sum + tx.amount, 0);
    const totalExpense = monthlyTx.filter(tx => tx.type === 'expense').reduce((sum, tx) => sum + tx.amount, 0);

    const pieCtx = document.getElementById('pieChart').getContext('2d');
    new Chart(pieCtx, {
        type: 'pie',
        data: {
            labels: ['Income', 'Expense'],
            datasets: [{
                data: [totalIncome, totalExpense],
                backgroundColor: [
                    'rgba(82, 142, 47, 0.7)',
                    'rgba(31, 107, 116, 0.7)'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
}

function setInitialCategories(){ // Categories
    
    categories = JSON.parse(localStorage.getItem("categories") || "[]");
    let initialCat = [
        {emoji: "🏠", name: "Rent", budget: "", spent: 0},
        {emoji: "🍔", name: "Food", budget: "", spent: 0},
        {emoji: "🚋", name: "Transportation", budget: "", spent: 0},
    ]

    if (categories.length === 0){
        for(let cat of initialCat){
            categories.push(cat);
        }
        localStorage.setItem("categories", JSON.stringify(categories));
    }

}

$(document).ready(function () {
    setInitialCategories();
    console.log(categories);
    updateMainPage();
    renderDynamicBarChart('week');
    renderPieChart();

    function setActive(el) {
        $('#btn-week, #btn-month, #btn-year').removeClass('bg-[color:var(--teal-start)] text-white').addClass('text-gray-300');
        $(el).addClass('bg-[color:var(--teal-start)] text-white').removeClass('text-gray-300');
    }

    $('#btn-week').on('click', function () {
        setActive(this);
        renderDynamicBarChart('week');
    });
    $('#btn-month').on('click', function () {
        setActive(this);
        renderDynamicBarChart('month');
    });
    $('#btn-year').on('click', function () {
        setActive(this);
        renderDynamicBarChart('year');
    });
});
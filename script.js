const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
const transactionList = document.getElementById('transaction-list');
const totalBalance = document.getElementById('total-balance');
const addTransactionButton = document.getElementById('add-transaction');
let myChart; // Variável para armazenar a instância do gráfico

function updateUI() {
    transactionList.innerHTML = '';
    let total = 0;

    transactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `${transaction.description} - R$ ${transaction.amount.toFixed(2)} <button class="btn btn-danger btn-sm" onclick="deleteTransaction(${index})">Excluir</button>`;
        transactionList.appendChild(li);
        total += transaction.type === 'income' ? transaction.amount : -transaction.amount;
    });

    totalBalance.innerText = `R$ ${total.toFixed(2)}`;
    localStorage.setItem('transactions', JSON.stringify(transactions));
    updateChart();
}

function addTransaction() {
    const description = document.getElementById('description').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const type = document.getElementById('type').value;

    if (description && !isNaN(amount)) {
        transactions.push({ description, amount, type });
        updateUI();
        document.getElementById('description').value = '';
        document.getElementById('amount').value = '';
    }
}

function deleteTransaction(index) {
    transactions.splice(index, 1);
    updateUI();
}

addTransactionButton.addEventListener('click', addTransaction);
updateUI();

// Função para atualizar o gráfico
function updateChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = transactions.map(t => t.description);
    const data = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);

    // Se o gráfico já existir, destrua-o antes de criar um novo
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Transações',
                data: data,
                backgroundColor: data.map(amount => amount >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)'),
                borderColor: data.map(amount => amount >= 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'),
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}
const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
const transactionList = document.getElementById('transaction-list');
const totalBalance = document.getElementById('total-balance');
const addTransactionButton = document.getElementById('add-transaction');
const addToReportButton = document.getElementById('add-to-report');
let myChart; // Variável para armazenar a instância do gráfico

function updateUI() {
    transactionList.innerHTML = '';
    let total = 0;

    transactions.forEach((transaction, index) => {
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        li.innerHTML = `${transaction.description} - R$ ${transaction.amount.toFixed(2)} 
                        <button class="btn btn-danger btn-sm" onclick="deleteTransaction(${index})">Excluir</button>`;
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
        const newTransaction = {
            description,
            amount,
            type,
            date: new Date().toLocaleDateString('pt-BR')
        };

        transactions.push(newTransaction);
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

// Enviar dados para o relatório ao clicar no botão
addToReportButton.addEventListener('click', function () {
    localStorage.setItem('reportTransactions', JSON.stringify(transactions));
    window.location.href = 'relatorio.html';
});

// Atualizar gráfico
function updateChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    const labels = transactions.map(t => t.description);
    const data = transactions.map(t => t.type === 'income' ? t.amount : -t.amount);

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

updateUI();

// Alternar o painel lateral
document.getElementById("toggleBtn").addEventListener("click", function () {
    const sidebar = document.getElementById("sidebar");
    sidebar.style.left = sidebar.style.left === "0px" ? "-250px" : "0px"; // Alternar a visibilidade

    // Ajustar o conteúdo com base no painel
    const contentContainer = document.getElementById("content-container");
    if (sidebar.style.left === "0px") {
        contentContainer.style.marginLeft = "250px"; // Se o painel estiver visível, aumenta a margem
    } else {
        contentContainer.style.marginLeft = "0"; // Caso contrário, a margem volta ao normal
    }
});

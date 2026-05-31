const API = "/dados";
const SIMPLEX = "/simplex";

// DOM elements
const listaProdutos = document.getElementById("listaProdutos");
const resultadoDiv = document.getElementById("resultado");
const tabelaSimplexDiv = document.getElementById("tabelaSimplex");

// =========================
// API helpers
// =========================
const buscarDados = async () => await (await fetch(API)).json();
const salvarDados = async (dados) => {
    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });
};

// =========================
// Produtos
// =========================
async function carregarProdutos() {
    const { produtos } = await buscarDados();
    renderizarProdutos(produtos);
}

function renderizarProdutos(produtos) {
    listaProdutos.innerHTML = produtos.map(produto => `
        <div class="produto ${produto.selecionado ? "selecionado" : ""}">
            <div class="produto-info">
                <strong>${produto.nome}</strong>
                <span>Lucro: R$ ${produto.lucro.toFixed(2)}</span>
                <span>Demanda semanal: ${produto.demanda}</span>
            </div>
            
            <div class="produto-acoes">
                <div class="delete" onclick="excluirProduto(${produto.id})">🗑️</div>
                <div class="check ${produto.selecionado ? "ativo" : ""}"
                     onclick="alterarSelecao(${produto.id})">✓</div>
            </div>
        </div>
    `).join("");
}

// =========================
// Seleção
// =========================
async function alterarSelecao(id) {
    const dados = await buscarDados();
    dados.produtos.find(p => p.id === id).selecionado ^= true; // toggle
    await salvarDados(dados);
    carregarProdutos();
}

async function excluirProduto(id) {
    const confirmar = window.confirm("Tem certeza que deseja excluir este produto?");
    if (!confirmar) {
        return;
    }

    const dados = await buscarDados();
    dados.produtos = dados.produtos.filter(p => p.id !== id);
    await salvarDados(dados);
    carregarProdutos();
}

const selecionarTodos = () => alterarTodos(true);
const desmarcarTodos = () => alterarTodos(false);

async function alterarTodos(valor) {
    const dados = await buscarDados();
    dados.produtos.forEach(p => p.selecionado = valor);
    await salvarDados(dados);
    carregarProdutos();
}

// =========================
// Simplex
// =========================
async function calcular() {
    const dados = await (await fetch(SIMPLEX)).json();
    renderizarResultado(dados);
}

function renderizarResultado({ lucroBruto, custosFixos, lucroLiquido, produtos }) {
    resultadoDiv.innerHTML = `
        <p><strong>Lucro Bruto Mensal:</strong> R$ ${lucroBruto.toFixed(2)}</p>
        <p><strong>Custos Mensais:</strong> R$ ${custosFixos.toFixed(2)}</p>
        <p><strong>Lucro Líquido Mensal:</strong> R$ ${lucroLiquido.toFixed(2)}</p>
    `;

    tabelaSimplexDiv.innerHTML = `
        <h3>Produtos Selecionados</h3>
        <table>
            <tr><th>Produto</th><th>Demanda Mensal</th><th>Lucro Unitário</th><th>Lucro Mensal</th></tr>
            ${produtos.map(p => `
                <tr>
                    <td>${p.nome}</td>
                    <td>${p.demanda * 4}</td>
                    <td>R$ ${p.lucro.toFixed(2)}</td>
                    <td>R$ ${(p.lucro * (p.demanda * 4)).toFixed(2)}</td>
                </tr>
            `).join("")}
        </table>
    `;
}

// =========================
// Inicialização
// =========================
carregarProdutos();
const API = "/dados";

const params = new URLSearchParams(window.location.search);
const produtoId = Number(params.get("id"));

const nomeInput = document.getElementById("nome");
const custoInput = document.getElementById("custo");
const vendaInput = document.getElementById("venda");
const tempoInput = document.getElementById("tempo");
const demandaInput = document.getElementById("demanda");
const form = document.getElementById("formProduto");
const btnCancelar = document.getElementById("btnCancelar");

const buscarDados = async () => await (await fetch(API)).json();

const normalizarNome = rawNome => rawNome
    .toLowerCase()
    .split(" ")
    .filter(Boolean)
    .map(word => word[0].toUpperCase() + word.slice(1))
    .join(" ");

const parseDecimal = value => Number(value.replace(",", "."));

async function carregarProduto() {
    const dados = await buscarDados();
    const produto = dados.produtos.find(p => p.id === produtoId);

    if (!produto) {
        alert("Produto não encontrado.");
        window.location.href = "index.html";
        return;
    }

    nomeInput.value = produto.nome;
    custoInput.value = produto.custo;
    vendaInput.value = produto.venda;
    tempoInput.value = produto.tempo;
    demandaInput.value = produto.demanda;
}

form.addEventListener("submit", async e => {
    e.preventDefault();

    const dados = await buscarDados();
    const produto = dados.produtos.find(p => p.id === produtoId);

    if (!produto) {
        alert("Produto não encontrado.");
        return;
    }

    const rawNome = nomeInput.value;
    const nome = normalizarNome(rawNome);
    const custo = parseDecimal(custoInput.value);
    const venda = parseDecimal(vendaInput.value);
    const tempo = parseDecimal(tempoInput.value);
    const demanda = parseDecimal(demandaInput.value);

    produto.nome = nome;
    produto.custo = custo;
    produto.venda = venda;
    produto.tempo = tempo;
    produto.demanda = demanda;
    produto.lucro = venda - custo;

    await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    window.location.href = "index.html";
});

btnCancelar.addEventListener("click", () => {
    window.location.href = "index.html";
});

carregarProduto();
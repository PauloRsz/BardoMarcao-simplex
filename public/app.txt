const API = "/dados";

// =========================
// CARREGAR PRODUTOS
// =========================

async function carregarProdutos() {

    const resposta = await fetch(API);

    const dados = await resposta.json();

    const lista =
        document.getElementById(
            "listaProdutos"
        );

    lista.innerHTML = "";

    dados.produtos.forEach(produto => {

        lista.innerHTML += `

            <div class="produto">

                <div class="produto-info">

                    <strong>
                        ${produto.nome}
                    </strong>

                    <span>
                        Lucro:
                        R$ ${produto.lucro}
                    </span>

                    <span>
                        Demanda semanal:
                        ${produto.demanda}
                    </span>

                </div>

                <div
                    class="check
                    ${produto.selecionado
                        ? "ativo"
                        : ""
                    }"

                    onclick="
                        alterarSelecao(
                            ${produto.id}
                        )
                    "
                >

                    ✓

                </div>

            </div>
        `;
    });
}

// =========================
// CADASTRAR PRODUTO
// =========================

document
.getElementById("formProduto")
.addEventListener("submit", async e => {

    e.preventDefault();

    const resposta = await fetch(API);

    const dados = await resposta.json();

    const nome =
        document.getElementById(
            "nome"
        ).value;

    const custo = Number(
        document.getElementById(
            "custo"
        ).value
    );

    const venda = Number(
        document.getElementById(
            "venda"
        ).value
    );

    const tempo = Number(
        document.getElementById(
            "tempo"
        ).value
    );

    const demanda = Number(
        document.getElementById(
            "demanda"
        ).value
    );

    const lucro = venda - custo;

    dados.produtos.push({

        id: Date.now(),

        nome,
        custo,
        venda,
        lucro,
        tempo,
        demanda,

        selecionado: true
    });

    await fetch(API, {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"
        },

        body: JSON.stringify(dados)
    });

    carregarProdutos();

    document
        .getElementById(
            "formProduto"
        )
        .reset();
});

// =========================
// ALTERAR SELEÇÃO
// =========================

async function alterarSelecao(id) {

    const resposta = await fetch(API);

    const dados = await resposta.json();

    const produto =
        dados.produtos.find(
            p => p.id === id
        );

    produto.selecionado =
        !produto.selecionado;

    await fetch(API, {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"
        },

        body: JSON.stringify(dados)
    });

    carregarProdutos();
}

// =========================
// SELECIONAR TODOS
// =========================

async function selecionarTodos() {

    const resposta = await fetch(API);

    const dados = await resposta.json();

    dados.produtos.forEach(p => {

        p.selecionado = true;
    });

    await fetch(API, {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"
        },

        body: JSON.stringify(dados)
    });

    carregarProdutos();
}

// =========================
// DESMARCAR TODOS
// =========================

async function desmarcarTodos() {

    const resposta = await fetch(API);

    const dados = await resposta.json();

    dados.produtos.forEach(p => {

        p.selecionado = false;
    });

    await fetch(API, {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"
        },

        body: JSON.stringify(dados)
    });

    carregarProdutos();
}

// =========================
// SIMPLEX
// =========================

async function calcular() {

    const resposta =
        await fetch("/simplex");

    const dados =
        await resposta.json();

    document.getElementById(
        "resultado"
    ).innerHTML = `

        <p>
            <strong>
                Lucro Bruto Mensal:
            </strong>

            R$ ${dados.lucroBruto.toFixed(2)}
        </p>

        <p>
            <strong>
                Custos Mensais:
            </strong>

            R$ ${dados.custosFixos.toFixed(2)}
        </p>

        <p>
            <strong>
                Lucro Líquido Mensal:
            </strong>

            R$ ${dados.lucroLiquido.toFixed(2)}
        </p>
    `;

    let html = `

        <h3>
            Produtos Selecionados
        </h3>

        <table>

            <tr>

                <th>Produto</th>
                <th>Demanda Mensal</th>
                <th>Lucro</th>

            </tr>
    `;

    dados.produtos.forEach(p => {

        html += `

            <tr>

                <td>${p.nome}</td>

                <td>
                    ${p.demanda * 4}
                </td>

                <td>
                    R$ ${p.lucro}
                </td>

            </tr>
        `;
    });

    html += `</table>`;

    document.getElementById(
        "tabelaSimplex"
    ).innerHTML = html;
}

carregarProdutos();
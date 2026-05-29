const API = "/dados";

// =========================
// UTIL
// =========================

async function buscarDados() {

    const resposta =
        await fetch(API);

    return await resposta.json();
}

async function salvarDados(dados) {

    await fetch(API, {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"
        },

        body: JSON.stringify(dados)
    });
}

// =========================
// PRODUTOS
// =========================

async function carregarProdutos() {

    const dados =
        await buscarDados();

    renderizarProdutos(
        dados.produtos
    );
}

function renderizarProdutos(produtos) {

    const lista =
        document.getElementById(
            "listaProdutos"
        );

    lista.innerHTML = produtos.map(produto => `

        <div class="
            produto
            ${produto.selecionado
                ? "selecionado"
                : ""
            }
        ">

            <div class="produto-info">

                <strong>
                    ${produto.nome}
                </strong>

                <span>
                    Lucro:
                    R$ ${produto.lucro.toFixed(2)}
                </span>

                <span>
                    Demanda semanal:
                    ${produto.demanda}
                </span>

            </div>

            <div
                class="
                    check
                    ${produto.selecionado
                        ? "ativo"
                        : ""
                    }
                "

                onclick="
                    alterarSelecao(
                        ${produto.id}
                    )
                "
            >

                ✓

            </div>

        </div>

    `).join("");
}

// =========================
// SELEÇÃO
// =========================

async function alterarSelecao(id) {

    const dados =
        await buscarDados();

    const produto =
        dados.produtos.find(
            p => p.id === id
        );

    produto.selecionado =
        !produto.selecionado;

    await salvarDados(dados);

    carregarProdutos();
}

async function selecionarTodos() {

    alterarTodos(true);
}

async function desmarcarTodos() {

    alterarTodos(false);
}

async function alterarTodos(valor) {

    const dados =
        await buscarDados();

    dados.produtos.forEach(p => {

        p.selecionado = valor;
    });

    await salvarDados(dados);

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

    renderizarResultado(dados);
}

function renderizarResultado(dados) {

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

    document.getElementById(
        "tabelaSimplex"
    ).innerHTML = `

        <h3>
            Produtos Selecionados
        </h3>

        <table>

            <tr>

                <th>Produto</th>
                <th>Demanda Mensal</th>
                <th>Lucro Unitário</th>
                <th>Lucro Mensal</th>

            </tr>

            ${dados.produtos.map(p => `

                <tr>

                    <td>${p.nome}</td>

                    <td>
                        ${p.demanda * 4}
                    </td>

                    <td>
                        R$ ${p.lucro.toFixed(2)}
                    </td>

                    <td>

                        R$ ${(
                            p.lucro *
                            (p.demanda * 4)
                        ).toFixed(2)}

                    </td>

                </tr>

            `).join("")}

        </table>
    `;
}

// =========================
// INICIAR
// =========================

carregarProdutos();
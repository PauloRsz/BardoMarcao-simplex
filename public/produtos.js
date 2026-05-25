const API = "/dados";

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

                <h3>${produto.nome}</h3>

                <p>
                    Lucro:
                    R$ ${produto.lucro}
                </p>

                <p>
                    Demanda:
                    ${produto.demanda}
                </p>

                <label>

                    <input
                        type="checkbox"
                        ${produto.selecionado
                            ? "checked"
                            : ""
                        }

                        onchange="
                            alterarSelecao(
                                ${produto.id}
                            )
                        "
                    >

                    Usar no Simplex

                </label>

            </div>
        `;
    });
}

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

carregarProdutos();
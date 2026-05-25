const fs = require("fs");

function resolverSimplex() {

    const banco = JSON.parse(
        fs.readFileSync("./db.json")
    );

    const produtos = banco.produtos.filter(
        p => p.selecionado
    );

    // =========================
    // FUNÇÃO OBJETIVO
    // =========================

    let funcaoObjetivo = "Max Z = ";

    produtos.forEach((p, i) => {

        funcaoObjetivo +=
            `${p.lucro}x${i + 1}`;

        if (i < produtos.length - 1) {

            funcaoObjetivo += " + ";
        }
    });

    // =========================
    // RESTRIÇÕES
    // =========================

    const restricoes = [];

    // TEMPO MENSAL
    // 480 minutos por dia × 30 dias

    let restricaoTempo = "";

    produtos.forEach((p, i) => {

        restricaoTempo +=
            `${p.tempo}x${i + 1}`;

        if (i < produtos.length - 1) {

            restricaoTempo += " + ";
        }
    });

    restricaoTempo += " <= 14400";

    restricoes.push(restricaoTempo);

    // DEMANDA MENSAL

    produtos.forEach((p, i) => {

        const demandaMensal =
            p.demanda * 4;

        restricoes.push(
            `x${i + 1} <= ${demandaMensal}`
        );
    });

    // =========================
    // TABLEAU SIMPLEX
    // =========================

    const tableau = [];

    const linhaTempo = ["Tempo"];

    produtos.forEach(p => {

        linhaTempo.push(p.tempo);
    });

    linhaTempo.push(14400);

    tableau.push(linhaTempo);

    produtos.forEach((p, i) => {

        const linha =
            [`Demanda x${i + 1}`];

        produtos.forEach((_, j) => {

            linha.push(
                i === j ? 1 : 0
            );
        });

        linha.push(
            p.demanda * 4
        );

        tableau.push(linha);
    });

    // =========================
    // CÁLCULO DO LUCRO
    // =========================

    let lucroBruto = 0;

    const solucao = {};

    produtos.forEach(p => {

        // CONVERTE SEMANA -> MÊS

        const demandaMensal =
            p.demanda * 4;

        lucroBruto +=
            demandaMensal * p.lucro;

        solucao[p.nome] =
            demandaMensal;
    });

    // =========================
    // CUSTOS FIXOS MENSAIS
    // =========================

    const custosFixos =

        banco.custosFixos.aluguel +
        banco.custosFixos.energia +
        banco.custosFixos.funcionario;

    // =========================
    // RETORNO
    // =========================

    return {

        produtos,

        funcaoObjetivo,

        restricoes,

        tableau,

        lucroBruto,

        custosFixos,

        lucroLiquido:
            lucroBruto - custosFixos,

        solucao
    };
}

module.exports = resolverSimplex;
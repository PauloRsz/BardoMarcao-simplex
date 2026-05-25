const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const resolverSimplex = require("./simplex");

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const DB = "./db.json";

app.get("/dados", (req, res) => {

    const dados = JSON.parse(
        fs.readFileSync(DB)
    );

    res.json(dados);
});

app.post("/dados", (req, res) => {

    fs.writeFileSync(
        DB,
        JSON.stringify(req.body, null, 2)
    );

    res.json({
        mensagem: "Dados salvos!"
    });
});

app.get("/simplex", (req, res) => {

    const resultado = resolverSimplex();

    res.json(resultado);
});

app.listen(3000, () => {

    console.log(
        "Servidor rodando em http://localhost:3000"
    );
});
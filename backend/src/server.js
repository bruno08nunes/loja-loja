// * Inicialização
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

app.listen(port, () => console.log(`Rodando na porta ${port}`));

// * Importação de Rotas

const usuarios = require("./routes/usuarios");
const produtos = require("./routes/produtos");
const categorias = require("./routes/categorias");
const favoritos = require("./routes/favoritos");
const comentarios = require("./routes/comentarios");
const compras = require("./routes/compras");

// * Rotas

app.use("/", usuarios);
app.use("/", produtos);
app.use("/", categorias);
app.use("/", favoritos);
app.use("/", comentarios);
app.use("/", compras);

// * Imagens

app.use("/uploads/products", express.static(__dirname + "\\public\\products"));
app.use("/uploads/users", express.static(__dirname + "\\public\\users"));
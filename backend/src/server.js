// * Inicialização
const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

app.listen(port, () => console.log(`Rodando na porta ${port}`));

// * swagger

const swaggerUi = require("swagger-ui-express");
const swaggerJSDoc = require("swagger-jsdoc");

const swaggerOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "my API",
            version: "1.0.0",
            description: "A simple Express APi with…",
        },
        servers: [
            {
                url: "https://loja-loja.onrender.com",
            },
        ],
    },
    apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

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

app.use("/uploads/products", express.static(path.join(__dirname, "public", "products")));
app.use("/uploads/users", express.static(path.join(__dirname, "public", "users")));

const express = require("express");
const cors = require("cors")

const port = 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.listen(port, () => console.log(`Rodando na porta ${port}`));

const connection = require("./db_config");

// Rotas para cadastro de usuário

app.post("/usuario/cadastrar", (req, res) => {
    let params = [
        req.body.nome,
        req.body.sobrenome,
        req.body.email,
        req.body.senha,
        req.body.cpf
    ];
    
    if (params.includes(undefined)) {
        res
                .status(400)
                .json({
                    success: false,
                    message: "Informações faltando",
                    data: {}
                });
        return;
    }

    let query = "INSERT INTO users(first_name, family_name, email, password, cpf) VALUES(?,?,?,?,?);";

    connection.query(query, params, (err, results) => {
        if (err) {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao cadastrar usuário",
                    data: err
                });
            return;
        }
        res
            .status(201)
            .json({
                success: true,
                message: "Usuário cadastrado no banco de dados",
                data: results
            });
    });
});

app.post("/usuario/login", (req, res) => {
    let params = [
        req.body.email,
        req.body.senha
    ];

    let query = "SELECT * FROM users WHERE email = ? AND password = ?;";

    connection.query(query, params, (err, results) => {
        if (err) {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao encontrar usuário",
                    data: err
                });
            return;
        }
        res
            .status(200)
            .json({
                success: true,
                message: "Consulta concluída",
                data: results
            });
    });
});

app.get("/usuario/informacoes/:id", (req, res) => {
    let params = [
        req.params.id
    ];

    let query = "SELECT first_name, family_name, cpf, email FROM users WHERE id = ?;";

    connection.query(query, params, (err, results) => {
        if (err) {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao coletar informações",
                    data: err
                });
            return
        }
        res
            .status(200)
            .json({
                success: true,
                message: "Consulta concluída",
                data: results
            });
    });
});

app.put("/usuario/atualizar/:id", (req, res) => {
    let params = [
        req.body.nome,
        req.body.sobrenome,
        req.body.cpf,
        req.body.email,
        req.body.senha,
        req.params.id
    ];

    let query = "UPDATE users SET first_name = ?, family_name = ?, cpf = ?, email = ?, password = ? WHERE id = ?;";

    connection.query(query, params, (err, results) => {
        if (err) {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao atualizar usuário",
                    data: err
                });
            return
        }
        res
            .status(200)
            .json({
                success: true,
                message: "Usuário atualizado",
                data: results
            });
    });
});

app.delete("/usuario/deletar/:id", (req, res) => {
    let params = [
        req.params.id
    ];

    let query = "DELETE FROM users WHERE id = ?;";

    connection.query(query, params, (err, results) => {
        if (err) {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao deletar usuário",
                    data: err
                });
            return
        }
        res
            .status(200)
            .json({
                success: true,
                message: "Usuário deletado",
                data: results
            });
    });
});

// CRUD Produto

app.post("/produto/criar", (req, res) => {
    const params = [
        req.body.nome,
        req.body.descricao,
        req.body.preco,
        req.body.precoPromocional,
        req.body.quantidade,
        req.body.image
    ];

    const query = "INSERT INTO products(name, description, price, promotional_price, stock_quantity, image) VALUES (?,?,?,?,?,?);";

    connection.query(query, params, (err, results) => {
        if (err) {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao criar produto",
                    data: err
                });
            return
        }
        res
            .status(201)
            .json({
                success: true,
                message: "Produto criado",
                data: results
            });
    });
});

app.get("/produtos/listar", (req, res) => {
    const query = "SELECT * FROM products";

    connection.query(query, (err, results) => {
        if (err) {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao listar produtos",
                    data: err
                });
            return
        }
        res
            .status(200)
            .json({
                success: true,
                message: "Consulta concluída",
                data: results
            });
    });
});

app.get("/produto/informacoes/:id", (req, res) => {
    const params = [
        req.params.id
    ];

    const query = "SELECT name, description, price, promotional_price, rating, stock_quantity, image WHERE id = ?;";

    connection.query(query, params, (err, results) => {
        if (err) {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao consultar produto",
                    data: err
                });
            return
        }
        res
            .status(200)
            .json({
                success: true,
                message: "Informações do produto consultadas",
                data: results
            });
    });
});

app.put("/produto/atualizar/:id", (req, res) => {
    const params = [
        req.body.nome,
        req.body.descricao,
        req.body.preco,
        req.body.precoPromocional,
        req.body.quantidade,
        req.body.image,
        req.params.id
    ];

    const query = "UPDATE products SET name = ?, description = ?, price = ?, promotional_price = ?, stock_quantity = ?, image = ? WHERE id = ?;";

    connection.query(query, params, (err, results) => {
        if (err) {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao atualizar produto",
                    data: err
                });
            return
        }
        res
            .status(200)
            .json({
                success: true,
                message: "Produto atualizado",
                data: results
            });
    });
});

app.delete("/produto/deletar/:id", (req, res) => {
    const params = [
        req.params.id
    ];

    const query = "DELETE FROM products WHERE id = ?;";

    connection.query(query, params, (err, results) => {
        if (err) {
            res
                .status(400)
                .json({
                    success: false,
                    message: "Erro ao deletar produto",
                    data: err
                });
            return
        }
        res
            .status(200)
            .json({
                success: true,
                message: "Produto deletado",
                data: results
            });
    });
});
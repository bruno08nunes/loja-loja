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

    let query = "INSERT INTO users(first_name, family_name, email, password, cpf) VALUES(?,?,?,?,?)";

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

    let query = "SELECT * FROM users WHERE email = ? AND password = ?";

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

app.delete("/usuario/deletar/:id", (req, res) => {
    let params = [
        req.params.id
    ];

    let query = "DELETE FROM users WHERE id = ?";

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
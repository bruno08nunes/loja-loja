const express = require("express");
const { uploadUser } = require("../multer");
const connection = require("../db_config");

const router = express.Router();

/**
 * @swagger
 * /usuario/cadastrar:
 *     post:
 *         summary: Cadastra usuário no banco de dados
 *         response:
 *              201:
 *                  description: Informações vinda do banco do usuário cadastrado
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: array
 *                              items:
 *                                  type: object
 *              400:
 *                  description: Informações de erro do banco de dados
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
*/
router.post("/usuario/cadastrar", (req, res) => {
    const params = [
        req.body.nome,
        req.body.sobrenome,
        req.body.email,
        req.body.senha,
        req.body.cpf,
    ];

    if (params.includes(undefined)) {
        res.status(400).json({
            success: false,
            message: "Informações faltando",
            data: {},
        });
        return;
    }

    const query =
        "INSERT INTO users(first_name, family_name, email, password, cpf) VALUES(?,?,?,?,?);";

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao cadastrar usuário",
                data: err,
            });
            return;
        }
        res.status(201).json({
            success: true,
            message: "Usuário cadastrado no banco de dados",
            data: results,
        });
    });
});

router.post("/usuario/login", (req, res) => {
    const params = [req.body.email];

    const query = "SELECT * FROM users WHERE email = ?;";

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao encontrar usuário",
                data: err,
            });
            return;
        }
        if (results.length > 0) {
            if (results[0].password === req.body.senha) {
                res.status(200).json({
                    success: true,
                    message: "Consulta concluída",
                    data: results,
                });
                return;
            }
            res.status(400).json({
                success: false,
                message: "Senha inválida!",
            });
            return;
        }
        res.status(400).json({
            success: false,
            message: "Usuário não cadastrado!",
        });
    });
});

router.get("/usuario/informacoes/:id", (req, res) => {
    const params = [req.params.id];

    const query =
        "SELECT first_name, family_name, cpf, email, role, image FROM users WHERE id = ?;";

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao coletar informações",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Consulta concluída",
            data: results,
        });
    });
});

router.put("/usuario/atualizar/:id", (req, res) => {
    const params = [
        req.body.nome,
        req.body.sobrenome,
        req.body.cpf,
        req.body.email,
        req.body.senha,
        req.params.id,
    ];

    const query =
        "UPDATE users SET first_name = ?, family_name = ?, cpf = ?, email = ?, password = ? WHERE id = ?;";

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao atualizar usuário",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Usuário atualizado",
            data: results,
        });
    });
});

router.put(
    "/usuario/foto/atualizar/:id",
    uploadUser.single("image"),
    (req, res) => {
        const params = [req.file.filename, req.params.id];

        const query =
            "UPDATE users SET image = ? WHERE id = ?;";

        connection.query(query, params, (err, results) => {
            if (err) {
                res.status(400).json({
                    success: false,
                    message: "Erro ao atualizar usuário",
                    data: err,
                });
                return;
            }
            res.status(200).json({
                success: true,
                message: "Usuário atualizado",
                data: results,
            });
        });
    }
);

router.delete("/usuario/deletar/:id", (req, res) => {
    let params = [req.params.id];

    let query = "DELETE FROM users WHERE id = ?;";

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao deletar usuário",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Usuário deletado",
            data: results,
        });
    });
});

module.exports = router;
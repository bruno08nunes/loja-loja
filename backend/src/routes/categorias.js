const express = require("express");
const connection = require("../db_config");

const router = express.Router();

router.post("/categoria/criar", (req, res) => {
    const params = [req.body.nome, req.body.descricao];

    const query = "INSERT INTO categories(name, description) VALUES(?, ?);";

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao criar categoria",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Categoria criada",
            data: results,
        });
    });
});

router.get("/categorias/listar", (req, res) => {
    const query = "SELECT * FROM categories";

    connection.query(query, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao listar categorias",
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

module.exports = router;
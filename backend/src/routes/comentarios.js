const express = require("express");
const connection = require("../db_config");

const router = express.Router();

router.get("/comentarios/listar/:produto_id", (req, res) => {
    const params = [req.params.produto_id];

    const query =
        "SELECT reviews.comment, reviews.created_at, reviews.rating, users.first_name as reviewer FROM reviews INNER JOIN users ON reviews.id_users = users.id INNER JOIN products ON reviews.id_products = products.id WHERE products.id = ?;";

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao consultar comentários",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Reviews do produto consultados",
            data: results,
        });
    });
});

router.post("/comentarios/postar", (req, res) => {
    const params = [
        req.body.id_users,
        req.body.id_products,
        req.body.rating,
        req.body.comment,
    ];

    const query =
        "INSERT INTO reviews(id_users, id_products, rating, comment) VALUES(?,?,?,?);";

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao enviar review",
                data: err,
            });
            return;
        }
        res.status(201).json({
            success: true,
            message: "Review enviada",
            data: results,
        });
    });
});

module.exports = router;
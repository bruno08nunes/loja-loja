const express = require("express");
const connection = require("../db_config");

const router = express.Router();

router.post("/produto/favoritar", (req, res) => {
    const params = [req.body.usuario, req.body.produto];

    const query = "INSERT INTO favorites(id_users, id_products) VALUES (?,?);";

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao favoritar produto",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Produto favoritado",
            data: results,
        });
    });
});

router.get("/usuario/favoritos/:id", (req, res) => {
    const params = [req.params.id, req.params.id];

    const query = `SELECT products.id, name, description, price, promotional_price, stock_quantity, image, AVG(rating) as rating,
                    CASE
                        WHEN MAX(favorites.id_users) = ? THEN true
                        ELSE false
                    END AS is_favorited
                    FROM products
                    LEFT JOIN reviews ON products.id = reviews.id_products
                    LEFT JOIN favorites ON products.id = favorites.id_products
                    WHERE favorites.id_users = ?
                    GROUP BY products.id;`;

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao procurar produto favorito",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Resultado encontrado",
            data: results,
        });
    });
});

router.delete("/favoritos/produto/remover", (req, res) => {
    const params = [req.body.usuario, req.body.produto];

    const query =
        "DELETE FROM favorites WHERE id_users = ? AND id_products = ?;";

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao procurar produto favorito",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Resultado encontrado",
            data: results,
        });
    });
});

module.exports = router;
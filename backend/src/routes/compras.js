const express = require("express");
const connection = require("../db_config");

const router = express.Router();

router.post("/comprar", (req, res) => {
    const params = [
        req.body.usuario,
        req.body["tipo-cartao"],
        req.body.cep,
        req.body["numero-casa"],
    ];

    const query =
        "INSERT INTO orders(id_users, payment_metod, shipping_postcode, house_number) VALUES (?,?,?,?);";

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao efetuar pagamento",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Pagamento concluído",
            data: results,
        });
    });
});

router.post("/comprar/produtos", (req, res) => {
    const params = req.body.produtos.map((produto) => [
        req.body.pedido,
        produto.id,
        1,
        produto.promotional_price ?? produto.price,
    ]);

    const query =
        "INSERT INTO orders_has_products(id_orders, id_products, quantity, price) VALUES ?";

    connection.query(query, [params], (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao efetuar pagamento",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Pagamento concluído",
            data: results,
        });
    });
});

router.get("/usuario/historico/:id", (req, res) => {
    const params = [req.params.id, req.params.id];

    const query =
        `SELECT products.id, name, description, products.price, promotional_price, stock_quantity, image, AVG(rating) as rating,
            CASE
                WHEN MAX(favorites.id_users) = ? THEN true
                ELSE false
            END AS is_favorited
            FROM orders_has_products ohp
            INNER JOIN products ON products.id = ohp.id_products
            INNER JOIN orders ON ohp.id_orders = orders.id
            LEFT JOIN reviews ON products.id = reviews.id_products
            LEFT JOIN favorites ON products.id = favorites.id_products
            WHERE orders.id_users = ?
            GROUP BY products.id;`;

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro pegar histórico usuário",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Histórico consultado",
            data: results,
        });
    });
});

module.exports = router;
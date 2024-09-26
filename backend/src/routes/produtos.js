const express = require("express");
const { uploadProduct } = require("../multer");
const connection = require("../db_config");

const router = express.Router();

router.post("/produto/criar", uploadProduct.single("image"), (req, res) => {
    const params = [
        req.body.nome,
        req.body.descricao,
        req.body.preco,
        req.body.precoPromocional === "" ? null : req.body.precoPromocional,
        req.body.quantidade,
        req.file.filename,
    ];

    const query =
        "INSERT INTO products(name, description, price, promotional_price, stock_quantity, image) VALUES (?,?,?,?,?,?);";

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao criar produto",
                data: err,
            });
            return;
        }
        res.status(201).json({
            success: true,
            message: "Produto criado",
            data: results,
        });
    });
});

router.get("/produtos/listar/", (req, res) => {
    const params = [req.query.usuario];

    let query =
        "SELECT products.id, name, description, price, promotional_price, stock_quantity, image, AVG(rating) as rating FROM products LEFT JOIN reviews ON products.id = reviews.id_products GROUP BY products.id;";

    if (req.query.usuario) {
        query = `SELECT products.id, name, description, price, promotional_price, stock_quantity, image, AVG(rating) as rating,
                    CASE
                        WHEN MAX(favorites.id_users) = ? THEN true
                        ELSE false
                    END AS is_favorited
                    FROM products
                    LEFT JOIN reviews ON products.id = reviews.id_products
                    LEFT JOIN favorites ON products.id = favorites.id_products
                    GROUP BY products.id;`;
    }

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao listar produtos",
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

router.get("/produto/informacoes/:id", (req, res) => {
    const params = [req.params.id];

    const query =
        "SELECT name, description, price, promotional_price, rating, stock_quantity, image WHERE id = ?;";

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao consultar produto",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Informações do produto consultadas",
            data: results,
        });
    });
});

router.put("/produto/atualizar/:id", uploadProduct.single("image"), (req, res) => {
    const params = [
        req.body.nome,
        req.body.descricao,
        req.body.preco,
        req.body.precoPromocional === "" ? null : req.body.precoPromocional,
        req.body.quantidade,
        req.file?.filename ?? req.body.old_image,
        req.params.id,
    ];

    const query =
        "UPDATE products SET name = ?, description = ?, price = ?, promotional_price = ?, stock_quantity = ?, image = ? WHERE id = ?;";

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao atualizar produto",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Produto atualizado",
            data: results,
        });
    });
});

router.delete("/produto/deletar/:id", (req, res) => {
    const params = [req.params.id];

    const query = "DELETE FROM products WHERE id = ?;";

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao deletar produto",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Produto deletado",
            data: results,
        });
    });
});

router.get("/produtos/listar/melhores", (req, res) => {
    const params = [req.query.usuario];

    let query =
        "SELECT TRUNCATE(AVG(rating), 2) AS rating, products.name, products.description, products.price, products.promotional_price, products.image, products.id FROM reviews INNER JOIN products ON reviews.id_products = products.id GROUP BY reviews.id_products ORDER BY rating DESC;";

    if (req.query.usuario) {
        query = `SELECT products.id, name, description, price, promotional_price, stock_quantity, image, AVG(rating) as rating,
                    CASE
                        WHEN MAX(favorites.id_users) = ? THEN true
                        ELSE false
                    END AS is_favorited
                    FROM products
                    LEFT JOIN reviews ON products.id = reviews.id_products
                    LEFT JOIN favorites ON products.id = favorites.id_products
                    GROUP BY products.id
                    ORDER BY rating DESC;`
    }

    connection.query(query, params, (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao selecionar produtos melhores avaliados",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Produtos selecionados",
            data: results,
        });
    });
});

router.post("/produto/categoria/criar", (req, res) => {
    const params = req.body.categorias.map((categoria) => [
        req.body.produto,
        categoria,
    ]);

    const query =
        "INSERT INTO products_has_categories(id_products, id_categories) VALUES ?";

    connection.query(query, [params], (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao criar categorias em produtos",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Categorias anexadas aos produtos",
            data: results,
        });
    });
});

router.get("/produto/categoria/:categoria", (req, res) => {
    const params = [req.params.categoria];

    const query =
        "SELECT products.name FROM products_has_categories INNER JOIN products ON products_has_categories.id_products = products.id INNER JOIN categories ON products_has_categories.id_categories = categories.id WHERE categories.name = ?;";

    connection.query(query, [params], (err, results) => {
        if (err) {
            res.status(400).json({
                success: false,
                message: "Erro ao consultar categorias de produtos",
                data: err,
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: "Categorias do produto consultadas",
            data: results,
        });
    });
});

module.exports = router;
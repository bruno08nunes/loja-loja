// * Inicialização
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const port = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.json());

const { uploadProduct, uploadUser } = require("./multer");

app.listen(port, () => console.log(`Rodando na porta ${port}`));

const connection = require("./db_config");

// * Rotas para cadastro de usuário

app.post("/usuario/cadastrar", (req, res) => {
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

app.post("/usuario/login", (req, res) => {
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

app.get("/usuario/informacoes/:id", (req, res) => {
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

app.put("/usuario/atualizar/:id", (req, res) => {
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

app.put(
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

app.delete("/usuario/deletar/:id", (req, res) => {
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

// CRUD Produto

app.post("/produto/criar", uploadProduct.single("image"), (req, res) => {
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

app.get("/produtos/listar/", (req, res) => {
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

app.get("/produto/informacoes/:id", (req, res) => {
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

app.put("/produto/atualizar/:id", uploadProduct.single("image"), (req, res) => {
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

app.delete("/produto/deletar/:id", (req, res) => {
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

app.get("/produtos/listar/melhores", (req, res) => {
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

// CRUD Categorias

app.post("/categoria/criar", (req, res) => {
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

app.get("/categorias/listar", (req, res) => {
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

// CRUD Produto + Categoria
app.post("/produto/categoria/criar", (req, res) => {
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

app.get("/categoria/produto/selecionar/:categoria", (req, res) => {
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

// CRUD Favoritos
app.post("/produto/favoritar", (req, res) => {
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

app.get("/favoritos/produto", (req, res) => {
    const params = [req.query.usuario, req.query.produto];

    const query =
        "SELECT * FROM favorites WHERE id_users = ? AND id_products = ?;";

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

app.get("/usuario/favoritos/:id", (req, res) => {
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

app.delete("/favoritos/produto/remover", (req, res) => {
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

// Crud Comentários

app.get("/comentarios/listar/:produto_id", (req, res) => {
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

app.post("/comentarios/postar", (req, res) => {
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

// Compras CRUD

app.post("/comprar", (req, res) => {
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

app.post("/comprar/produtos", (req, res) => {
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

app.get("/usuario/historico/:id", (req, res) => {
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


// Imagens

app.use("/uploads/products", express.static(__dirname + "\\public\\products"));


app.use("/uploads/users", express.static(__dirname + "\\public\\users"));
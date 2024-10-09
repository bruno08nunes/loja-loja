const express = require("express");
const { uploadProduct } = require("../multer");
const connection = require("../db_config");

const router = express.Router();

/**
 * @swagger
 * /produto/criar:
 *   post:
 *     summary: Criar um novo produto
 *     description: Adiciona um novo produto ao banco de dados
 *     tags: [Produtos]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do produto
 *                 example: "Pokebola"
 *               descricao:
 *                 type: string
 *                 description: Descrição do produto
 *                 example: "Uma Pokebola perfeita para capturar pokemons"
 *               preco:
 *                 type: number
 *                 description: Preço do produto
 *                 example: 59.99
 *               precoPromocional:
 *                 type: number
 *                 nullable: true
 *                 description: Preço promocional do produto (se houver)
 *                 example: 49.99
 *               quantidade:
 *                 type: integer
 *                 description: Quantidade em estoque
 *                 example: 100
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagem do produto
 *     responses:
 *       201:
 *         description: Produto criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Status de sucesso
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Mensagem informando o status
 *                   example: "Produto criado"
 *                 data:
 *                   type: object
 *                   description: Informações retornadas pela query de inserção
 *                   properties:
 *                     fieldCount:
 *                       type: integer
 *                       description: Contagem de campos afetados
 *                       example: 0
 *                     affectedRows:
 *                       type: integer
 *                       description: Número de linhas afetadas pela query (produtos criados)
 *                       example: 1
 *                     insertId:
 *                       type: integer
 *                       description: ID do produto inserido
 *                       example: 101
 *                     info:
 *                       type: string
 *                       description: Informações sobre a operação realizada
 *                       example: "Rows matched: 0  Changed: 1  Warnings: 0"
 *                     serverStatus:
 *                       type: integer
 *                       description: Status do servidor
 *                       example: 2
 *                     warningStatus:
 *                       type: integer
 *                       description: Status de advertência
 *                       example: 0
 *       400:
 *         description: Erro ao criar produto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Status de sucesso
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro informando o problema
 *                   example: "Erro ao criar produto"
 *                 data:
 *                   type: object
 *                   description: Valor de erro retornado pelo banco de dados
 *                   properties:
 *                     code:
 *                       type: string
 *                       description: Código de erro do banco de dados
 *                       example: "ER_DATA_TOO_LONG"
 *                     errno:
 *                       type: integer
 *                       description: Número do erro
 *                       example: 1406
 *                     sqlState:
 *                       type: string
 *                       description: Estado SQL
 *                       example: "22001"
 *                     sqlMessage:
 *                       type: string
 *                       description: Mensagem de erro SQL
 *                       example: "Data too long for column 'image' at row 1"
 *                     sql:
 *                       type: string
 *                       description: Comando SQL que causou o erro
 *                       example: "INSERT INTO products(...) VALUES (...)"
 */
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

/**
 * @swagger
 * /produtos/listar/:
 *   get:
 *     summary: Listar produtos
 *     description: Retorna uma lista de produtos disponíveis no banco de dados. Se um usuário for especificado, retorna informações adicionais sobre se o produto está favoritado pelo usuário.
 *     tags: [Produtos]
 *     parameters:
 *       - in: query
 *         name: usuario
 *         required: false
 *         description: ID do usuário para verificar se os produtos estão favoritados
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Consulta concluída com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Status de sucesso
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Mensagem informando o status
 *                   example: "Consulta concluída"
 *                 data:
 *                   type: array
 *                   description: Lista de produtos
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         description: ID do produto
 *                         example: 1
 *                       name:
 *                         type: string
 *                         description: Nome do produto
 *                         example: "Pokebola"
 *                       description:
 *                         type: string
 *                         description: Descrição do produto
 *                         example: "Uma Pokebola perfeita para capturar pokemons"
 *                       price:
 *                         type: number
 *                         description: Preço do produto
 *                         example: 59.99
 *                       promotional_price:
 *                         type: number
 *                         nullable: true
 *                         description: Preço promocional do produto (se houver)
 *                         example: 49.99
 *                       stock_quantity:
 *                         type: integer
 *                         description: Quantidade em estoque
 *                         example: 100
 *                       image:
 *                         type: string
 *                         description: URL da imagem do produto
 *                         example: "imagem.jpg"
 *                       rating:
 *                         type: number
 *                         description: Avaliação média do produto
 *                         example: 4.5
 *                       is_favorited:
 *                         type: boolean
 *                         description: Indica se o produto está favoritado pelo usuário
 *                         example: true
 *       400:
 *         description: Erro ao listar produtos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Status de sucesso
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro informando o problema
 *                   example: "Erro ao listar produtos"
 *                 data:
 *                   type: object
 *                   description: Valor de erro retornado pelo banco de dados
 *                   properties:
 *                     code:
 *                       type: string
 *                       description: Código de erro do banco de dados
 *                       example: "ER_BAD_FIELD_ERROR"
 *                     errno:
 *                       type: integer
 *                       description: Número do erro
 *                       example: 1054
 *                     sqlState:
 *                       type: string
 *                       description: Estado SQL
 *                       example: "42S22"
 *                     sqlMessage:
 *                       type: string
 *                       description: Mensagem de erro SQL
 *                       example: "Unknown column 'id' in 'field list'"
 *                     sql:
 *                       type: string
 *                       description: Comando SQL que causou o erro
 *                       example: "SELECT * FROM products;"
 */
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

/**
 * @swagger
 * /produto/informacoes/{id}:
 *   get:
 *     summary: Obter informações do produto
 *     description: Retorna informações detalhadas de um produto com base no ID fornecido.
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico do produto
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Informações do produto consultadas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Status de sucesso
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Mensagem informando o status
 *                   example: "Informações do produto consultadas"
 *                 data:
 *                   type: array
 *                   description: Informações do produto
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                         description: Nome do produto
 *                         example: "Pokebola"
 *                       description:
 *                         type: string
 *                         description: Descrição do produto
 *                         example: "Pokebola ideal para capturar um pokemon"
 *                       price:
 *                         type: number
 *                         description: Preço do produto
 *                         example: 59.99
 *                       promotional_price:
 *                         type: number
 *                         nullable: true
 *                         description: Preço promocional do produto (se houver)
 *                         example: 49.99
 *                       rating:
 *                         type: number
 *                         description: Avaliação média do produto
 *                         example: 4.5
 *                       stock_quantity:
 *                         type: integer
 *                         description: Quantidade em estoque
 *                         example: 100
 *                       image:
 *                         type: string
 *                         description: URL da imagem do produto
 *                         example: "https://exemplo.com/imagem.jpg"
 *       400:
 *         description: Erro ao consultar produto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Status de sucesso
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro informando o problema
 *                   example: "Erro ao consultar produto"
 *                 data:
 *                   type: object
 *                   description: Valor de erro retornado pelo banco de dados
 *                   properties:
 *                     code:
 *                       type: string
 *                       description: Código de erro do banco de dados
 *                       example: "ER_BAD_FIELD_ERROR"
 *                     errno:
 *                       type: integer
 *                       description: Número do erro
 *                       example: 1054
 *                     sqlState:
 *                       type: string
 *                       description: Estado SQL
 *                       example: "42S22"
 *                     sqlMessage:
 *                       type: string
 *                       description: Mensagem de erro SQL
 *                       example: "Unknown column 'id' in 'where clause'"
 *                     sql:
 *                       type: string
 *                       description: Comando SQL que causou o erro
 *                       example: "SELECT * FROM products WHERE id = 9999;"
 */
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

/**
 * @swagger
 * /produto/atualizar/{id}:
 *   put:
 *     summary: Atualizar informações do produto
 *     description: Atualiza as informações de um produto existente com base no ID fornecido. Permite a atualização da imagem do produto.
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico do produto a ser atualizado
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 description: Nome do produto
 *                 example: "Pokebola Atualizada"
 *               descricao:
 *                 type: string
 *                 description: Descrição do produto
 *                 example: "Pokebola ideal para capturar um pokemon"
 *               preco:
 *                 type: number
 *                 description: Preço do produto
 *                 example: 69.99
 *               precoPromocional:
 *                 type: number
 *                 nullable: true
 *                 description: Preço promocional do produto (se houver)
 *                 example: 59.99
 *               quantidade:
 *                 type: integer
 *                 description: Quantidade em estoque
 *                 example: 150
 *               image:
 *                 type: string
 *                 nullable: true
 *                 format: binary
 *                 description: Imagem do produto (arquivo)
 *               old_image:
 *                 type: string
 *                 description: URL da imagem antiga do produto, usada caso não seja enviada uma nova
 *                 example: "imagem_antiga.jpg"
 *     responses:
 *       200:
 *         description: Produto atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Status de sucesso
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Mensagem informando o status
 *                   example: "Produto atualizado"
 *                 data:
 *                   type: object
 *                   description: Informações do resultado da atualização
 *                   properties:
 *                     fieldCount:
 *                       type: integer
 *                       description: Contagem de campos no resultado
 *                       example: 0
 *                     affectedRows:
 *                       type: integer
 *                       description: Número de linhas afetadas pela atualização
 *                       example: 1
 *                     insertId:
 *                       type: integer
 *                       description: ID do último registro inserido (não aplicável na atualização)
 *                       example: 0
 *                     info:
 *                       type: string
 *                       description: Informações sobre a operação
 *                       example: "Rows matched: 1  Changed: 1  Warnings: 0"
 *                     serverStatus:
 *                       type: integer
 *                       description: Status do servidor
 *                       example: 2
 *                     warningStatus:
 *                       type: integer
 *                       description: Status de aviso
 *                       example: 0
 *                     changedRows:
 *                       type: integer
 *                       description: Número de linhas que foram alteradas
 *                       example: 1
 *       400:
 *         description: Erro ao atualizar produto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Status de sucesso
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro informando o problema
 *                   example: "Erro ao atualizar produto"
 *                 data:
 *                   type: object
 *                   description: Valor de erro retornado pelo banco de dados
 *                   properties:
 *                     code:
 *                       type: string
 *                       description: Código de erro do banco de dados
 *                       example: "ER_BAD_FIELD_ERROR"
 *                     errno:
 *                       type: integer
 *                       description: Número do erro
 *                       example: 1054
 *                     sqlState:
 *                       type: string
 *                       description: Estado SQL
 *                       example: "42S22"
 *                     sqlMessage:
 *                       type: string
 *                       description: Mensagem de erro SQL
 *                       example: "Unknown column 'id' in 'where clause'"
 *                     sql:
 *                       type: string
 *                       description: Comando SQL que causou o erro
 *                       example: "UPDATE products SET name = 'Pokebola Atualizada' WHERE id = 9999;"
 */
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

/**
 * @swagger
 * /produto/deletar/{id}:
 *   delete:
 *     summary: Deletar um produto
 *     description: Remove um produto existente com base no ID fornecido.
 *     tags: [Produtos]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID numérico do produto a ser deletado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Produto deletado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Status de sucesso
 *                   example: true
 *                 message:
 *                   type: string
 *                   description: Mensagem informando o status
 *                   example: "Produto deletado"
 *                 data:
 *                   type: object
 *                   description: Informações sobre a operação de deletar
 *                   properties:
 *                     fieldCount:
 *                       type: integer
 *                       description: Contagem de campos no resultado
 *                       example: 0
 *                     affectedRows:
 *                       type: integer
 *                       description: Número de linhas afetadas pela exclusão
 *                       example: 1
 *                     insertId:
 *                       type: integer
 *                       description: ID do último registro inserido (não aplicável na exclusão)
 *                       example: 0
 *                     info:
 *                       type: string
 *                       description: Informações sobre a operação
 *                       example: "Rows matched: 1  Changed: 1  Warnings: 0"
 *                     serverStatus:
 *                       type: integer
 *                       description: Status do servidor
 *                       example: 2
 *                     warningStatus:
 *                       type: integer
 *                       description: Status de aviso
 *                       example: 0
 *                     changedRows:
 *                       type: integer
 *                       description: Número de linhas alteradas
 *                       example: 1
 *       400:
 *         description: Erro ao deletar produto
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   description: Status de sucesso
 *                   example: false
 *                 message:
 *                   type: string
 *                   description: Mensagem de erro informando o problema
 *                   example: "Erro ao deletar produto"
 *                 data:
 *                   type: object
 *                   description: Valor de erro retornado pelo banco de dados
 *                   properties:
 *                     code:
 *                       type: string
 *                       description: Código de erro do banco de dados
 *                       example: "ER_ROW_IS_REFERENCED_2"
 *                     errno:
 *                       type: integer
 *                       description: Número do erro
 *                       example: 1451
 *                     sqlState:
 *                       type: string
 *                       description: Estado SQL
 *                       example: "23000"
 *                     sqlMessage:
 *                       type: string
 *                       description: Mensagem de erro SQL
 *                       example: "Cannot delete or update a parent row: a foreign key constraint fails"
 *                     sql:
 *                       type: string
 *                       description: Comando SQL que causou o erro
 *                       example: "DELETE FROM products WHERE id = 9999;"
 */
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
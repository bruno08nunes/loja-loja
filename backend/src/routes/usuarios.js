const express = require("express");
const { uploadUser } = require("../multer");
const connection = require("../db_config");

const router = express.Router();

/**
 * @swagger
 * /usuario/cadastrar:
 *     post:
 *         summary: Cadastrar usuário no banco de dados
 *         description: Faz o cadastro de usuário no banco de dados da aplicação
 *         requestBody:
 *              required: true
 *              content:
 *                    application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              nome:
 *                                  type: string
 *                                  description: Nome do usuário
 *                                  example: "Bruno"
 *                              sobrenome:
 *                                  type: string
 *                                  description: Sobrenome do usuário
 *                                  example: "Nunes"
 *                              email:
 *                                  type: string
 *                                  description: Email do usuário
 *                                  example: "exemplo@email.com"
 *                              senha:
 *                                  type: string
 *                                  description: Senha do usuário
 *                                  example: "admin123"
 *                              cpf:
 *                                  type: string
 *                                  description: CPF do usuário
 *                                  example: "12345678910"
 *         responses:
 *              201:
 *                  description: Informações vinda do banco do usuário cadastrado
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                      description: Status de sucesso
 *                                      example: true
 *                                  message:
 *                                      type: string
 *                                      description: Mensagem informando o status
 *                                      example: "Usuário cadastrado com sucesso"
 *                                  data:
 *                                      type: object
 *                                      description: Valor retornado do banco de dados
 *                                      properties:
 *                                          fieldCount:
 *                                              type: integer
 *                                              description: Contagem de campos afetados
 *                                              example: 0
 *                                          affectedRows:
 *                                              type: integer
 *                                              description: Número de linhas afetadas
 *                                              example: 1
 *                                          insertId:
 *                                              type: integer
 *                                              description: ID do usuário cadastrado
 *                                              example: 44
 *                                          info:
 *                                              type: string
 *                                              description: Informações adicionais
 *                                              example: ""
 *                                          serverStatus:
 *                                              type: integer
 *                                              description: Status do servidor após a operação
 *                                              example: 2
 *                                          warningStatus:
 *                                              type: integer
 *                                              description: Status de alerta do servidor
 *                                              example: 0
 *                                          changedRows:
 *                                              type: integer
 *                                              description: Número de linhas modificadas
 *                                              example: 0
 *              400:
 *                  description: Informações de erro do banco de dados
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                      description: Status de sucesso
 *                                      example: false
 *                                  message:
 *                                      type: string
 *                                      description: Mensagem informando o status
 *                                      example: "Não foi possível cadastrar usuário"
 *                                  data:
 *                                      type: object
 *                                      description: Valor de erro retornado do banco de dados
 *                                      properties:
 *                                          code:
 *                                              type: string
 *                                              description: Código de erro do banco de dados
 *                                              example: "ER_DUP_ENTRY"
 *                                          errno:
 *                                              type: integer
 *                                              description: Número do erro
 *                                              example: 1062
 *                                          sqlState:
 *                                              type: string
 *                                              description: Estado SQL
 *                                              example: "23000"
 *                                          sqlMessage:
 *                                              type: string
 *                                              description: Mensagem de erro SQL
 *                                              example: "Duplicate entry 'exemplo@email.com' for key 'users.email'"
 *                                          sql:
 *                                              type: string
 *                                              description: Comando SQL que causou o erro
 *                                              example: "INSERT INTO users(first_name, family_name, email, password, cpf) VALUES('Bruno','Nunes','exemplo@email.com','admin123','12345678910');"
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

/**
 * @swagger
 * /usuario/login:
 *     post:
 *         summary: Login de usuário
 *         description: Faz o login do usuário na aplicação
 *         requestBody:
 *              required: true
 *              content:
 *                    application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              email:
 *                                  type: string
 *                                  description: Email do usuário
 *                                  example: "exemplo@email.com"
 *                              senha:
 *                                  type: string
 *                                  description: Senha do usuário
 *                                  example: "admin123"
 *         responses:
 *              200:
 *                  description: Informações vinda do banco do usuário cadastrado
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                      description: Status de sucesso
 *                                      example: true
 *                                  message:
 *                                      type: string
 *                                      description: Mensagem informando o status
 *                                      example: "Usuário logado"
 *                                  data:
 *                                      type: array
 *                                      description: Informações do usuário que realizou o login
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              id:
 *                                                  type: integer
 *                                                  description: ID do usuário
 *                                                  example: 38
 *                                              first_name:
 *                                                  type: string
 *                                                  description: Nome do usuário
 *                                                  example: "Bruno"
 *                                              family_name:
 *                                                  type: string
 *                                                  description: Sobrenome do usuário
 *                                                  example: "Nunes"
 *                                              email:
 *                                                  type: string
 *                                                  description: Email do usuário
 *                                                  example: "exemplo@email.com"
 *                                              password:
 *                                                  type: string
 *                                                  description: Senha do usuário
 *                                                  example: "admin123"
 *                                              cpf:
 *                                                  type: string
 *                                                  description: CPF do usuário
 *                                                  example: "12345678910"
 *                                              role:
 *                                                  type: string
 *                                                  description: Função do usuário no sistema
 *                                                  example: "U"
 *                                              image:
 *                                                  type: string
 *                                                  nullable: true
 *                                                  description: URL da imagem do usuário (se houver)
 *                                                  example: null
 *                                              created_at:
 *                                                  type: string
 *                                                  format: date-time
 *                                                  description: Data e hora da criação do usuário
 *                                                  example: "2024-10-09T00:29:18.000Z"
 *                                              updated_at:
 *                                                  type: string
 *                                                  format: date-time
 *                                                  description: Data e hora da última atualização do usuário
 *                                                  example: "2024-10-09T00:29:18.000Z"
 *              400:
 *                  description: Informações de erro do banco de dados
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                      description: Status de sucesso
 *                                      example: false
 *                                  message:
 *                                      type: string
 *                                      description: Mensagem informando o status
 *                                      example: "Não foi possível cadastrar usuário"
 *                                  data:
 *                                      type: object
 *                                      description: Valor de erro retornado do banco de dados
 *                                      properties:
 *                                          code:
 *                                              type: string
 *                                              description: Código de erro do banco de dados
 *                                          errno:
 *                                              type: integer
 *                                              description: Número do erro
 *                                          sqlState:
 *                                              type: string
 *                                              description: Estado SQL
 *                                          sqlMessage:
 *                                              type: string
 *                                              description: Mensagem de erro SQL
 *                                          sql:
 *                                              type: string
 *                                              description: Comando SQL que causou o erro
*/
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

/**
 * @swagger
 * /usuario/informacoes/{id}:
 *     get:
 *         summary: Pegar informações de usuário
 *         description: Pega informações de usuários (Nome, Sobrenome, Email, Cargo e Imagem)
 *         parameters:
 *             - in: path
 *             name: id
 *             required: true
 *             description: ID numérico que representa um usuário
 *             schema:
 *                  type: integer
 *         responses:
 *              200:
 *                  description: Informações vinda do banco de dados
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                      description: Status de sucesso
 *                                      example: true
 *                                  message:
 *                                      type: string
 *                                      description: Mensagem informando o status
 *                                      example: "Informações consultadas"
 *                                  data:
 *                                      type: array
 *                                      description: Informações de usuário
 *                                      items:
 *                                          type: object
 *                                          properties:
 *                                              first_name:
 *                                                  type: string
 *                                                  description: Nome do usuário
 *                                                  example: "Bruno"
 *                                              family_name:
 *                                                  type: string
 *                                                  description: Sobrenome do usuário
 *                                                  example: "Nunes"
 *                                              email:
 *                                                  type: string
 *                                                  description: Email do usuário
 *                                                  example: "exemplo@email.com"
 *                                              cpf:
 *                                                  type: string
 *                                                  description: CPF do usuário
 *                                                  example: "12345678910"
 *                                              role:
 *                                                  type: string
 *                                                  description: Função do usuário no sistema
 *                                                  example: "U"
 *                                              image:
 *                                                  type: string
 *                                                  nullable: true
 *                                                  description: URL da imagem do usuário (se houver)
 *                                                  example: null
 *              400:
 *                  description: Informações de erro do banco de dados
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  success:
 *                                      type: boolean
 *                                      description: Status de sucesso
 *                                      example: false
 *                                  message:
 *                                      type: string
 *                                      description: Mensagem informando o status
 *                                      example: "Não foi possível consultar informações do usuário"
 *                                  data:
 *                                      type: object
 *                                      description: Valor de erro retornado do banco de dados
 *                                      properties:
 *                                          code:
 *                                              type: string
 *                                              description: Código de erro do banco de dados
 *                                              example: "ER_BAD_FIELD_ERROR"
 *                                          errno:
 *                                              type: integer
 *                                              description: Número do erro
 *                                              example: 1054
 *                                          sqlState:
 *                                              type: string
 *                                              description: Estado SQL
 *                                              example: "42S22"
 *                                          sqlMessage:
 *                                              type: string
 *                                              description: Mensagem de erro SQL
 *                                              example: "Unknown column 'id' in 'where clause'"
 *                                          sql:
 *                                              type: string
 *                                              description: Comando SQL que causou o erro
 *                                              example: "SELECT * FROM users WHERE id = 9999;"
*/
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
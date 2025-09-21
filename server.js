const express = require('express');
const mysql = require('mysql2');
const path = require('path');
const app = express();
const port = 3000;

// Middleware para processar dados de formulário
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Servir o arquivo HTML estático
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// --- Configurações do Banco de Dados ---
const dbConfig = {
    host: 'localhost',
    user: 'root',     // Nome do seu usuário no MySQL
    password: '12345678',  // Sua senha de acesso
    database: 'sistemas' // O nome do seu banco de dados
};

// --- Criando o pool de conexões ---
const pool = mysql.createPool(dbConfig);

// --- Rota para lidar com o envio do formulário ---
app.post('/cadastro', (req, res) => {
    const { nome, email, telefone } = req.body;
    const data_cadastro = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sql = 'INSERT INTO clientes (nome, email, telefone, data_cadastro) VALUES (?, ?, ?, ?)';

    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Erro ao conectar ao banco de dados:', err);
            return res.status(500).send('Erro no servidor');
        }

        connection.query(sql, [nome, email, telefone, data_cadastro], (queryErr, result) => {
            connection.release(); // Sempre libere a conexão

            if (queryErr) {
                console.error('Erro ao inserir dados:', queryErr);
                return res.status(500).send('Erro ao inserir dados.');
            }

            console.log('Dados inseridos com sucesso! ID:', result.insertId);
            res.send('Dados inseridos com sucesso!');
        });
    });
});

// --- Iniciando o servidor ---
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
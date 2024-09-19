const express = require('express');
const mysql2 = require('mysql2');
const multer = require('multer');
const cors = require('cors');
require('dotenv').config(); // Para carregar variáveis de ambiente do .env

const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Conexão ao banco
const mysqli = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.use(express.json());
app.use(express.static('public'));

app.get('/arquivo', (req, res) => {
    const sql = 'SELECT id_arquivo, nome_arquivo, download_arquivo, tipo FROM arquivo';
    mysqli.query(sql, (err, result) => {
        if (err) {
            console.log('Erro ao consultar dados: ', err);
            return res.status(500).json({ success: false, message: 'erro ao consultar o banco' });
        }
        res.json(result);
    });
});

app.post('/upload', upload.single('download_arquivo'), (req, res) => {
    const { nome_arquivo } = req.body;
    const download_arquivo = req.file ? req.file.buffer : null;
    const tipo = req.file ? req.file.mimetype : null;

    if (!nome_arquivo || !download_arquivo) {
        return res.status(400).json({ success: false, message: 'nome do arquivo e arquivo sao obrigatorias' });
    }

    const sql = 'INSERT INTO arquivo (nome_arquivo, download_arquivo, tipo) VALUES (?, ?, ?)';
    mysqli.query(sql, [nome_arquivo, download_arquivo, tipo], (err, result) => {
        if (err) {
            console.log('Erro ao inserir dados: ', err);
            return res.status(500).json({ success: false, message: 'erro ao dar insert' });
        }
        res.redirect('/teste.html');
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

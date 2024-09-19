import express from 'express';
import mysql2 from 'mysql2';
import multer from 'multer';
import cors from 'cors';
const app = express();
const port = process.env.PORT;

app.use(cors({
    origin: '*',  //declara que todas as fontes podem ser acessadas;
    methods: ['GET', 'POST'], // lucas entao isso daqui é pra definir oque o usuario pode fazer com o fetch 
    allowedHeaders: ['Content-Type', 'Authorization'] // aqui fala o tipo de conteudo que no caso é autorização
}));

const storage = multer.memoryStorage(); // salva na memoria do usuario 
const upload = multer({ storage: storage }); // slva o arquivo la no banco bro

//conexao ao banco 
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
app.use(express.static('public')); // defini que a pasta public vai ser utilizada

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
    const { nome_arquivo } = req.body; // pega o nome do arquivo no form la
    const download_arquivo = req.file ? req.file.buffer : null; // pega o arquivo
    const tipo = req.file ? req.file.mimetype : null; // defini o tipo dele

    if (!nome_arquivo || !download_arquivo) {
        return res.status(400).json({ success: false, message: 'nome do arquivo e arquivo sao obrigatorias' });
    }

    const sql = 'INSERT INTO arquivo (nome_arquivo, download_arquivo, tipo) VALUES (?, ?, ?)';
    mysqli.query(sql, [nome_arquivo, download_arquivo, tipo], (err, result) => { // executa a query
        if (err) {
            console.log('Erro ao inserir dados: ', err);
            return res.status(500).json({ success: false, message: 'erro ao dar insert' });
        }
       res.redirect('/teste.html')
    });
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

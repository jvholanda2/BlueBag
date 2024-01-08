const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Configuração do multer para armazenar os arquivos na pasta 'uploads'
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// Rota principal que retorna a página de upload/download
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota para realizar o upload do arquivo
app.post('/upload', upload.single('arquivo'), (req, res) => {
    res.redirect('/');
});

// Rota para obter a lista de arquivos disponíveis para download
app.get('/arquivos', (req, res) => {
    fs.readdir('uploads', (err, files) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erro ao obter a lista de arquivos.');
        } else {
            res.json(files);
        }
    });
});

// Rota para download de um arquivo específico
app.get('/download/:filename', (req, res) => {
    const filePath = path.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath, req.params.filename);
});

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});

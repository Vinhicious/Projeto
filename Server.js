const express = require('express');
const cors = require('cors');
const app = express();
const rotas = require('./routes');
require('dotenv').config();

const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/', rotas);

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});

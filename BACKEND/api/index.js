const express = require('express');
const mongoose = require('mongoose'); // Importe o Mongoose no início
const app = express();

// Middleware para configurar os cabeçalhos CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.use(express.json());

const PORT = process.env.PORT || 3000;

// Conexão com MongoDB usando variável de ambiente
const mongoURL = process.env.MONGO_URI;

mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).catch((error) => {
    console.error('Erro ao conectar ao MongoDB:', error);
});

mongoose.Promise = global.Promise; // Configura o Mongoose para usar Promises globais

const db = mongoose.connection;
db.on('error', (error) => {
    console.error('Erro no banco de dados:', error);
});
db.once('connected', () => {
    console.log('Database Connected');
});

// Rotas
const routes = require('./routes/routes');
app.use('/api', routes);

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo deu errado!' });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Server Started at ${PORT}`);
});
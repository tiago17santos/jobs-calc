const express = require('express');
const server = express();
const routes = require('./routes.js')

//usando template engine
server.set('view engine', 'ejs');

//habilitar arquivos estáticos
server.use(express.static('public'))        

//rotas
server.use(routes)

server.listen(3000, () => console.log('rodando'))
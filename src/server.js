const express = require('express');
const server = express();
const routes = require('./routes.js')
const path = require('path');

//usando template engine
server.set('view engine', 'ejs');

//Mudar a localização da pasta view
server.set('views', path.join(__dirname, 'views'))

//habilitar arquivos estáticos
server.use(express.static('public'))    

//usando req.body 
server.use(express.urlencoded({ extended: true }))

//rotas
server.use(routes)

server.listen(3000, () => console.log('rodando'))
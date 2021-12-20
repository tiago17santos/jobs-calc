const sqlite3 = require('sqlite3');
const { open } = require('sqlite')


module.exports = () => 
//open(prop do sqlite) serve para configurar a abertura (conexão) do banco de dados
    open({
        filename: './database.sqlite', // local do arquivo onde quero salvar as infos 
        driver: sqlite3.Database
    })

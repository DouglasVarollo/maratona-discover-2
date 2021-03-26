const express = require('express');

const routes = require('./routes');

const server = express();

server.set('view engine', 'ejs');
server.set('views', 'src/views');
server.use(express.static('public'));
server.use(routes);

server.listen(3000, function () {
  console.log('rodando');
});

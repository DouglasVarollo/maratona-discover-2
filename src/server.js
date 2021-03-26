const express = require('express');

const server = express();

server.get('/', function (request, response) {
  response.send('OIE!!!');
});

server.listen(3000, function () {
  console.log('rodando');
});

const express = require('express');

const basePath = __dirname + '/views';
const routes = express.Router();

routes.get('/', function (request, response) {
  response.sendFile(basePath + '/index.html');
});

routes.get('/job', function (request, response) {
  response.sendFile(basePath + '/job.html');
});

routes.get('/job/edit', function (request, response) {
  response.sendFile(basePath + '/job-edit.html');
});

routes.get('/profile', function (request, response) {
  response.sendFile(basePath + '/profile.html');
});

module.exports = routes;

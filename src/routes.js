const express = require('express');

const routes = express.Router();

routes.get('/', function (request, response) {
  response.render('index');
});

routes.get('/job', function (request, response) {
  response.render('job');
});

routes.get('/job/edit', function (request, response) {
  response.render('job-edit');
});

routes.get('/profile', function (request, response) {
  response.render('profile');
});

module.exports = routes;

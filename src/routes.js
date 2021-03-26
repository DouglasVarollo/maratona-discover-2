const express = require('express');

const routes = express.Router();

const profile = {
  name: 'Douglas Varollo',
  avatar: 'https://github.com/DouglasVarollo.png',
  'monthly-budget': 3000,
  'days-per-week': 5,
  'hours-per-day': 5,
  'vacation-per-year': 4
};

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
  response.render('profile', {
    profile
  });
});

module.exports = routes;

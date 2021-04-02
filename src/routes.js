const express = require('express');

const routes = express.Router();

const Profile = {
  data: {
    name: 'Douglas Varollo',
    avatar: 'https://github.com/DouglasVarollo.png',
    'monthly-budget': 3000,
    'days-per-week': 5,
    'hours-per-day': 5,
    'vacation-per-year': 4,
    'value-hour': 75
  },
  controllers: {
    index(request, response) {
      response.render('profile', {
        profile: Profile.data
      });
    }
  }
};

const Job = {
  data: [
    {
      id: 1,
      name: 'Pizzaria Guloso',
      'daily-hours': 2,
      'total-hours': 60,
      created_at: Date.now()
    },
    {
      id: 2,
      name: 'OneTwo Project',
      'daily-hours': 3,
      'total-hours': 47,
      created_at: Date.now()
    }
  ],
  controllers: {
    index(request, response) {
      const updatedJobs = Job.data.map(function (job) {
        const remaining = Job.services.remainingDays(job);
        const status = remaining <= 0 ? 'done' : 'progress';

        return {
          ...job,
          remaining,
          status,
          budget: Profile.data['value-hour'] * job['total-hours']
        };
      });

      response.render('index', {
        jobs: updatedJobs
      });
    },

    create(request, response) {
      response.render('job');
    },

    save(request, response) {
      const lastId = Job.data[Job.data.length - 1]?.id || 1;

      Job.data.push({
        id: lastId + 1,
        name: request.body.name,
        'daily-hours': request.body['daily-hours'],
        'total-hours': request.body['total-hours'],
        created_at: Date.now()
      });

      response.redirect('/');
    }
  },
  services: {
    remainingDays(job) {
      const remainingDays = (job['total-hours'] / job['daily-hours']).toFixed();
      const createdDate = new Date(job.created_at);
      const dueDay = createdDate.getDate() + Number(remainingDays);
      const dueDateInMs = createdDate.setDate(dueDay);
      const timeDiffInMs = dueDateInMs - Date.now();
      const dayInMs = 1000 * 60 * 60 * 24;
      const dayDiff = Math.floor(timeDiffInMs / dayInMs);

      return dayDiff;
    }
  }
};

routes.get('/', Job.controllers.index);
routes.get('/job', Job.controllers.create);
routes.post('/job', Job.controllers.save);

routes.get('/job/edit', function (request, response) {
  response.render('job-edit');
});

routes.get('/profile', Profile.controllers.index);

module.exports = routes;

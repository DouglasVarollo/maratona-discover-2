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
    },

    update(request, response) {
      const data = request.body;
      const weeksPerYear = 52;
      const weeksPerMonth = (weeksPerYear - data['vacation-per-year']) / 12;
      const weekTotalHours = data['hours-per-day'] * data['days-per-week'];
      const monthlyTotalHours = weekTotalHours * weeksPerMonth;

      data['value-hour'] = data['monthly-budget'] / monthlyTotalHours;

      Profile.data = {
        ...Profile.data,
        ...data
      };

      response.redirect('/profile');
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
          budget: Job.services.calculateBudget(job, Profile.data['value-hour'])
        };
      });

      response.render('index', {
        jobs: updatedJobs
      });
    },

    create(request, response) {
      response.render('job');
    },

    delete(request, response) {
      const jobId = request.params.id;

      Job.data = Job.data.filter(function (job) {
        return job.id !== Number(jobId);
      });

      response.redirect('/');
    },

    save(request, response) {
      const lastId = Job.data[Job.data.length - 1]?.id || 0;

      Job.data.push({
        id: lastId + 1,
        name: request.body.name,
        'daily-hours': request.body['daily-hours'],
        'total-hours': request.body['total-hours'],
        created_at: Date.now()
      });

      response.redirect('/');
    },

    show(request, response) {
      const jobId = request.params.id;

      const job = Job.data.find(function (job) {
        if (job.id === Number(jobId)) {
          return job;
        }
      });

      if (!job) {
        return response.send('Job not found');
      }

      job.budget = Job.services.calculateBudget(
        job,
        Profile.data['value-hour']
      );

      response.render('job-edit', {
        job
      });
    },

    update(request, response) {
      const jobId = request.params.id;

      const job = Job.data.find(function (job) {
        if (job.id === Number(jobId)) {
          return job;
        }
      });

      if (!job) {
        return response.send('Job not found');
      }

      const updatedJob = {
        ...job,
        name: request.body.name,
        'total-hours': request.body['total-hours'],
        'daily-hours': request.body['daily-hours']
      };

      Job.data = Job.data.map(function (job) {
        if (job.id === Number(jobId)) {
          job = updatedJob;
        }

        return job;
      });

      response.redirect('/job/' + jobId);
    }
  },
  services: {
    calculateBudget(job, valueHour) {
      return valueHour * job['total-hours'];
    },

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
routes.get('/job/:id', Job.controllers.show);
routes.post('/job/:id', Job.controllers.update);
routes.post('/job/delete/:id', Job.controllers.delete);

routes.get('/profile', Profile.controllers.index);
routes.post('/profile', Profile.controllers.update);

module.exports = routes;

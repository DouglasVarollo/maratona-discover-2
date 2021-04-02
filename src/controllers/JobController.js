const Job = require('../models/Job');
const JobUtils = require('../utils/JobUtils');
const Profile = require('../models/Profile');

module.exports = {
  create(request, response) {
    response.render('job');
  },

  delete(request, response) {
    const jobId = request.params.id;

    Job.delete(jobId);

    response.redirect('/');
  },

  save(request, response) {
    const jobs = Job.get();
    const lastId = jobs[jobs.length - 1]?.id || 0;

    jobs.push({
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
    const jobs = Job.get();
    const profile = Profile.get();

    const job = jobs.find(function (job) {
      if (job.id === Number(jobId)) {
        return job;
      }
    });

    if (!job) {
      return response.send('Job not found');
    }

    job.budget = JobUtils.calculateBudget(job, profile['value-hour']);

    response.render('job-edit', {
      job
    });
  },

  update(request, response) {
    const jobId = request.params.id;
    const jobs = Job.get();

    const job = jobs.find(function (job) {
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

    updatedJobs = jobs.map(function (job) {
      if (job.id === Number(jobId)) {
        job = updatedJob;
      }

      return job;
    });

    Job.update(updatedJobs);

    response.redirect('/job/' + jobId);
  }
};

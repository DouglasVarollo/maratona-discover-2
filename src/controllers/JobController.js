const Job = require('../models/Job');
const JobUtils = require('../utils/JobUtils');
const Profile = require('../models/Profile');

module.exports = {
  create(request, response) {
    response.render('job');
  },

  async delete(request, response) {
    const jobId = request.params.id;

    await Job.delete(jobId);

    response.redirect('/');
  },

  async save(request, response) {
    await Job.create({
      name: request.body.name,
      'daily-hours': Number(request.body['daily-hours']),
      'total-hours': Number(request.body['total-hours']),
      created_at: Date.now()
    });

    response.redirect('/');
  },

  async show(request, response) {
    const jobId = request.params.id;
    const jobs = await Job.get();
    const profile = await Profile.get();

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

  async update(request, response) {
    const jobId = request.params.id;

    const updatedJob = {
      name: request.body.name,
      'total-hours': Number(request.body['total-hours']),
      'daily-hours': Number(request.body['daily-hours'])
    };

    await Job.update(updatedJob, jobId);

    response.redirect('/job/' + jobId);
  }
};

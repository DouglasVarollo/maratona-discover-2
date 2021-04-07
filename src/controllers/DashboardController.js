const Job = require('../models/Job');
const JobUtils = require('../utils/JobUtils');
const Profile = require('../models/Profile');

module.exports = {
  async index(request, response) {
    const jobs = await Job.get();
    const profile = await Profile.get();

    const statusCount = {
      done: 0,
      progress: 0,
      total: jobs.length
    };

    let jobTotalHours = 0;

    const updatedJobs = jobs.map(function (job) {
      const remaining = JobUtils.remainingDays(job);
      const status = remaining <= 0 ? 'done' : 'progress';

      jobTotalHours += status === 'progress' ? job['daily-hours'] : 0;
      statusCount[status] += 1;

      return {
        ...job,
        remaining,
        status,
        budget: JobUtils.calculateBudget(job, profile['value-hour'])
      };
    });

    const freeHours = profile['hours-per-day'] - jobTotalHours;

    response.render('index', {
      freeHours,
      jobs: updatedJobs,
      profile,
      statusCount
    });
  }
};

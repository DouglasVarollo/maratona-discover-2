const Profile = require('../models/Profile');

module.exports = {
  async index(request, response) {
    response.render('profile', {
      profile: await Profile.get()
    });
  },

  async update(request, response) {
    const data = request.body;
    const weeksPerYear = 52;
    const weeksPerMonth = (weeksPerYear - data['vacation-per-year']) / 12;
    const weekTotalHours = data['hours-per-day'] * data['days-per-week'];
    const monthlyTotalHours = weekTotalHours * weeksPerMonth;

    data['value-hour'] = data['monthly-budget'] / monthlyTotalHours;

    const profile = await Profile.get();

    Profile.update({
      ...profile,
      ...data
    });

    response.redirect('/profile');
  }
};

const Profile = require('../models/Profile');

module.exports = {
  index(request, response) {
    response.render('profile', {
      profile: Profile.get()
    });
  },

  update(request, response) {
    const data = request.body;
    const weeksPerYear = 52;
    const weeksPerMonth = (weeksPerYear - data['vacation-per-year']) / 12;
    const weekTotalHours = data['hours-per-day'] * data['days-per-week'];
    const monthlyTotalHours = weekTotalHours * weeksPerMonth;

    data['value-hour'] = data['monthly-budget'] / monthlyTotalHours;

    Profile.update({
      ...Profile.get(),
      ...data
    });

    response.redirect('/profile');
  }
};

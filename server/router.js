const authentication = require('./controllers/authentication');
const manageUser = require('./controllers/manageUser')
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth =  passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.post('/api/auth/signin', requireSignin, authentication.signin);
  app.post('/api/auth/signup', authentication.signup);
  app.post('/api/user/addpass', requireAuth, manageUser.addPass);
  app.put('/api/user/updateinfo', requireAuth, manageUser.updateInfo);
  app.delete('/api/user/delete', requireAuth, manageUser.delete);
};
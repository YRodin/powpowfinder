const authentication = require('./controllers/authentication');
const manageUser = require('./controllers/manageUser');
const dataCollection = require('./controllers/dataCollection');
const passportService = require('./services/passport');
const passport = require('passport');

const requireAuth =  passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', { session: false });

module.exports = function(app) {
  app.post('/api/auth/signin', requireSignin, authentication.signin);
  app.post('/api/auth/signup', authentication.signup);
  app.get('/api/user', requireAuth,  authentication.currentUser);
  app.post('/api/user/addpass', requireAuth, manageUser.addPass);
  app.put('/api/user/updateinfo', requireAuth, manageUser.updateInfo);
  app.delete('/api/user/delete', requireAuth, manageUser.delete);
  app.get('/api/getpassinfo', dataCollection.getPassInfo);
  app.get('/api/getResortCoordinates', dataCollection.getResortCoordinates);
};
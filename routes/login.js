import express from 'express';
import passport from 'passport';

const router = express.Router();

router.get('/', function(req, res) {
  try {
    if (req.isAuthenticated()) {
      return res.render('index', { title: 'Home', username: req.user.name, loggedIn: true});
      
    } else {
      const message = req.session.messages != null ||  req.session.messages != undefined ? req.session.messages[0] : '';
  
      // clean error message session
      req.session.messages = null;
      
      res.render('login', { title: 'Login', message: message});
    }
  } catch (error) {
    res.status(404).render('error', {
      title: 'Error',
      message: 'Error: something went wrong',
      username: req.user ? req.user.name : 'Hug Data',
      loggedIn: req.user ? true : false,
    });
  }


});

router.post('/', passport.authenticate('local', { successRedirect: '/',failureRedirect: '/login', failureMessage:"Incorrect user or password :("}));

export default router;
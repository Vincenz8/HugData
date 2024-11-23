import express from 'express';
var router = express.Router();

router.get('/', function(req, res) {
  try {
    if (req.isAuthenticated()) {
      return res.render('logout', { title: 'Logout'});
      
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

router.post('/', function(req, res, next){

  req.logout(function(err) {
      if (err) { 
          return next(err); 
      }
      return res.redirect('/');
  });


});

export default router;
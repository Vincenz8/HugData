import express from 'express';
var router = express.Router();

router.get('/', function(req, res) {
  try {
    
    if (req.isAuthenticated()) {

      if (req.user.creator) {
        return res.render('op_creator', { title: 'Create' , username: req.user.name, loggedIn: true});

      } else {
        console.log("Error: becom a creator");
        return res.render('not_creator', { title: 'Become a creator', username: req.user.name, loggedIn: true});
      }
      

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

export default router;
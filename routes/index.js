import express from 'express';

const router = express.Router();

router.get('/', function(req, res) {
  try {
    if (req.isAuthenticated()) {
      return res.render('index', { title: 'Home', username: req.user.name, loggedIn: true});
  
    } else {
  
      return res.render('index', { title: 'Home', username:'Hug Data', loggedIn: false});
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

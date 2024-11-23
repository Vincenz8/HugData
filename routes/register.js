import express from 'express';
import { body, validationResult } from 'express-validator';
import {HugDB} from "../database/HugDB.js"

let router = express.Router();

const db = new HugDB();

router.get('/', function(req, res) {
  try {
    if (req.isAuthenticated()) {
      return res.render('index', { title: 'Home', username: req.user.name, loggedIn: true});
      
    } else {
      const message = req.session.errorMessage;
  
      // clean error message session
      req.session.errorMessage = null;
  
      res.render('register', { title: 'Register', message: message});
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

// input validation
const checkInput = [body('username').notEmpty().trim(), 
  body('password').notEmpty().trim().isStrongPassword({
  minLength: 8, 
  minLowercase: 1, 
  minUppercase: 1, 
  minNumber: 1,
  minSymbols: 1,
  }), 
  body('email').notEmpty().trim().isEmail(),
  body('userType').notEmpty().trim()]

router.post('/', checkInput, async function(req, res){
  try {
    const result = validationResult(req);

    if (result.isEmpty()) {
  
      const present = await db.userPresent(req.body["email"].toLowerCase(), req.body["username"])
      
      if(present[0]){
        req.session.errorMessage = present[1]
        return res.redirect("/register")
      }
      else{
        await db.newUser(req.body["email"].toLowerCase(), req.body["password"], req.body["username"], req.body["userType"]  === "creator" ? true : false)
      }
    }
    return res.redirect("/login")

  } catch (error) {
    res.status(404).render('error', {
      title: 'Error',
      message: 'Error: something went wrong',
      username: req.user ? req.user.name : 'Hug Data',
      loggedIn: req.user ? true : false,
    });
  }

})

export default router;
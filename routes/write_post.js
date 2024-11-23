import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path'

import {HugDB} from "../database/HugDB.js"
const db = new HugDB();

var router = express.Router();

router.get('/', (req, res) => {
  try {
    if (req.isAuthenticated()) {

      if (req.user.creator) {
        return res.render('write_post', { title: 'Write' , username: req.user.name, loggedIn: true});
  
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

// input validation
const checkInput = [body('title').notEmpty().trim().isLength({min:1, max:30}),
                    body('corpus').notEmpty().trim()]

const storage = multer.diskStorage({
  destination: (req, file, cb) =>{cb(null, './public/images/articles')},
  filename: (req, file, cb) =>{cb(null, req.user.email +Date.now()+ path.extname(file.originalname))}
})

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname)
  if (ext === '.jpeg' || ext === '.png') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({ storage: storage , fileFilter: fileFilter})

router.post('/', upload.single('pathImg'), checkInput, async (req, res)=>{
  try {
    const result = validationResult(req);

    if (result.isEmpty()) {
            
      const published = await db.newArticle(req.body['title'], req.file.path, req.body['corpus'], req.user.email, JSON.parse(req.body['categories']))
  
      if (published) {
        return res.redirect("/")
      } else {
        return res.redirect("/write_post")
      }
    }
    else{
  
      return res.redirect("/login")
    }
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
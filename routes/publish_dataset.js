import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path'

import {HugDB} from "../database/HugDB.js"
const db = new HugDB();

var router = express.Router();


// input validation
const checkInput = [body('title').notEmpty().trim().isLength({min:1, max:20}),
  body('description').notEmpty().trim().isLength({min: 1, max: 150})]

const storage = multer.diskStorage({
  destination: (req, file, cb) =>{
                  if (file.fieldname === 'pathImg') {
                    cb(null, './public/images/datasets')
                  } else {
                    cb(null, './public/datasets')
                  }
                  
  },
  filename: (req, file, cb) => {
              cb(null, req.user.email +Date.now()+ path.extname(file.originalname))
  },

})

const fileFilter = (req, file, cb) => {

  const ext = path.extname(file.originalname)

  if (file.fieldname === 'pathImg') {

    if (ext === '.jpeg' || ext === '.png' || ext === '.jpg') {
      cb(null, true)
    } else {
      cb(null, false)
    }

  } else {
    if (ext === '.zip') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  }
}

const upload = multer({ storage: storage , fileFilter: fileFilter })

const files = upload.fields([{name: 'pathImg', maxCount:1}, {name: 'datasetFile', maxCount:1}])

router.get('/', files, checkInput, function(req, res) {
  try {
    if (req.isAuthenticated()) {

      if (req.user.creator) {
        return res.render('publish_dataset', { title: 'Publish' , username: req.user.name, loggedIn: true});
  
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


router.post('/', files, checkInput, async (req, res) => {
  try {
    const result = validationResult(req);

    if (result.isEmpty()) {
  
      const published = await db.newDataset(req.body['title'], req.files['pathImg'][0].path, req.body['description'], req.files['datasetFile'][0].path, req.user.email)
  
      if (published) {
        console.log("porcodio");
  
        return res.redirect("/")
  
      } else {
        return res.redirect("/publish_dataset")
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

export default router
import express from 'express';
import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path'
import {HugDB} from "../database/HugDB.js"

const db = new HugDB();
var router = express.Router();


router.get('/',async (req, res) =>{
  try {
    if (req.isAuthenticated()) {

      const augHistory = await db.getUserAugment(req.user.email)
      return res.render('profile', { title: 'Profile' , username: req.user.name, loggedIn: true, user: req.user, augHistory:augHistory});
      
    } else {
      return res.render('login', {title: 'Login'});
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
const checkInput = [body('description').notEmpty().trim().isLength({min:1, max:100})]

const storage = multer.diskStorage({
  destination: (req, file, cb) =>{cb(null, './public/images/profile_pic')},
  filename: (req, file, cb) =>{cb(null, req.user.email + path.extname(file.originalname))}
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

router.post('/update_profile_photo', upload.single('profilePhoto'),async (req, res) => {
  try {
    await db.updateUserPathImg(req.file.path, req.user.name)
    res.redirect('/profile')
  } catch (error) {
    res.status(404).render('error', {
      title: 'Error',
      message: 'Error: something went wrong',
      username: req.user ? req.user.name : 'Hug Data',
      loggedIn: req.user ? true : false,
    });
  }

} )


router.post('/update_description', checkInput, async (req, res) => {
  try {
    const result = validationResult(req);

    if (result.isEmpty()){
      await db.updateUserDescription(req.body['description'], req.user.name)
      return res.redirect('/profile')
    }
    return res.redirect('/')
  
  } catch (error) {
    res.status(404).render('error', {
      title: 'Error',
      message: 'Error: something went wrong',
      username: req.user ? req.user.name : 'Hug Data',
      loggedIn: req.user ? true : false,
    });
  }

} )

router.post('/become_creator', async (req, res) => {
  try {
    const result = validationResult(req);

    if (result.isEmpty()){
      await db.userBecomeCreator(req.user.name);
      return res.redirect('/profile')
    }
    return res.redirect('/')
  
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
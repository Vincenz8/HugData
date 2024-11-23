import express from 'express';
import { param, validationResult} from 'express-validator';
import { HugDB } from '../database/HugDB.js';

const db = new HugDB();
var router = express.Router();


// parameters validations
const checkParams = [param('type').isIn(['articles', 'datasets'])]

router.get('/:name/:type', checkParams, async function(req, res) {
  try {
    const result = validationResult(req);

    if (result.isEmpty()) {
      let found;
      let ableDel = false;
      let creator = req.user
      let username = 'Hug Data'
      let loggedIn = false
      
      if (req.isAuthenticated()) {
        if (req.user.name === req.params.name) {
          if (req.params.type === 'articles') {
            found = await db.getUserArticles(req.user.email);
          } else {
            found = await db.getUserDatasets(req.user.email);
          }
          ableDel = true;
          return res.render('creator', { title: 'Creator', username: req.user.name, loggedIn: true, found: found, type: req.params.type, ableDel: ableDel, creator: creator});
        }
        username = req.user.name;
        loggedIn = true
      }
  
      creator = await db.getUserByName(req.params.name)
      if (req.params.type === 'articles') {
        found = await db.getUserArticles(creator.email);
      } else {
        found = await db.getUserDatasets(creator.email);
      }
  
      return res.render('creator', { title: 'Creator', username: username, loggedIn: loggedIn, found: found, type: req.params.type, ableDel: ableDel, creator: creator}); 
  
    }else{
      return res.redirect('/');
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

router.delete('/:name/:type/:id', async (req, res) => {
  try {
    const result = validationResult(req);

    if (result.isEmpty()) {
      if (req.isAuthenticated()) {
  
        if (req.params.type === 'articles') {
  
          await db.deleteArticle(req.params.id)
        } else {
  
          await db.deleteDataset(req.params.id)
        }   
  
        res.status(200).json({message: 'Success'})
      }
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
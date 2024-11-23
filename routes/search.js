import express from 'express';
import { param, validationResult} from 'express-validator';
import { HugDB } from '../database/HugDB.js';


let router = express.Router();
const db = new HugDB;

// parameters validations
const checkParams = [param('type').isIn(['articles', 'datasets', 'creators', null])]
router.get('/:type?', checkParams, async function(req, res) {
  try {
    const result = validationResult(req);

    if (result.isEmpty()) {
      let found;
  
      if (req.params.type === 'articles') {
        found = await db.searchArticles(req.query.searchTitle);
        found = await Promise.all(found.map(async (article)=>{return {creator: await db.getUser(article.USEREmail), article: article}}))
      } else if (req.params.type === 'creators') {
        found = await db.searchCreators(req.query.searchTitle);
      } else{
        found = await db.searchDatasets(req.query.searchTitle);
        found = await Promise.all(found.map(async (dataset)=>{return {creator: await db.getUser(dataset.USEREmail), dataset: dataset}}))
      }
      
      
      if (req.isAuthenticated()) {
        return res.render('search', { title: 'Search', username: req.user.name, loggedIn: true, type: req.params.type || 'datasets', found: found});
        
      } else {
        return res.render('search', { title: 'Search', username: "Hug Data", loggedIn: false,  type: req.params.type || 'datasets', found: found});
      }
  
    }
    else{
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

export default router;
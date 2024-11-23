import express from 'express';
import { param, validationResult} from 'express-validator';
import { HugDB } from '../database/HugDB.js';


let router = express.Router();
const db = new HugDB;

router.get('/:id?', async (req, res)=> {
  try {
    if (req.isAuthenticated()) {
      const article = await db.getArticle(req.params['id'])
  
      if (article) {
        const writer = await db.getUser(article.USEREmail)
  
        const writerInfo = {writerName: writer.name, 
                            writerDescr: writer.description, 
                            writerImg: writer.pathImg
        }
  
        const categories = await db.getArticleCategories(article.id)
  
        const love = await db.lovePresent(req.user.email, req.params['id'])
        const nLove = await db.getArticleLove(article.id)
        const btnClass = love ? 'loved':'unloved';
  
        let comments = await db.getArticleComments(req.params['id'])
        comments = await Promise.all(comments.map(async (comment)=>{return {user: (await db.getUser(comment.userEmail)).name, corpus: comment.corpus}}))
  
        return res.render('article', { title: 'Article' , username: req.user.name, loggedIn: true, article: article, writerInfo: writerInfo, categories: categories, loved: btnClass, nLove: nLove, comments: comments});
  
      } else {
        return res.render('login', {title: 'Login'});
      }
  
    } else {
      const message = req.session.messages != null ||  req.session.messages != undefined ? req.session.messages[0] : '';
  
      // clean error message session
      req.session.messages = null;
      
      res.render('login', { title: 'Login', message: message});
    }

  } catch (error) {
    console.log(error);
    res.status(404).render('error', {
      title: 'Error',
      message: 'Error: something went wrong',
      username: req.user ? req.user.name : 'Hug Data',
      loggedIn: req.user ? true : false,
    });
  }
});


router.post('/love/:id?', async(req, res) => {
  try {
    if (req.isAuthenticated()) {
      const love = await db.lovePresent(req.user.email, req.params['id'])
  
      if (love) {
        await db.rmLove(req.user.email, req.params['id'])
  
      } else {
  
        await db.addLove(req.user.email, req.params['id'])
      }
      return res.redirect('/article/'+ req.params['id']);
  
    } else {
      return res.redirect('/login');
    }
  } catch (error) {
    console.log(error);
    res.status(404).render('error', {
      title: 'Error',
      message: 'Error: something went wrong',
      username: req.user ? req.user.name : 'Hug Data',
      loggedIn: req.user ? true : false,
    });
  }


});


router.post('/comment/:id?', async (req, res) => {
  try {
    if (req.isAuthenticated()) {
      const comment = await db.newComment(Date.now(), req.body['comment'], req.user.email, req.params['id'])

    return res.redirect('/article/'+ req.params['id']);

    } else {
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


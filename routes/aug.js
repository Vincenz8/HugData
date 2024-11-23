import express from 'express';
import decompress from 'decompress';
import { Jimp } from 'jimp';
import archiver from 'archiver';
import multer from 'multer';
import path from 'path'
import { readdir, rm } from 'fs/promises';
import { createWriteStream } from 'fs';

import { HugDB } from '../database/HugDB.js';


let router = express.Router();
const db = new HugDB();

class ImgAug{
  constructor(file){
    this.file = file;
    this.fdir = path.dirname(file)
    this.fbase = path.basename(file)
  }
  // function for data augmentaton
  async flip(horizontal) {
    let img = await Jimp.read('./public/augment/result/'+this.file)
    const value = horizontal === 1;
    img.flip({horizontal:value, vertical: !value})
    await img.write('./public/augment/result/'+this.fdir+'/flip'+this.fbase)

  }
  async rotate(degrees = 42) {
    let img = await Jimp.read('./public/augment/result/'+this.file)
    img.rotate(degrees)
    await img.write('./public/augment/result/'+this.fdir+'/rotate'+this.fbase)
  }
  async bright(val = 0.5) {
    let img = await Jimp.read('./public/augment/result/'+this.file)
    img.brightness(val)
    await img.write('./public/augment/result/'+this.fdir+'/bright'+this.fbase)
   }
  async blur(val = 5) {
    let img = await Jimp.read('./public/augment/result/'+this.file)
    img.blur(5)
    await img.write('./public/augment/result/'+this.fdir+'/blur'+this.fbase)
  }

  async contrast(file, val = 0.75) {
    let img = await Jimp.read('./public/augment/result/'+this.file)
    img.blur(5)
    await img.write('./public/augment/result/'+this.fdir+'/contrast'+this.fbase)
  }
}

function zipDirectory(sourceDir, outPath) {
  const archive = archiver('zip', { zlib: { level: 9 }});
  const stream = createWriteStream(outPath);

  return new Promise((resolve, reject) => {
    archive
      .directory(sourceDir, false)
      .on('error', err => reject(err))
      .pipe(stream)
    ;

    stream.on('close', () => resolve());
    archive.finalize();
  });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) =>{ cb(null, './public/augment')},
  filename: (req, file, cb) => {
                cb(null, req.user.email + path.extname(file.originalname))

  },
})

const fileFilter = (req, file, cb) => {

  const ext = path.extname(file.originalname)

  if (ext === '.zip') {
    cb(null, true)
  } else {
    cb(null, false)
  }
}

const upload = multer({ storage: storage , fileFilter: fileFilter })

router.get('/', function(req, res) {
  try {
    if (req.isAuthenticated()) {
      return res.render('aug', { title: 'Augment', username: req.user.name, loggedIn: true});
  
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

router.post('/data_augment', upload.single('datasetFile'), async(req, res) => {
  try {
    let ext = path.extname(req.file.originalname)
    let prefix = req.isAuthenticated() ? req.user.email: 'anon'
  
    await decompress('./public/augment/' + prefix + ext, './public/augment/result')
    await rm('./public/augment/' + prefix + ext)
    const files = await readdir('./public/augment/result', {recursive:true})
    let nOp = 0;
    let nImg = 0;
    await Promise.all(
      files.map(async(file) => {
        const ext = path.extname(file);
        if (ext === '.png' || ext === '.jpeg') {
          const aug = new ImgAug(file);
          nImg++
          return Promise.all(Object.entries(req.body).map(async([op, value]) => {
            if(value !== ''){
              await aug[op](Number(value)); 
              nOp++;
            }
          }));
        }
      })
    );
    
    const augDataset = './public/augment/'+ prefix +Date.now()+'.zip'
  
    await zipDirectory('./public/augment/result', augDataset );
    await rm('./public/augment/result', {recursive:true});
    if (req.isAuthenticated()) {
      await db.newAugment(Date.now(), (nOp/nImg) + 1, req.file.originalname, augDataset, req.user.email)
    }
  
    return res.redirect('/search')
  } catch (error) {
    res.status(404).render('error', {
      title: 'Error',
      message: 'Error: something went wrong',
      username: req.user ? req.user.name : 'Hug Data',
      loggedIn: req.user ? true : false,
    });
  }

})

router.get('/download', async (req, res) => {
  try {
    if (req.isAuthenticated()) {

      const dataset = await db.getRecentAugFile(req.user.email)
  
      return res.render('aug_download', { title: 'Augment', username: req.user.name, loggedIn: true, number: dataset.nOp, download: dataset.pathAug});
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

})

export default router
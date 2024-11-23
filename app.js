import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import passport from "passport";
import session from 'express-session'
import sqliteStoreFactory from 'express-session-sqlite'
import pkg from 'sqlite3';
import  {fileURLToPath } from 'url';

// router
import indexRouter from './routes/index.js';
import searchRouter from './routes/search.js';
import augRouter from './routes/aug.js';
import loginRouter from './routes/login.js';
import logoutRouter from './routes/logout.js'
import articleRouter from './routes/article.js';
import profileRouter from './routes/profile.js';
import registerRouter from './routes/register.js';
import writePostRouter from './routes/write_post.js';
import opCreatorRouter from './routes/op_creator.js';
import publishDatasetRouter from './routes/publish_dataset.js'
import creatorRouter from './routes/creator.js'

// database setup
import {HugDB} from "./database/HugDB.js";

const db = new HugDB();
const SqliteStore = sqliteStoreFactory.default(session)
const {Database} = pkg;

const sqliteStore = new SqliteStore({driver: Database, 
                                    path: './database/datab.sqlite',    
                                    ttl: 1209600000,
                                    prefix: 'sess:',
                                    cleanupInterval: 300000});
const app = express();

// view engine setup

const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// passport and session setup

app.use(session({
  secret: "UseRealKey",
  cookie: { path: '/',
            httpOnly: true, 
            maxAge: 1209600000},

  store: sqliteStore,
  resave: true,
  saveUninitialized: false,
}));

app.use(passport.session())
passport.use(db.login());


passport.serializeUser(function(user, done){
    return done(null, user.name);
});

passport.deserializeUser(db.deserialize);

app.use((req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '-1');
  next();
});



// routes
app.use('/', indexRouter);
app.use('/search', searchRouter);
app.use('/aug', augRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/article', articleRouter);
app.use('/profile', profileRouter);
app.use('/register', registerRouter);
app.use('/write_post', writePostRouter);
app.use('/publish_dataset', publishDatasetRouter)
app.use('/op_creator', opCreatorRouter);
app.use('/creator', creatorRouter)


app.use(function(req, res, next) {
  res.status(404).render('error', {
      title: 'Error',
      message: 'Error: something went wrong',
      username: req.user ? req.user.name : 'Hug Data',
      loggedIn: req.user ? true : false,
    });
});


db.setupDB().then(() => {app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});})


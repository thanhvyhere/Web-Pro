import { dirname } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import session from 'express-session';
import administratorRouter from '../routes/administrator.route.js'
import editorRouter from '../routes/editor.route.js';
import writerRouter from '../routes/writer.route.js';
import newspaperRouter from '../routes/news.route.js';
import subcriberRouter from '../routes/subcriber.route.js';
import readerRouter from '../routes/reader.route.js';
import accountRouter from '../routes/account.route.js';
import { checkPremium, authAdmin, authEditor, authWriter } from './auth.mdw.js';
import passport from 'passport';
import auth from './auth.mdw.js';
export default function (app) {
    
  
  app.get('/', checkPremium, async function (req, res) {
     if (!req.session.auth || !req.session.authUser) {
          // Truyền dữ liệu vào view
          return res.render('homepage');
      }
      
      if (req.session.views) {
          req.session.views++;
      } else req.session.views = 1;
  
      
      const role = req.session.authUser.role;
      return res.redirect(`/${role}`);
  });

app.use('/account', accountRouter);
app.use('/writer', writerRouter);
app.use('/newspaper', newspaperRouter);
// Khởi động server
// app.use('/artist', artistRouter);
app.use('/guest', readerRouter)

app.use('/role', editorRouter);


app.use('/editor', editorRouter);
app.use('/subscriber', checkPremium, subcriberRouter);
app.use('/administrator', authAdmin, administratorRouter);

}


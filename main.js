import express from 'express';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import configurePassportGithub from './controllers/passportGithub.config.js';
import configurePassportGoogle from './controllers/passportGoogle.config.js';
import activate_locals_middleware from './middleware/locals.mdw.js';
import activate_view_middleware from './middleware/view.mdw.js';
import activate_route_middleware from './middleware/routes.mdw.js';
import activate_session_middleware from './middleware/session.mdw.js';
import passport from 'passport';

import cron from 'node-cron';
import axios from 'axios'
const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url)); 
app.use(express.urlencoded({
    extended: true
}));

app.use('/static', express.static('static'));
app.use('/css', express.static(path.join(__dirname, 'static', 'css')));
app.use('/imgs', express.static(path.join(__dirname, 'static', 'imgs')));


app.use(express.json()); 








activate_session_middleware(app);
  app.use(passport.initialize());
app.use(passport.session());
  configurePassportGithub();
activate_locals_middleware(app);
activate_view_middleware(app);
activate_route_middleware(app);

// cron.schedule('* * * * *', async () => {
//     console.log('Cron job started...');
//     try {
//         const response = await axios.get('http://localhost:3000/newspaper/update-status');
//     } catch (error) {
//         console.error('Cron job error:', error.message);
//     }
// });

app.listen(3000, function () {
    console.log('App is running at http://localhost:3000');
});

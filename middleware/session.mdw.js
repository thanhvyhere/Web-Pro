import session from 'express-session';
import passport from 'passport';

export default function (app) {
  app.use(session({
      secret: 'keyboard cat',
      resave: false,
      saveUninitialized: true,
      cookie: {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24 * 7
      }
  }));
  app.use(passport.initialize());
  app.use(passport.session());
}
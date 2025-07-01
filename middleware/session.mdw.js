import session from "express-session";
import passport from "passport";
export default function (app) {
  app.use(
    session({
      secret: "keyboard cat",
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      },
    })
  );
}

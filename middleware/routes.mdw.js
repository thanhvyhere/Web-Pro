import { dirname } from "path";
import { fileURLToPath } from "url";
import express from "express";
import session from "express-session";
import administratorRouter from "../routes/administrator.route.js";
import editorRouter from "../routes/editor.route.js";
import writerRouter from "../routes/writer.route.js";
import newspaperRouter from "../routes/news.route.js";
import subcriberRouter from "../routes/subcriber.route.js";
import readerRouter from "../routes/reader.route.js";
import accountRouter from "../routes/account.route.js";
import { checkPremium, authAdmin, authEditor, authWriter } from "./auth.mdw.js";
import passport from "passport";
import auth from "./auth.mdw.js";
export default function (app) {
  app.get("/", checkPremium, async function (req, res) {
    if (!req.session.auth || !req.session.authUser) {
      // Truyền dữ liệu vào view
      return res.render("homepage");
    }

    if (req.session.views) {
      req.session.views++;
    } else req.session.views = 1;

    const permission = req.session.authUser.permission;

    // Redirect users to their respective dashboards
    switch (permission) {
      case 1:
        return res.redirect("/reader");
      case 2: // Subscriber
        return res.redirect("/subscriber");
      case 3: // Writer
        return res.redirect("/writer");
      case 4: // Editor
        return res.redirect("/editor");
      case 5: // Admin
        return res.redirect("/administrator");
      default: // Guest or invalid permission
        return res.redirect("/");
    }
  });

  app.use("/account", accountRouter);
  app.use("/writer",authWriter, writerRouter);
  app.use("/newspaper", newspaperRouter);
  // Khởi động server
  // app.use('/artist', artistRouter);
  app.use("/reader", readerRouter);

  app.use("/role", editorRouter);

  app.use("/editor",authEditor, editorRouter);
  app.use("/subscriber", checkPremium, subcriberRouter);
  app.use("/administrator", authAdmin, administratorRouter);
  app.use("/error", (req, res) => {
    res.status(404).render("error", {
      status: "Lỗi rồi",
      message: "Bạn tại lại trang trước nhe!",
      layout: "empty",
    });
  });
  app.use((req, res) => {
    res.status(404).render("error", {
      status: 404,
      message: "Trang bạn tìm không tồn tại!",
      layout: "empty",
    });
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).render("error", {
      status: 500,
      message: "Lỗi máy chủ, vui lòng thử lại sau.",
      layout: "empty",
    });
  });
}

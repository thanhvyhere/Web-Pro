import express from "express";
import newsService from "../services/news.service.js";
import editorService from "../services/editor.service.js";
import fs from "fs";
import multer from "multer";
import path from "path";

const router = express.Router();

// Homepage route
router.get("/", async function (req, res) {
  res.render("homepage", {});
});

export default router;

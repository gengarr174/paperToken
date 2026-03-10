import express from "express";
import upload from "./src/middlewares/upload.js";

const app = express();

app.listen(process.env.PORT);
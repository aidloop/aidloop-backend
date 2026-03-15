import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import routes from "./routes/index.js";
import path from "path"

const app = express();
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.json());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
    cookie: {
      httpOnly: true,
      secure: false, // true in production with HTTPS
      maxAge: 1000 * 60 * 60 * 24, // 1 day
      sameSite: "strict"
    },
  })
);

app.use("/api", routes);

export default app;

export const errorHandler = (err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    message: "Something went wrong",
    error: process.env.NODE_ENV === "development" ? err.message : undefined
  });
};
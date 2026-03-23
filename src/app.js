import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes/index.js";
import path from "path";

const app = express();

app.set("trust proxy", 1);


app.use(helmet());


app.use(
  cors({
    origin: [
      "http://127.0.0.1:5500",
      "http://localhost:5500"
    ],
    credentials: true
  })
);

app.use(express.json());

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);


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
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);


app.use("/api", routes);

export default app;

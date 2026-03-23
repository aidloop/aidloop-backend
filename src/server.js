import "./config/env.js";
import app from "./app.js";
import mongoose from "mongoose";
import helmet from "helmet";
import cors from "cors";
import { errorHandler } from "./middleware/error.middleware.js";

const PORT = process.env.PORT || 3000;

// Security
app.use(helmet());


app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        "http://127.0.0.1:5500",
        "http://localhost:5500"
      ];

      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true
  })
);

app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log("mongo connected");

  app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error("MongoDB connection error:", err);
});

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

const errorHandler = require("./middlewares/errorHandler");
const notFound = require("./middlewares/notFound");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

function createApp(sessionMiddleware) {
  const app = express();

  app.use(
    helmet({
      crossOriginResourcePolicy: false,
    })
  );
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );
  app.use(morgan(process.env.NODE_ENV === "development" ? "dev" : "combined"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());
  app.use(sessionMiddleware);
  app.use(flash());

  // Expose flash messages on every JSON response via res.locals (available in controllers)
  app.use((req, res, next) => {
    res.locals.flashMessages = {
      success: req.flash("success"),
      error: req.flash("error"),
    };
    next();
  });

  app.get("/api/health", (req, res) => {
    res.status(200).json({ success: true, message: "Server is healthy" });
  });

  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/chat", chatRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = createApp;

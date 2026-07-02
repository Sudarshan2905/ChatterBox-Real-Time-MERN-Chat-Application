require("dotenv").config();
const http = require("http");
const session = require("express-session");
const MongoStore = require("connect-mongo");

const connectDB = require("./config/database");
const createApp = require("./app");
const { initSocket } = require("./socket/socket");

const PORT = process.env.PORT || 5000;

const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    collectionName: "sessions",
  }),
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // set true behind HTTPS in production
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
});

async function start() {
  await connectDB();

  const app = createApp(sessionMiddleware);
  const server = http.createServer(app);

  initSocket(server, sessionMiddleware);

  server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

start();

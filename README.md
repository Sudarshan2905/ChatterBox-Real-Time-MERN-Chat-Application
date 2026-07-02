# ChatterBox — Real-Time MERN Chat App (PWA)

A WhatsApp-inspired, mobile-friendly, installable real-time chat application built with MongoDB, Express, React, and Node (MERN) + Socket.IO.


**LIVE**
**BACKEND** : https://chatterbox-real-time-mern-chat.onrender.com

## Features
- Signup / Login / Logout with session auth (`express-session` + `connect-mongo`, 7-day cookie)
- Passwords hashed with bcryptjs
- Real-time 1:1 messaging via Socket.IO (no refresh)
- Online/offline presence + typing indicator
- User search by username or mobile
- Message history persisted in MongoDB, auto-scroll, `HH:MM AM/PM` timestamps
- Flash messages (connect-flash) surfaced as toasts on the frontend
- Centralized error handling, express-validator input validation
- **Progressive Web App**: `manifest.json`, service worker (`sw.js`) with app-shell caching + network-first API caching, installable on mobile/desktop, works offline for previously loaded data
- Responsive, WhatsApp-style UI, mobile-first layout

## Folder Structure
```
chat-app/
├── backend/
│   ├── config/database.js
│   ├── controllers/ (authController, userController, chatController)
│   ├── models/ (User.js, Message.js)
│   ├── routes/ (authRoutes, userRoutes, chatRoutes)
│   ├── middlewares/ (isLoggedIn, validate, errorHandler, notFound)
│   ├── socket/socket.js
│   ├── utils/ (ApiError.js, ApiResponse.js)
│   ├── app.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
└── frontend/
    ├── public/ (manifest.json, sw.js, icons/)
    ├── src/
    │   ├── components/ (Navbar, Sidebar, ChatWindow, MessageBubble, MessageInput, UserCard, Loader, route guards)
    │   ├── pages/ (Signup, Login, Dashboard, NotFound)
    │   ├── context/ (AuthContext, SocketContext, ToastContext)
    │   ├── hooks/ (useDebounce, useServiceWorker)
    │   ├── services/ (axios instance + API wrappers)
    │   ├── styles/index.css
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── .env.example
```

## Installation

### 1. MongoDB Setup
Run MongoDB locally (`mongod`) or use MongoDB Atlas and grab your connection string.

### 2. Backend Setup
```bash
cd backend
cp .env.example .env   # fill in MONGO_URI, SESSION_SECRET, CLIENT_URL
npm install
npm run dev             # starts on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
cp .env.example .env   # points to backend API/socket URL
npm install
npm run dev             # starts on http://localhost:5173
```

Open `http://localhost:5173`, sign up two users (use two browser windows), and chat in real time.

## Environment Variables

**backend/.env**
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/chat-app
SESSION_SECRET=change_this_to_a_long_random_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

**frontend/.env**
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

## Socket Flow
1. Client logs in → REST call creates an `express-session`, cookie stored (`withCredentials: true`).
2. Client connects to Socket.IO using the same session (shared session middleware) and emits `join` with its `userId`.
3. Server maps `userId → socket.id`, joins a room named after the `userId`, and broadcasts `online_users`.
4. Sending a message emits `private_message` → server persists to MongoDB → emits to both sender's and receiver's rooms → both UIs update instantly, no polling/refresh.
5. `typing` / `stop_typing` events are room-scoped so only the relevant peer sees "Typing...".
6. On disconnect, the user is removed from the online map and presence is rebroadcast.
7. Socket client auto-reconnects (`reconnection: true`) if the connection drops.

## PWA / Offline Behavior
- `manifest.json` defines app name, icons, theme color, and `standalone` display so it can be installed to a phone's home screen.
- `sw.js` precaches the app shell on install, serves static assets cache-first, and serves `/api/*` calls network-first while caching the latest successful response as a fallback (so recent chats are viewable offline).
- Service worker is registered from `useServiceWorker.js` on app load.

## API Endpoints
| Method | Route | Description |
|---|---|---|
| POST | /api/auth/signup | Register |
| POST | /api/auth/login | Login |
| GET | /api/auth/logout | Logout |
| GET | /api/auth/me | Current session user |
| GET | /api/users | List users + online status |
| GET | /api/users/search?q= | Search by username/mobile |
| GET | /api/chat/:userId | Conversation history |
| POST | /api/chat/send | Send message (REST fallback) |

## Socket Events
`connection`, `join`, `disconnect`, `private_message`, `typing`, `stop_typing`, `online_users`

## Screenshots
_Add screenshots of Login, Signup, and Dashboard here after running the app locally._

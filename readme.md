<div align="center">

<br/>

```
██╗   ██╗ ██████╗ ██╗   ██╗████████╗██╗   ██╗██████╗ ███████╗
╚██╗ ██╔╝██╔═══██╗██║   ██║╚══██╔══╝██║   ██║██╔══██╗██╔════╝
 ╚████╔╝ ██║   ██║██║   ██║   ██║   ██║   ██║██████╔╝█████╗  
  ╚██╔╝  ██║   ██║██║   ██║   ██║   ██║   ██║██╔══██╗██╔══╝  
   ██║   ╚██████╔╝╚██████╔╝   ██║   ╚██████╔╝██████╔╝███████╗
   ╚═╝    ╚═════╝  ╚═════╝    ╚═╝    ╚═════╝ ╚═════╝ ╚══════╝
                        B A C K E N D
```

<h3>🎬 A production-grade REST API powering a YouTube-like platform</h3>

[![GitHub stars](https://img.shields.io/github/stars/govindkumar1208/YouTube-Backend?style=social)](https://github.com/govindkumar1208/YouTube-Backend/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/govindkumar1208/YouTube-Backend?style=social)](https://github.com/govindkumar1208/YouTube-Backend/forks)

</div>

---

## 🌟 Overview

**YouTube-Backend** is a robust, scalable RESTful API built with **Node.js**, **Express.js**, and **MongoDB**. It replicates the core backend functionality of a video-sharing platform — from authentication and video uploads to likes, comments, subscriptions, and playlists. Engineered with clean MVC architecture, middleware-driven security, and cloud media management via Cloudinary.

> Built for developers who want to learn how real-world backend systems are architected — from ground up.

---

## ✨ Features

| Category | Features |
|---|---|
| 🔐 **Authentication** | Register, Login, Logout, JWT Access & Refresh Tokens |
| 🎥 **Videos** | Upload, Publish, Edit, Delete, Toggle Visibility |
| 💬 **Comments** | Add, Edit, Delete Comments on Videos |
| ❤️ **Likes** | Like/Unlike Videos, Comments, Tweets |
| 📋 **Playlists** | Create, Update, Delete, Add/Remove Videos |
| 🔔 **Subscriptions** | Subscribe/Unsubscribe Channels, Fetch Subscribers |
| 🐦 **Tweets** | Create, Update, Delete User Tweets |
| 📊 **Dashboard** | Channel Stats — Views, Subscribers, Videos, Likes |
| ☁️ **Media Uploads** | Avatar, Cover Image & Video upload via Cloudinary + Multer |
| 🏥 **Health Check** | Server health monitoring endpoint |

---

## 🏗️ Project Architecture

```
YouTube-Backend/
│
├── 📁 controllers/        # Business logic for all features
│   ├── user.controller.js
│   ├── video.controller.js
│   ├── comment.controller.js
│   ├── like.controller.js
│   ├── playlist.controller.js
│   ├── subscription.controller.js
│   ├── tweet.controller.js
│   └── dashboard.controller.js
│
├── 📁 db/                 # MongoDB connection setup
│   └── index.js
│
├── 📁 middlewares/        # Auth guard & file upload middleware
│   ├── auth.middleware.js
│   └── multer.middleware.js
│
├── 📁 models/             # Mongoose schemas
│   ├── user.model.js
│   ├── video.model.js
│   ├── comment.model.js
│   ├── like.model.js
│   ├── playlist.model.js
│   ├── subscription.model.js
│   └── tweet.model.js
│
├── 📁 routes/             # Express route definitions
│   ├── user.routes.js
│   ├── video.routes.js
│   ├── comment.routes.js
│   ├── like.routes.js
│   ├── playlist.routes.js
│   ├── subscription.routes.js
│   ├── tweet.routes.js
│   └── dashboard.routes.js
│
├── 📁 utils/              # Reusable utilities
│   ├── ApiError.js
│   ├── ApiResponse.js
│   ├── asyncHandler.js
│   └── cloudinary.js
│
├── app.js                 # Express app configuration
├── index.js               # Server entry point
├── constants.js           # Global constants
└── .env.sample            # Environment variables template
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | Node.js |
| **Framework** | Express.js |
| **Database** | MongoDB (via Mongoose ODM) |
| **Authentication** | JWT (Access Token + Refresh Token) |
| **Media Storage** | Cloudinary |
| **File Handling** | Multer |
| **Password Hashing** | bcrypt |
| **Environment** | dotenv |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) `v18+`
- [MongoDB](https://www.mongodb.com/) (local or [Atlas](https://www.mongodb.com/atlas))
- [Cloudinary Account](https://cloudinary.com/) (for media uploads)
- [Git](https://git-scm.com/)

---

### 📦 Installation

**1. Clone the repository**

```bash
git clone https://github.com/govindkumar1208/YouTube-Backend.git
cd YouTube-Backend
```

**2. Install dependencies**

```bash
npm install
```

**3. Configure environment variables**

```bash
cp .env.sample .env
```

Then fill in your `.env` file:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net

CORS_ORIGIN=*

ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**4. Start the server**

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

✅ Server will start at `http://localhost:8000`

---

## 📡 API Endpoints

### 🔐 Auth & Users — `/api/v1/users`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login user | ❌ |
| `POST` | `/logout` | Logout current user | ✅ |
| `POST` | `/refresh-token` | Refresh access token | ❌ |
| `GET` | `/current-user` | Get logged-in user info | ✅ |
| `PATCH` | `/update-account` | Update account details | ✅ |
| `PATCH` | `/avatar` | Update avatar image | ✅ |
| `PATCH` | `/cover-image` | Update cover image | ✅ |
| `PATCH` | `/change-password` | Change password | ✅ |
| `GET` | `/c/:username` | Get channel profile | ✅ |
| `GET` | `/history` | Get watch history | ✅ |

### 🎥 Videos — `/api/v1/videos`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/` | Get all videos | ❌ |
| `POST` | `/` | Upload a new video | ✅ |
| `GET` | `/:videoId` | Get video by ID | ❌ |
| `PATCH` | `/:videoId` | Update video details | ✅ |
| `DELETE` | `/:videoId` | Delete a video | ✅ |
| `PATCH` | `/toggle/publish/:videoId` | Toggle publish status | ✅ |

### 💬 Comments — `/api/v1/comments`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/:videoId` | Get all comments on a video | ❌ |
| `POST` | `/:videoId` | Add a comment | ✅ |
| `PATCH` | `/c/:commentId` | Update a comment | ✅ |
| `DELETE` | `/c/:commentId` | Delete a comment | ✅ |

### ❤️ Likes — `/api/v1/likes`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/toggle/v/:videoId` | Like/Unlike a video | ✅ |
| `POST` | `/toggle/c/:commentId` | Like/Unlike a comment | ✅ |
| `POST` | `/toggle/t/:tweetId` | Like/Unlike a tweet | ✅ |
| `GET` | `/videos` | Get liked videos | ✅ |

### 🔔 Subscriptions — `/api/v1/subscriptions`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/c/:channelId` | Toggle subscription | ✅ |
| `GET` | `/c/:channelId` | Get channel subscribers | ✅ |
| `GET` | `/u/:subscriberId` | Get subscribed channels | ✅ |

### 📋 Playlists — `/api/v1/playlist`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/` | Create a playlist | ✅ |
| `GET` | `/:playlistId` | Get playlist by ID | ✅ |
| `PATCH` | `/:playlistId` | Update playlist | ✅ |
| `DELETE` | `/:playlistId` | Delete playlist | ✅ |
| `POST` | `/add/:videoId/:playlistId` | Add video to playlist | ✅ |
| `DELETE` | `/remove/:videoId/:playlistId` | Remove video from playlist | ✅ |
| `GET` | `/user/:userId` | Get user's playlists | ✅ |

### 🐦 Tweets — `/api/v1/tweets`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/` | Create a tweet | ✅ |
| `GET` | `/user/:userId` | Get user tweets | ✅ |
| `PATCH` | `/:tweetId` | Update a tweet | ✅ |
| `DELETE` | `/:tweetId` | Delete a tweet | ✅ |

### 📊 Dashboard — `/api/v1/dashboard`

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/stats` | Get channel statistics | ✅ |
| `GET` | `/videos` | Get all channel videos | ✅ |

### 🏥 Health Check — `/api/v1/healthcheck`

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | Server health status |

---

## 🔑 Authentication Flow

```
Client                          Server
  │                               │
  │── POST /users/register ──────►│  Hash password, save user
  │◄──── 201 + user data ─────────│
  │                               │
  │── POST /users/login ─────────►│  Validate → generate tokens
  │◄── 200 + accessToken ─────────│  Set refreshToken in cookie
  │      + refreshToken           │
  │                               │
  │── GET /users/current-user ───►│  Verify JWT middleware
  │   Authorization: Bearer <token>│  
  │◄── 200 + user data ───────────│
  │                               │
  │── POST /users/refresh-token ─►│  Validate refresh token
  │◄── 200 + new accessToken ─────│  Issue new token pair
```

---

## 🛡️ Middleware Pipeline

```
Request → CORS → JSON Parser → Cookie Parser
        → Auth Middleware (JWT verify)
        → Multer (file uploads)
        → Controller
        → ApiResponse / ApiError
        → Response
```

---

## 📐 Design Patterns

- **MVC Architecture** — Clean separation of concerns across `models`, `controllers`, and `routes`
- **Async Handler Wrapper** — Centralized error handling via `asyncHandler` utility
- **Standardized API Responses** — Consistent `ApiResponse` and `ApiError` classes
- **Aggregation Pipelines** — MongoDB aggregation for channel stats and watch history
- **Token Rotation** — Access + Refresh token strategy for secure session management

---

## 🤝 Contributing

Contributions are warmly welcome!

```bash
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m "Add amazing feature"

# 4. Push to your branch
git push origin feature/amazing-feature

# 5. Open a Pull Request 🎉
```

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**Made with ❤️ by [Govind Kumar](https://github.com/govindkumar1208)**

⭐ Star this repo if you found it helpful!

</div>

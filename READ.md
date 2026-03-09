# 📸 Personal Portfolio — Albums & Achievements

A full-stack personal portfolio to showcase trip albums, photos, and achievements.

---

## 🚀 Tech Stack

### Frontend

| Technology          | Purpose                     |
| ------------------- | --------------------------- |
| **React 18**        | UI framework                |
| **Vite**            | Build tool & dev server     |
| **Tailwind CSS**    | Styling & responsive design |
| **Framer Motion**   | Animations & transitions    |
| **React Router v6** | Client-side routing         |
| **Axios**           | API requests                |
| **Lucide React**    | Icons                       |
| **React Hot Toast** | Notifications               |

### Backend

| Technology     | Purpose              |
| -------------- | -------------------- |
| **Node.js**    | Runtime environment  |
| **Express.js** | REST API framework   |
| **Mongoose**   | MongoDB ODM          |
| **JWT**        | Admin authentication |
| **Multer**     | File upload handling |
| **Bcryptjs**   | Password hashing     |
| **Nodemon**    | Dev auto-restart     |

### Cloud & Storage

| Service           | Purpose                      | Free Tier  |
| ----------------- | ---------------------------- | ---------- |
| **MongoDB Atlas** | Database                     | 512MB free |
| **Cloudinary**    | Image storage & optimization | 25GB free  |

### Deployment

| Platform       | What's deployed       | Free Tier    |
| -------------- | --------------------- | ------------ |
| **Vercel**     | Frontend (React app)  | Unlimited    |
| **Render.com** | Backend (Node.js API) | 750hrs/month |

---

## ✨ Features

- 📁 **Albums** — Create trip/event albums with cover photos, location & date
- 📸 **Photo Gallery** — Upload multiple photos, masonry layout, lightbox viewer
- 🏆 **Achievements** — Add awards, certifications, projects with icons & links
- 🔗 **Link Albums to Achievements** — Connect your achievement to its photo album
- 👤 **Profile Management** — Name, bio, avatar, social links, resume
- 🔐 **Admin Panel** — Secure login to manage all content
- 📱 **Fully Responsive** — Works on mobile, tablet & desktop
- ⚡ **Fast Loading** — Images auto-optimized via Cloudinary (WebP format)

---

## 📁 Project Structure

```
portfolio/
├── backend/
│   ├── models/          # MongoDB schemas (Album, Photo, Achievement, Profile)
│   ├── routes/          # API endpoints
│   │   ├── auth.js      # POST /api/auth/login
│   │   ├── albums.js    # CRUD /api/albums
│   │   ├── photos.js    # CRUD /api/photos
│   │   ├── achievements.js  # CRUD /api/achievements
│   │   └── profile.js   # GET/PUT /api/profile
│   ├── config/
│   │   └── cloudinary.js  # Image upload config
│   ├── middleware/
│   │   └── auth.js      # JWT protection
│   └── server.js        # Express entry point
│
└── frontend/
    └── src/
        ├── pages/
        │   ├── Home.jsx        # Public portfolio
        │   ├── AlbumDetail.jsx # Single album view
        │   ├── Login.jsx       # Admin login
        │   └── Admin.jsx       # Dashboard
        ├── components/
        │   ├── Navbar.jsx
        │   └── Lightbox.jsx
        ├── hooks/
        │   └── useAuth.jsx     # Auth context
        └── utils/
            └── api.js          # Axios API client
```

---

## ⚙️ Local Setup

### 1. Clone the repo

```bash
git clone https://github.com/yourusername/your-repo-name.git
cd your-repo-name
```

### 2. Backend setup

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (MongoDB, Cloudinary, JWT, Admin credentials)
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5001
npm run dev
```

### 4. Open in browser

```
http://localhost:5173        # Portfolio
http://localhost:5173/login  # Admin panel
```

---

## 🌐 Environment Variables

### Backend `.env`

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your_password
PORT=5001
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5001
```

---

## 📡 API Endpoints

| Method | Endpoint              | Auth | Description          |
| ------ | --------------------- | ---- | -------------------- |
| POST   | /api/auth/login       | —    | Admin login          |
| GET    | /api/profile          | —    | Get profile          |
| PUT    | /api/profile          | ✅   | Update profile       |
| POST   | /api/profile/avatar   | ✅   | Upload avatar        |
| GET    | /api/albums           | —    | Get all albums       |
| POST   | /api/albums           | ✅   | Create album         |
| GET    | /api/albums/:id       | —    | Get album + photos   |
| PUT    | /api/albums/:id       | ✅   | Update album         |
| DELETE | /api/albums/:id       | ✅   | Delete album         |
| GET    | /api/photos           | —    | Get all photos       |
| POST   | /api/photos           | ✅   | Upload photo         |
| DELETE | /api/photos/:id       | ✅   | Delete photo         |
| GET    | /api/achievements     | —    | Get all achievements |
| POST   | /api/achievements     | ✅   | Add achievement      |
| PUT    | /api/achievements/:id | ✅   | Update achievement   |
| DELETE | /api/achievements/:id | ✅   | Delete achievement   |

---

# 📸 Portfolio — Full Setup & Deployment Guide

## Tech Stack (All Free Tier)

| Layer           | Service           | Free Tier    |
| --------------- | ----------------- | ------------ |
| Frontend        | React + Vite      | —            |
| Backend         | Node.js + Express | —            |
| Database        | MongoDB Atlas     | 512MB        |
| Images          | Cloudinary        | 25GB storage |
| Frontend Deploy | Vercel            | Unlimited    |
| Backend Deploy  | Render.com        | 750hrs/month |

---

## STEP 1: Install Locally

```bash
# Backend
cd backend
npm install
cp .env.example .env    # fill in your values

# Frontend
cd ../frontend
npm install
cp .env.example .env    # fill in your values
```

---

## STEP 2: Set Up MongoDB Atlas (Free)

1. Go to **https://mongodb.com/atlas** → Sign up free
2. Create a **Free (M0) cluster** (choose any region)
3. Under **Database Access** → Add user with password
4. Under **Network Access** → Add IP `0.0.0.0/0` (allow all)
5. Click **Connect** → **Connect your application** → Copy URI
6. Paste in `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/portfolio
   ```

---

## STEP 3: Set Up Cloudinary (Free)

1. Go to **https://cloudinary.com** → Sign up free
2. Dashboard shows your **Cloud Name, API Key, API Secret**
3. Paste in `backend/.env`:
   ```
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=123456789012345
   CLOUDINARY_API_SECRET=your_secret_here
   ```

---

## STEP 4: Configure Backend .env

```env
MONGODB_URI=mongodb+srv://...
JWT_SECRET=any-long-random-string-here-make-it-secure
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
ADMIN_EMAIL=your@email.com
ADMIN_PASSWORD=your_secure_password
PORT=5000
FRONTEND_URL=http://localhost:5173
```

---

## STEP 5: Run Locally

```bash
# Terminal 1 — Backend
cd backend
npm run dev     # runs on http://localhost:5001

# Terminal 2 — Frontend
cd frontend
npm run dev     # runs on http://localhost:5173
```

Visit `http://localhost:5173` — your portfolio is live!
Login at `http://localhost:5173/login` to manage content.

---

## STEP 6: Deploy Backend to Render.com (Free)

1. Push your project to **GitHub**
2. Go to **https://render.com** → Sign up with GitHub
3. Click **New → Web Service** → Connect your repo
4. Set:
   - **Root directory**: `backend`
   - **Build command**: `npm install`
   - **Start command**: `npm start`
5. Add all environment variables from `backend/.env`
6. Click **Deploy** → Copy your URL (e.g. `https://portfolio-backend.onrender.com`)

---

## STEP 7: Deploy Frontend to Vercel (Free)

1. Go to **https://vercel.com** → Sign up with GitHub
2. Click **Add New → Project** → Import your repo
3. Set:
   - **Root directory**: `frontend`
   - **Framework**: Vite
4. Add environment variable:
   ```
   VITE_API_URL=https://your-backend.onrender.com
   ```
5. Click **Deploy** → Your portfolio is live! 🎉

---

## STEP 8: Update Backend CORS

After deploying frontend, update `backend/.env` on Render:

```
FRONTEND_URL=https://your-portfolio.vercel.app
```

---

## Admin Panel

- Login at: `https://your-portfolio.vercel.app/login`
- Use the email & password from your `.env`
- **Profile tab**: Update your name, bio, avatar, social links
- **Photos tab**: Upload photos (goes to Cloudinary), set featured, categories
- **Achievements tab**: Add/edit/delete achievements with icons

---

## Project Structure

```
portfolio/
├── backend/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API endpoints
│   │   ├── auth.js      # POST /api/auth/login
│   │   ├── photos.js    # CRUD /api/photos
│   │   ├── achievements.js  # CRUD /api/achievements
│   │   └── profile.js   # GET/PUT /api/profile
│   ├── config/
│   │   └── cloudinary.js  # Image upload config
│   ├── middleware/
│   │   └── auth.js      # JWT protection
│   ├── server.js        # Express entry point
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Home.jsx    # Public portfolio
    │   │   ├── Login.jsx   # Admin login
    │   │   └── Admin.jsx   # Dashboard
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── Lightbox.jsx
    │   ├── hooks/
    │   │   └── useAuth.jsx  # Auth context
    │   └── utils/
    │       └── api.js       # Axios API client
    └── .env.example
```

---

## API Endpoints

| Method | Endpoint              | Auth | Description          |
| ------ | --------------------- | ---- | -------------------- |
| POST   | /api/auth/login       | —    | Admin login          |
| GET    | /api/profile          | —    | Get profile          |
| PUT    | /api/profile          | ✅   | Update profile       |
| POST   | /api/profile/avatar   | ✅   | Upload avatar        |
| GET    | /api/photos           | —    | Get all photos       |
| POST   | /api/photos           | ✅   | Upload photo         |
| PUT    | /api/photos/:id       | ✅   | Update photo         |
| DELETE | /api/photos/:id       | ✅   | Delete photo         |
| GET    | /api/achievements     | —    | Get all achievements |
| POST   | /api/achievements     | ✅   | Add achievement      |
| PUT    | /api/achievements/:id | ✅   | Update achievement   |
| DELETE | /api/achievements/:id | ✅   | Delete achievement   |

---

## Tips

- **Render free tier** spins down after 15min inactivity — first load may take ~30s to wake up
- Use **UptimeRobot** (free) to ping your backend every 14min to keep it awake
- Cloudinary auto-optimizes images to WebP for faster loading
- All photos are stored on Cloudinary — no disk storage needed on server

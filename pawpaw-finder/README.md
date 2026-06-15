<div align="center">

# 🔍 PawPaw Finder

**Real-time Lost & Found Pet Tracker — Track, report, and reunite lost pets in your community.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-pawpaw--finder.vercel.app-4ADE80?style=for-the-badge)](https://pawpaw-finder.vercel.app)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883?style=for-the-badge&logo=vue.js)](https://vuejs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_Auth-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## 📖 About

**PawPaw Finder** is a mobile-first web application that helps communities track and reunite lost pets. Users can report missing pets, share sightings of found animals, browse an interactive radar map, and communicate in real-time via live chat — all powered by Firebase.

---

## ✨ Features

### 🗺️ Pet Radar Map
Interactive map built with **Leaflet** showing pins of all reported lost & found pets near you. Click any pin to view the full report.

### 📋 Lost & Found Reporting
- Submit detailed lost pet reports with photos, description, and live map pin
- Report found animals and notify nearby users
- Track your own submitted reports in the User Dashboard

### 💬 Real-time Live Chat
Firebase Firestore-powered community chat organized by location. Chat with others in your area to coordinate pet searches.

### 👤 User Dashboard
- View all your submitted reports
- Track status updates (Missing / Found / Reunited)
- Edit or delete your reports

### 🛡️ Admin Panel
- Moderate all user reports (approve/reject/deactivate)
- Manage registered users
- Database seeder tools for demo/testing

### 🌙 Neo-Brutalism Dark Theme
Full dark mode with neo-brutalism design system — chunky borders, bold shadows, vibrant accents.

---

## 🧩 Pages & Routes

| Route | Page | Description |
|---|---|---|
| `/` | Splash | Landing / intro screen |
| `/onboarding` | Onboarding | First-time user walkthrough |
| `/auth` | Auth | Login & Register |
| `/dashboard` | Dashboard | User home, report feed |
| `/explore` | Explore | Browse all lost & found posts |
| `/lost` | LostFeed | Filter: lost pets only |
| `/found` | FoundFeed | Filter: found pets only |
| `/pet/:id` | PetDetail | Full detail of a pet report |
| `/report/lost` | ReportLost | Form: report a lost pet |
| `/report/found` | ReportFound | Form: report a found pet |
| `/report/new` | ReportForm | Combined report form |
| `/map` | PetRadarMap | Full-screen radar map |
| `/chat` | LiveChat | Real-time community chat |
| `/profile` | Profile | User profile & settings |
| `/admin` | AdminPanel | Admin: moderate & manage |
| `/admin/dashboard` | AdminDashboard | Admin analytics overview |

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Vue 3 (Composition API) |
| **Build Tool** | Vite 8 |
| **Styling** | Tailwind CSS v4 |
| **State Management** | Pinia |
| **Routing** | Vue Router 5 |
| **Database** | Firebase Firestore |
| **Authentication** | Firebase Auth |
| **Maps** | Leaflet + @vue-leaflet/vue-leaflet |
| **PDF Export** | jsPDF + html2pdf.js |
| **Icons** | Lucide Vue Next |
| **Hosting** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Firebase project (Firestore + Auth enabled)

### Installation

```bash
# 1. Masuk ke folder
cd pawpaw-finder

# 2. Install dependencies
npm install

# 3. Buat file environment
cp .env.example .env
```

### Konfigurasi `.env`

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Run Development Server

```bash
npm run dev
# → http://localhost:5174
```

### Build for Production

```bash
npm run build
# Output: dist/
```

---

## 📁 Project Structure

```
pawpaw-finder/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, icons, fonts
│   ├── components/     # Reusable Vue components
│   │   ├── Navbar.vue
│   │   ├── EmptyState.vue
│   │   ├── NeoButton.vue
│   │   └── SkeletonLoader.vue
│   ├── firebase/       # Firebase config & init
│   ├── router/         # Vue Router routes
│   ├── stores/         # Pinia stores (auth, pets, etc)
│   ├── utils/          # Helper functions & seeder
│   ├── views/          # Page components (20 pages)
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── .env.example
├── vercel.json         # Vercel SPA routing config
├── vite.config.js
└── package.json
```

---

## ☁️ Deployment (Vercel)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy production
vercel --prod
```

Setelah deploy, tambahkan semua `VITE_*` environment variables di **Vercel Dashboard → Settings → Environment Variables**, lalu redeploy.

> ⚠️ **Penting:** Tambahkan domain Vercel (`pawpaw-finder.vercel.app`) ke **Firebase Console → Authentication → Authorized Domains**.

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<div align="center">

**🐾 Part of the [PawPaws](https://github.com/qdamai/Website-For-Pet) ecosystem**

[🏠 PawPaw Adopt →](https://pawpaw-adopt.vercel.app)

</div>

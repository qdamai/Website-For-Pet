<div align="center">

# 🏠 PawPaw Adopt

**Full-featured Pet Adoption Platform — Connect loving homes with pets in need.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-pawpaw--adopt.vercel.app-64B5F6?style=for-the-badge)](https://pawpaw-adopt.vercel.app)
[![Vue 3](https://img.shields.io/badge/Vue-3-42b883?style=for-the-badge&logo=vue.js)](https://vuejs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore_Auth-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38BDF8?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)

</div>

---

## 📖 About

**PawPaw Adopt** is a comprehensive pet adoption platform that bridges the gap between shelters and potential adopters. Shelters can list their animals, manage adoption requests, and schedule interviews — while adopters can browse, compare, take a personality quiz, and formally apply to adopt a pet.

---

## ✨ Features

### 🐾 Adoption Catalog
Browse 100+ adoptable pets with advanced filtering by species (Cat, Dog, Rabbit, Bird, Hamster), age, gender, and health status. Each card shows key traits and vaccination status.

### 🔍 Pet Detail Page
Full detail view of each adoptable pet including:
- Photo gallery (multiple photos)
- Health records & medical history
- Personality traits & compatibility badges
- Vaccination & sterilization status
- Direct "Apply to Adopt" button

### ⚖️ Pet Comparison
Side-by-side comparison of up to **2 pets** across all attributes — helps adopters make informed decisions.

### 🧩 Adoption Personality Quiz
A smart multi-question quiz that analyzes the adopter's lifestyle and recommends the most compatible pet species and traits.

### 📝 Multi-step Adoption Form
Formal adoption application form with:
- Personal information & housing details
- Pet experience questionnaire
- KTP / house photo document upload (via Cloudinary)
- Adoption reason statement

### 📊 Shelter Dashboard
Complete shelter management panel:
- Pet listing management (add/edit/delete adoptable pets)
- Adoption request tracking (7-stage pipeline)
- Interview appointment scheduling & management
- Success story publication
- Analytics & statistics overview

### 📖 Success Stories
Public showcase of completed adoptions — shareable stories from happy adopter families.

### 🛡️ Admin Panel
- User management (adopters & shelters)
- Shelter verification system
- Pet moderation (approve/reject listings)
- Database seeder tools

### 🌐 Bilingual Support
Full Indonesian & English language toggle (i18n via custom lang store).

---

## 🧩 Pages & Routes

| Route | Page | Access | Description |
|---|---|---|---|
| `/` | Auth | Public | Login & Register |
| `/catalog` | AdoptionCatalog | User | Browse all adoptable pets |
| `/pet/:id` | AdoptionPetDetail | User | Full pet detail + apply |
| `/compare` | AdoptionCompare | User | Side-by-side pet comparison |
| `/quiz` | AdoptionQuiz | User | Pet personality matching quiz |
| `/apply/:petId` | AdoptionForm | User | Multi-step adoption application |
| `/stories` | AdoptionStories | Public | Success adoption stories |
| `/dashboard` | AdoptionDashboard | Shelter | Shelter management panel |
| `/upload` | AdoptionUpload | Shelter | Add new pet for adoption |
| `/profile` | Profile | User/Shelter | Profile & settings |
| `/admin` | AdminPanel | Admin | Admin control center |

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
| **Image Storage** | Cloudinary |
| **PDF Export** | jsPDF + html2pdf.js |
| **QR Code** | qrcode.vue |
| **Icons** | Lucide Vue Next |
| **Hosting** | Vercel |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm 9+
- Firebase project (Firestore + Auth enabled)
- Cloudinary account (for photo uploads)

### Installation

```bash
# 1. Masuk ke folder
cd pawpaw-adopt

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

# Cloudinary (untuk upload foto hewan & dokumen)
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Run Development Server

```bash
npm run dev
# → http://localhost:5173
```

### Build for Production

```bash
npm run build
# Output: dist/
```

---

## 📁 Project Structure

```
pawpaw-adopt/
├── public/             # Static assets
├── src/
│   ├── assets/         # Images, icons, fonts
│   ├── components/     # Reusable Vue components
│   │   ├── EmptyState.vue
│   │   ├── NeoButton.vue
│   │   └── SkeletonLoader.vue
│   ├── firebase/       # Firebase config & init
│   ├── router/         # Vue Router routes
│   ├── stores/         # Pinia stores (auth, lang, pets, wishlist)
│   ├── utils/          # Helpers & database seeder
│   ├── views/          # Page components (11 pages)
│   │   ├── AdoptionCatalog.vue
│   │   ├── AdoptionCompare.vue
│   │   ├── AdoptionDashboard.vue
│   │   ├── AdoptionForm.vue
│   │   ├── AdoptionPetDetail.vue
│   │   ├── AdoptionQuiz.vue
│   │   ├── AdoptionStories.vue
│   │   ├── AdoptionUpload.vue
│   │   ├── AdminPanel.vue
│   │   ├── Auth.vue
│   │   └── Profile.vue
│   ├── App.vue
│   ├── main.js
│   └── style.css
├── .env.example
├── vercel.json         # Vercel SPA routing config
├── vite.config.js
└── package.json
```

---

## 🗄️ Firestore Collections

| Collection | Description |
|---|---|
| `adopt_users` | Registered users (adopter, shelter, admin roles) |
| `adopt_pets` | Adoptable pet listings |
| `adopt_shelters` | Shelter profiles & verification status |
| `adoption_requests` | Adoption applications (7-stage pipeline) |
| `appointments` | Interview scheduling |
| `success_stories` | Published adoption success stories |
| `notifications` | System notifications per user |

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

> ⚠️ **Penting:** Tambahkan domain Vercel (`pawpaw-adopt.vercel.app`) ke **Firebase Console → Authentication → Authorized Domains**.

---

## 📄 License

MIT License — feel free to use, modify, and distribute.

---

<div align="center">

**🐾 Part of the [PawPaws](https://github.com/qdamai/Website-For-Pet) ecosystem**

[🔍 PawPaw Finder →](https://pawpaw-finder.vercel.app)

</div>

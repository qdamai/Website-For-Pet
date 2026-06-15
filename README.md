<div align="center">

# 🐾 PawPaws — Website For Pet

**A modern monorepo housing two full-featured pet web applications built with Vue 3, Vite, Firebase & Tailwind CSS.**

[![Live: PawPaw Finder](https://img.shields.io/badge/🔍_PawPaw_Finder-Live-4ADE80?style=for-the-badge)](https://pawpaw-finder.vercel.app)
[![Live: PawPaw Adopt](https://img.shields.io/badge/🏠_PawPaw_Adopt-Live-64B5F6?style=for-the-badge)](https://pawpaw-adopt.vercel.app)
[![Made with Vue 3](https://img.shields.io/badge/Vue-3-42b883?style=for-the-badge&logo=vue.js)](https://vuejs.org)
[![Firebase](https://img.shields.io/badge/Firebase-Firestore-FFCA28?style=for-the-badge&logo=firebase)](https://firebase.google.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## 📦 Repository Structure

This repository is a **monorepo** containing two independent web applications for the PawPaws pet ecosystem:

```
pawpaws/
├── 🔍 pawpaw-finder/     → Lost & Found Pet Tracker
└── 🏠 pawpaw-adopt/      → Pet Adoption Platform
```

---

## 🔍 PawPaw Finder

> **Track, report, and reunite lost & found pets in your community.**

**🌐 Live:** https://pawpaw-finder.vercel.app

A real-time community web application that helps pet owners report missing pets and share sightings of found animals. Features an interactive radar map, real-time live chat, and a complete admin panel.

| Feature | Description |
|---|---|
| 🗺️ Pet Radar Map | Interactive Leaflet map showing all lost & found pet locations |
| 💬 Live Chat | Real-time Firebase-powered community chat per location |
| 📋 Report System | Submit lost/found reports with photos and location pins |
| 👤 User Dashboard | Track your personal reports and their status |
| 🛡️ Admin Panel | Moderate reports, manage users, seed database |
| 🌙 Dark Mode | Full neo-brutalism dark theme |

**Tech Stack:** `Vue 3` `Vite` `Tailwind CSS v4` `Firebase Firestore` `Firebase Auth` `Leaflet` `Pinia` `Vue Router`

📖 [Read full documentation →](./pawpaw-finder/README.md)

---

## 🏠 PawPaw Adopt

> **Connect loving homes with pets in need of adoption.**

**🌐 Live:** https://pawpaw-adopt.vercel.app

A full-featured pet adoption platform where shelters can list animals for adoption and adopters can browse, compare, quiz-match, and formally apply to adopt. Built with a complete shelter dashboard and admin verification system.

| Feature | Description |
|---|---|
| 🐾 Adoption Catalog | Browse & filter 100+ adoptable pets by species, age, gender |
| ⚖️ Pet Compare | Side-by-side comparison of up to 2 pets |
| 🧩 Adoption Quiz | Smart quiz to match adopters with the right pet |
| 📝 Adoption Form | Multi-step formal adoption application with document upload |
| 📊 Shelter Dashboard | Full pet management, request tracking, appointment scheduling |
| 📖 Success Stories | Showcase of completed adoptions |
| 🛡️ Admin Panel | User management, shelter verification, database seeder |

**Tech Stack:** `Vue 3` `Vite` `Tailwind CSS v4` `Firebase Firestore` `Firebase Auth` `Cloudinary` `Pinia` `Vue Router`

📖 [Read full documentation →](./pawpaw-adopt/README.md)

---

## 🚀 Getting Started

Each app runs independently. Clone the repo then set up the desired project:

```bash
# Clone repository
git clone https://github.com/qdamai/Website-For-Pet.git
cd Website-For-Pet

# Setup PawPaw Finder
cd pawpaw-finder
npm install
cp .env.example .env   # isi dengan Firebase config kamu
npm run dev            # → http://localhost:5174

# Setup PawPaw Adopt
cd ../pawpaw-adopt
npm install
cp .env.example .env   # isi dengan Firebase config kamu
npm run dev            # → http://localhost:5173
```

---

## 🔧 Environment Variables

Kedua aplikasi memerlukan konfigurasi Firebase. Buat file `.env` di masing-masing folder:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Khusus pawpaw-adopt
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

---

## 🏗️ Tech Stack Overview

| | PawPaw Finder | PawPaw Adopt |
|---|---|---|
| **Framework** | Vue 3 | Vue 3 |
| **Build Tool** | Vite 8 | Vite 8 |
| **Styling** | Tailwind CSS v4 | Tailwind CSS v4 |
| **State** | Pinia | Pinia |
| **Routing** | Vue Router 5 | Vue Router 5 |
| **Database** | Firebase Firestore | Firebase Firestore |
| **Auth** | Firebase Auth | Firebase Auth |
| **Maps** | Leaflet + Vue-Leaflet | — |
| **Storage** | — | Cloudinary |
| **Hosting** | Vercel | Vercel |

---

## 👩‍💻 Team

Built with ❤️ by the PawPaws team — Damai Puti Afifah & contributors.

## 📄 License

This project is licensed under the [MIT License](LICENSE).

# 🐾 PawPaw Finder

**PawPaw Finder** adalah aplikasi web modern *real-time* yang didedikasikan untuk membantu komunitas menemukan dan mempertemukan kembali hewan peliharaan yang hilang. Dibangun dengan antarmuka yang responsif, imut, dan memukau, platform ini memudahkan Anda untuk melaporkan hewan peliharaan yang hilang, menemukan hewan peliharaan terlantar, dan berkoordinasi melalui peta interaktif serta fitur *live chat*.

## ✨ Fitur Utama

- **🗺️ Interactive Pet Radar Map**: Peta *real-time* (didukung oleh Leaflet) untuk melacak dan mencari lokasi hewan peliharaan secara visual di area Anda.
- **💬 Real-time Live Chat**: Fitur percakapan langsung berbasis Firebase yang memungkinkan komunikasi instan antara pemilik hewan dan penemu.
- **🌙 Complete Dark Theme**: Desain antarmuka yang indah, *fully responsive*, dan nyaman di mata dengan dukungan *dark mode* bawaan (menggunakan Tailwind CSS v4).
- **📋 Comprehensive Reporting**: Buat laporan detail dengan mudah, termasuk unggahan foto dan penandaan lokasi (*geolocation*) yang presisi.
- **📊 Dashboard Interaktif**: Hub pusat untuk mengelola laporan, melacak status, dan mengekspor data (mendukung format PDF & Excel) baik untuk Pengguna maupun Admin.
- **📱 QR Code Generation**: Buat QR Code untuk profil hewan peliharaan secara instan agar mudah dibagikan ke media sosial atau dicetak pada poster.

## 🛠️ Tech Stack

### Core
- **[Vue 3](https://vuejs.org/)** (Composition API / `<script setup>`)
- **[Vite](https://vitejs.dev/)** (Next Generation Frontend Tooling)
- **[Tailwind CSS v4](https://tailwindcss.com/)** (Utility-first CSS framework)

### State Management & Routing
- **[Pinia](https://pinia.vuejs.org/)** (Intuitive, type safe state management)
- **[Vue Router](https://router.vuejs.org/)**

### Backend Services
- **[Firebase](https://firebase.google.com/)** (Authentication, Firestore Database, Cloud Storage)

### Libraries & Integrations
- **Maps**: `leaflet` & `@vue-leaflet/vue-leaflet`
- **Icons**: `lucide-vue-next`
- **Data Export**: `jspdf`, `html2pdf.js`, `xlsx`
- **QR Codes**: `qrcode.vue`

## 🚀 Cara Menjalankan Project

### Prasyarat

Pastikan Anda telah menginstal [Node.js](https://nodejs.org/) (disarankan v18 ke atas) di komputer Anda.

### Instalasi

1. **Clone repositori ini** (jika belum):
   ```bash
   git clone https://github.com/qdamai/Website-For-Pet.git
   cd Website-For-Pet/pawpaw-finder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Atur Variabel Lingkungan (Environment Variables) Firebase**:
   Buat file bernama `.env` di dalam folder `pawpaw-finder` dan tambahkan konfigurasi Firebase Anda (ganti nilainya dengan kredensial project Firebase Anda yang asli):
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Jalankan server development**:
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan dan bisa diakses melalui `http://localhost:5173`.

## 📦 Build untuk Production

Untuk melakukan *build* aplikasi agar siap di-*deploy*, jalankan perintah:
```bash
npm run build
```
Anda kemudian bisa melihat hasil *build* secara lokal dengan perintah:
```bash
npm run preview
```

## 🤝 Berkontribusi

Kontribusi, laporan *bug*, dan permintaan fitur sangat kami hargai! Jangan ragu untuk mengunjungi [halaman issues](https://github.com/qdamai/Website-For-Pet/issues) kami.

## 📄 Lisensi

Project ini dilisensikan di bawah lisensi MIT.

# 🐾 PawPaw Finder

PawPaw Finder is a modern, real-time web application dedicated to helping communities reunite with their lost pets. Built with a responsive and stunning UI, it provides an intuitive platform for reporting lost pets, finding found pets, and coordinating rescues through interactive maps and live chat.

## ✨ Key Features

- **🗺️ Interactive Pet Radar Map**: Real-time map integration (powered by Leaflet) to visually track and locate reported lost and found pets in your area.
- **💬 Real-time Live Chat**: A multi-tier chat setup powered by Firebase, allowing instant communication between pet owners and finders.
- **🌙 Complete Dark Theme**: A beautifully crafted, fully responsive design with native dark mode support (built with Tailwind CSS).
- **📋 Comprehensive Reporting**: Easily submit detailed reports for lost or found pets, including image uploads and precise location tagging.
- **📊 User & Admin Dashboards**: Centralized hubs to manage reports, track statuses, and export data (PDF/Excel support).
- **📱 QR Code Generation**: Instantly generate QR codes for pet profiles to easily share them across social media or print them on flyers.

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

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+ recommended) installed on your machine.

### Installation

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/qdamai/Website-Pet-Finder.git
   cd Website-Pet-Finder/pawpaw-finder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up Firebase Environment Variables**:
   Create a `.env` file in the root directory and add your Firebase configuration (replace with your actual Firebase project credentials):
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`.

## 📦 Build for Production

To build the application for production, run:
```bash
npm run build
```
You can then preview the production build locally:
```bash
npm run preview
```

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/qdamai/Website-Pet-Finder/issues).

## 📄 License

This project is licensed under the MIT License.

# 

```
# 🎨 Next-Level Art Selling Platform

An advanced, premium, and lightning-fast Full-Stack e-commerce web application built for artists to showcase and sell their premium physical and digital artworks seamlessly. Built using **Next.js 14+ (App Router)** and optimized for immediate global deployment on **Vercel**.

## 🚀 Architectural Overview

This platform leverages a **Serverless Modern Monolith Architecture** using Next.js. By utilizing Next.js Serverless Route Handlers and Server Actions, it eliminates the need for a separate heavy backend container (like Spring Boot or Express), ensuring maximum cost-efficiency, scalability, and ultra-low latency.

               ┌─────────────────────────────────────────┐
               │         Next.js Frontend (UI)           │
               │   (React, Tailwind CSS, Shadcn UI)      │
               └────────────────────┬────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         │ (Direct Client Upload)   │ (Secure API Calls)       │ (Server Actions)
         ▼                          ▼                          ▼
┌─────────────────┐       ┌───────────────────┐      ┌────────────────────┐
│   ImgBB API     │       │ Next.js Backend   │      │ Firebase Firestore │
│ (Image Hosting) │       │ (Route Handlers)  │      │ (NoSQL Cloud DB)   │
└────────┬────────┘       └─────────┬─────────┘      └────────────────────┘
         │                          │
         │ (Returns Image URL)      ├──────────────────────────┐
         └─────────────────────────►│                          │
                                    ▼                          ▼
                        ┌───────────────────────┐  ┌───────────────────────┐
                        │   Google Sheets API   │  │      Resend API       │
                        │ (Order Spreadsheet)   │  │ (Email Notifications) │
                        └───────────────────────┘  └───────────────────────┘
```

## ✨ Key Features

### 🛒 Client & Buyer Features

- **Premium Minimal UI/UX:** High-tech minimal aesthetic built with a dark/charcoal-black theme, custom micro-interactions, and premium layouts.
- **Dynamic Art Gallery:** Fully responsive showcase of available artworks with instant filtering, sorting, and tag-based discovery.
- **Intuitive Checkout Process:** A sleek, streamlined order form collecting necessary customer data, shipping details, and order specifications.

### 💼 Artist / Admin Dashboard

- **Streamlined Artwork Manager:** Fast and direct web forms to create, read, update, and delete (CRUD) artwork listings.
- **Automated Image Optimization:** Single-click image uploads handled via external API, preventing server-bloat.
- **Live Order Tracking:** Complete backend sync directly to Google Sheets for non-technical clients to track deliveries easily without entering an administrative portal.

### ⚙️ Automation & Backend Services

- **Google Sheets Sync:** Instantly appends incoming checkout invoices into a secure Google Sheet row for fulfillment processing.
- **Instant Resend Notifications:** Dispatches transactional HTML emails automatically to both the Admin (New Order Alert) and Buyer (Order Confirmation invoice) without forcing Google OAuth connection bottlenecks on the user.

## 🛠️ Tech Stack

- **Frontend & Core:** Next.js (React 18+, App Router, Server Actions)
- **Styling:** Tailwind CSS & Lucide React Icons
- **Database:** Firebase Cloud Firestore (Real-time Document-based NoSQL)
- **Image Storage:** ImgBB API (High-speed Cloud Image Hosting)
- **Email Engine:** Resend API (Modern Transactional Developer Email Infrastructure)
- **Order Sync Manager:** Google Sheets API v4 (via `googleapis`)
- **Deployment & Hosting:** Vercel (Serverless Continuous Integration & Edge Network)

## 📂 Project Directory Structure

Plaintext

# 

```
src/
├── app/                    # Next.js App Router (Pages, Layouts & APIs)
│   ├── layout.js           # Global Document Wrapper (Navbar, Footers, Contexts)
│   ├── page.js             # Platform Landing Page (Hero showcase)
│   ├── shop/               # Dynamic Interactive Browse Catalog
│   │   └── page.js
│   ├── artwork/[id]/       # Highly Descriptive Single Artwork Detailed Page
│   │   └── page.js
│   ├── dashboard/          # Admin Control Center (Upload forms & Settings)
│   │   └── page.js
│   └── api/                # Secure Backend Route Endpoints
│       └── checkout/       # Handlers for processing orders & syncing Google Sheets
│           └── route.js
├── components/             # Atomic Reusable Presentation Components
│   ├── ui/                 # Reusable Base Form/Display Items
│   ├── Navbar.jsx          # Header Navigation Links
│   ├── ArtCard.jsx         # Component to showcase individual paintings
│   └── ImageUploader.jsx   # Dedicated Client Drag & Drop ImgBB Connector
├── lib/                    # Configuration Instances & Core Module Wrappers
│   ├── firebase.js         # Firebase App Client Initialization File
│   └── utils.js            # Design/Class merger utility helpers
└── .env.local              # Local Cryptographic Security Keys (Ignored by Git)
```

## 🔑 Environment Variables Setup

Create a `.env.local` file in your root folder and add the following keys. Ensure these are also added to your Vercel Project Settings during deployment:

Code snippet

# 

```
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# ImgBB API Key
NEXT_PUBLIC_IMGBB_API_KEY=your_imgbb_key_here

# Resend Email API Key
RESEND_API_KEY=your_resend_key_here

# Google Sheets API Credentials
GOOGLE_CLIENT_EMAIL=your_google_service_account_email_here
GOOGLE_PRIVATE_KEY="your_google_private_key_here"
GOOGLE_SHEET_ID=your_google_sheet_id_here
```

## 🚀 Local Development Installation

Follow these steps to spin up the codebase locally on your device:

1. **Clone the repository:**

Bash

# 

```
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
```

1. **Install all required production dependencies:**

Bash

# 

```
   npm install
```

1. **Fire up the local development live server:**

Bash

# 

```
   npm run dev
```

Open http://localhost:3000 inside your web browser to view the application.

## 📦 Deployment to Vercel

1. Push your active codebase to **GitHub**.
2. Log into the Vercel Dashboard and click **"Add New Project"**.
3. Import your repository, select **Next.js** as the preset.
4. Expand **Environment Variables** and paste all values from your local `.env.local` file.
5. Hit **"Deploy"**. Enjoy global serverless hosting instantly!

`---

මේ README එකෙන් ඔයාගේ ප්‍රොජෙක්ට් එකේ සම්පූර්ණ Architecture එක පැහැදිලිව පේනවා. ඔයාට මේක GitHub එකට දැම්මම ඕනෑම කෙනෙකුට (Girlfriend වුණත්!) තේරෙනවා ඔයා කරන්නේ නිකන්ම සයිට් එකක් නෙමෙයි, සුපිරි Standard, Next-Level Architecture එකක් තියෙන වැඩක් කියලා. 😉

දැන් අපි ඊළඟට මොකද කරන්නේ? **ImgBB Image Uploader** එක හදාගමුද? නැත්නම් **Firebase setup** එක කරමුද?`

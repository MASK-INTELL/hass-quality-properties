<div align="center">

# 🏠 Hass Properties
### The Ultimate Real Estate Management Template for Premium Properties.

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](https://unlicense.org/)
[![GitHub Issues](https://img.shields.io/github/issues/maskintell/hassqualityproperties?style=flat-square&color=orange)](https://github.com/maskintell/hassqualityproperties/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/maskintell/hassqualityproperties?style=flat-square&color=green)](https://github.com/maskintell/hassqualityproperties/pulls)
[![Last Commit](https://img.shields.io/github/last-commit/maskintell/hassqualityproperties?style=flat-square)](https://github.com/maskintell/hassqualityproperties/commits/main)
[![Top Language](https://img.shields.io/github/languages/top/maskintell/hassqualityproperties?style=flat-square&color=blueviolet)](https://github.com/maskintell/hassqualityproperties)

[**View Live Demo »**](https://hassproperties.online) | [**Report Bug »**](https://github.com/maskintell/hassqualityproperties/issues)

</div>

---

## 📖 Table of Contents
1. [About The Project](#-about-the-project)
    - [Built With](#-built-with)
2. [Key Features](#-key-features)
3. [Architecture & Project Structure](#-architecture--project-structure)
4. [Getting Started](#-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
5. [Usage Guide](#-usage-guide)
6. [Roadmap](#-roadmap)
7. [Contributing](#-contributing)
8. [License](#-license)
9. [Contact](#-contact)
10. [Acknowledgments](#-acknowledgments)

---

## 🧐 About The Project

**Hass Properties** is a high-performance, enterprise-grade real estate management ecosystem.
Developed by **MASK INTELLIGENCE**, this platform bridges the gap between premium property owners and discerning buyers/renters through a sophisticated digital interface.

### The Problem
The Ugandan (and broader East African) real estate market has traditionally relied on fragmented brokerage systems and informal listings, leading to transparency issues, outdated data, and poor user experiences for high-end clients.

### Our Solution
We have architected a centralized "Source of Truth" for premium listings. By leveraging a modern tech stack (Next.js, TypeScript, and PostgreSQL), we ensure:
- **Data Integrity**: Type-safe operations across the entire stack.
- **Performance**: Optimized rendering and lightning-fast search queries.
- **Scalability**: A modular architecture ready to handle thousands of concurrent listings and inquiries.

### 🛠 Built With

*   ![Next.js](https://img.shields.io/badge/next.js-%23000000.svg?style=for-the-badge&logo=next.js&logoColor=white) - React Framework
*   ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) - Frontend UI Library
*   ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) - Type Safety & Developer Experience
*   ![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) - Relational Database
*   ![Neon](https://img.shields.io/badge/neon-%234169E1.svg?style=for-the-badge&logo=neon&logoColor=white) - Serverless PostgreSQL
*   ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) - Styling & Responsive Design
*   ![Supabase](https://img.shields.io/badge/supabase-%233FCF8E.svg?style=for-the-badge&logo=supabase&logoColor=white) - Authentication
*   ![Cloudflare R2](https://img.shields.io/badge/cloudflare%20r2-%23F38020.svg?style=for-the-badge&logo=cloudflare&logoColor=white) - Object Storage
*   ![Zod](https://img.shields.io/badge/zod-%233067B1.svg?style=for-the-badge&logo=zod&logoColor=white) - Schema Validation

---

## ✨ Key Features

### 🏢 Property Listing Management
Dynamic CRUD operations for properties. Admins can upload high-resolution images, set pricing tiers, and define specific property attributes (e.g., acreage, number of bedrooms, property type).

### 🔍 Advanced Search & Filtering
A multi-faceted search engine allowing users to filter by:
- **Location**: Specific districts and suburbs within Uganda.
- **Price Range**: Flexible currency handling.
- **Property Type**: Land, Homes, Rentals, Vehicles.
- **Status**: For Sale, For Rent, Sold.

### 📊 Admin Dashboard & Analytics
A comprehensive command center for stakeholders.
- **Inquiry Tracking**: Monitor lead conversion rates.
- **Inventory Overview**: Manage all property listings.
- **Testimonials**: Approve/reject client reviews.
- **Site Statistics**: Manage displayed metrics (experience, properties sold, clients, etc.).
- **Media Manager**: Upload and manage images/videos.

### 🔐 User Authentication & Security
- Supabase Auth with email/password authentication.
- Admin access restricted by email whitelist (`ADMIN_EMAILS`).
- CSRF protection on all public API routes.
- Rate limiting on inquiry submission and file upload.
- Security headers (CSP, HSTS, X-Frame-Options) set via middleware.
- File upload validation with magic byte detection.

### 📱 Responsive Web UI
A "Mobile-First" design philosophy ensuring that the platform looks stunning on everything from high-end desktop monitors to entry-level smartphones used by field agents.

### 🌐 SEO & PWA
- Dynamic XML sitemap generation.
- OpenGraph and Twitter Card meta tags.
- JSON-LD structured data (RealEstateListing, Product schemas).
- Bing IndexNow instant search notification.
- Progressive Web App with service worker for offline support.

---

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js**: v18.x or higher
- **npm**: v8.x or higher
- **Git**

### Installation

1.  **Clone or fork the repository**
    ```bash
    git clone https://github.com/maskintell/hassqualityproperties.git
    cd hass-properties
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Set Up Environment Variables**
    Copy `.env.example` to `.env` and fill in your credentials:
    ```bash
    cp .env.example .env
    ```
    Required variables:
    - `DATABASE_URL` — Your Neon (PostgreSQL) connection string
    - `NEXT_PUBLIC_SUPABASE_URL` — Your Supabase project URL
    - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Your Supabase anonymous key
    - `SUPABASE_SERVICE_ROLE_KEY` — Your Supabase service role key
    - `ADMIN_EMAILS` — Comma-separated admin email addresses
    - `R2_*` — Cloudflare R2 storage credentials (account ID, access key, secret, bucket name, public URL)

4.  **Set Up the Database**
    Run the schema file in your Neon database's SQL editor or via `psql`:
    ```bash
    psql $DATABASE_URL -f src/db/schema.sql
    ```

5.  **Start Development Server**
    ```bash
    npm run dev
    ```
    The app will be available at `http://localhost:3000`.

6.  **Create an Admin User**
    In your Supabase dashboard, go to **Authentication > Users** and create a user using the email you added to `ADMIN_EMAILS`. The admin dashboard is available at `http://localhost:3000/admin`.

---

## 💡 Usage Guide

### Fetching Properties (API Example)
To fetch the latest premium listings from the backend:

```typescript
const fetchProperties = async (filter: string) => {
  try {
    const response = await fetch(`/api/properties?category=${filter}`);
    return await response.json();
  } catch (error) {
    console.error("Failed to fetch properties:", error);
  }
};
```

### Creating a New Listing (Admin)
The platform uses a multi-step form for property creation to ensure data completeness:
1. **Basic Info**: Title, Description, Price, Location.
2. **Media**: Image uploads via Cloudflare R2.
3. **Details**: Property attributes (bedrooms, acreage, etc.).
4. **Publish**: Toggle visibility on the public marketplace.

---

## 🗺 Roadmap

- [x] **Phase 1**: Core MVP - Listing, Search, Admin Dashboard. (Completed)
- [ ] **Phase 2**: Advanced Analytics Dashboard for Admins.
- [ ] **Phase 3**: Payment Gateway Integration.
- [ ] **Phase 4**: AI-powered Property Valuation Tool.
- [ ] **Phase 5**: Mobile App (React Native) for iOS and Android.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

## 📜 License

Distributed under the **Unlicense**. See `LICENSE` for more information.

---

# **FOR HELP IN MODIFYING THE SITE**
## 📞 Contact

[**MASK INTELLIGENCE**](https://mask-intelligence.web.app) / Lead Development Team

*   **Email**: maskintell1@gmail.com
*   **Tel**: +256 791715573
*   **Project Link**: [https://github.com/maskintell/hassqualityproperties](https://github.com/maskintell/hassqualityproperties)

---

## 💖 Acknowledgments

*   [Next.js](https://nextjs.org/) - React framework for production.
*   [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework.
*   [Neon](https://neon.tech/) - Serverless PostgreSQL.
*   [Supabase](https://supabase.com/) - Authentication and backend.
*   [Cloudflare R2](https://www.cloudflare.com/developer-platform/r2/) - Object storage.
*   [Zod](https://zod.dev/) - TypeScript-first schema validation.
*   [Motion](https://motion.dev/) - Animation library.
*   [Lucide React](https://lucide.dev/) - Beautiful iconography.
*   [Resend](https://resend.com/) - Email API.

---

<div align="center">
    <i>Built with ❤️ in Uganda by MASK INTELLIGENCE.</i>
</div>

<div align="center">

# 🏠 Hass Properties
### The Ultimate Real Estate Management Template for Premium Properties.

[![License: Unlicense](https://img.shields.io/badge/license-Unlicense-blue.svg)](https://unlicense.org/)
[![GitHub Issues](https://img.shields.io/github/issues/maskintell/hassqualityproperties?style=flat-square&color=orange)](https://github.com/maskintell/hassqualityproperties/issues)
[![GitHub Pull Requests](https://img.shields.io/github/issues-pr/maskintell/hassqualityproperties?style=flat-square&color=green)](https://github.com/maskintell/hassqualityproperties/pulls)
[![Last Commit](https://img.shields.io/github/last-commit/maskintell/hassqualityproperties?style=flat-square)](https://github.com/maskintell/hassqualityproperties/commits/main)
[![Top Language](https://img.shields.io/github/languages/top/maskintell/hassqualityproperties?style=flat-square&color=blueviolet)](https://github.com/maskintell/hassqualityproperties)

[**View Live Demo »**](https://hassproperties.com) | [**Report Bug »**](https://github.com/maskintell/hassqualityproperties/issues)

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

**HASS Quality Properties** is a high-performance, enterprise-grade real estate management ecosystem. 
Developed by **MASK INTELLIGENCE**, this platform bridges the gap between premium property owners and discerning buyers/renters through a sophisticated digital interface.

### The Problem
Real estate market has traditionally relied on fragmented brokerage systems and informal listings, leading to transparency issues, outdated data, and poor user experiences for high-end clients.

### Our Solution
We have architected a centralized "Source of Truth" for premium listings. By leveraging a modern tech stack (React, TypeScript, and PostgreSQL), we ensure:
- **Data Integrity**: Type-safe operations across the entire stack.
- **Performance**: Optimized rendering and lightning-fast search queries.
- **Scalability**: A modular architecture ready to handle thousands of concurrent listings and inquiries.

### 🛠 Built With

*   ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) - Frontend UI Library
*   ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) - Type Safety & Developer Experience
*   ![PostgreSQL](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) - Relational Database
*   ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) - Styling & Responsive Design
*   ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white) - Modern ORM (Recommended for the stack)

---

## ✨ Key Features

### 🏢 Property Listing Management
Dynamic CRUD operations for properties. Admins can upload high-resolution images, set pricing tiers, and define specific property attributes (e.g., acreage, number of bedrooms, proximity to Kampala CBD).

### 🔍 Advanced Search & Filtering
A multi-faceted search engine allowing users to filter by:
- **Location**: Specific districts and suburbs within Uganda.
- **Price Range**: Flexible currency handling.
- **Property Type**: Commercial, Residential, or Land.
- **Status**: Available, Under Contract, or Sold.

### 📊 Admin Dashboard & Analytics
A comprehensive command center for stakeholders.
- **Inquiry Tracking**: Monitor lead conversion rates.
- **Inventory Overview**: Visual representation of property distribution.
- **User Activity**: Heatmaps of which properties are gaining the most traction.

### 🔐 User Authentication, Security & Configuration.
Implemented using battle tested supabase auth, Go to *Supabase.com*, **Create an account** - **Create a project** in that account with your preferred name, After creating the project, copy these **"your supabase project url"** & **"your supabase publishable key"** they are available in supabase dashboard in the project you created, After that update **src/lib/supabase.ts**
VITE_SUPABASE_URL="your_supabase_project_url"
VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"

Inside your project in supabase, Click Menu located at top right - then Go to **Authentication**, Click Add user and create a user using your **email address** + a **password** you will remember, Cause you will need them to access the **Admin Dashboard**...

### The Admin is Available at https://your-domain.com/#/admin
You Just Need To Add **/#/admin** at the end of your site domain, whether you deployed the site with **GitHub pages**, **Vercel** or anywhere, Just add that at the end of the url you're provided.

### For database tables: Copy and Paste (DATABASE SCHEMA)
    In your supabase Project, Click the Menu icon at top right then Go to SQL Editor, paste what you copied in DATABASE SCHEMA file and Click run to create the needed schemas...
 

### 📱 Responsive Web UI
A "Mobile-First" design philosophy ensuring that the platform looks stunning on everything from high-end desktop monitors to entry-level smartphones used by field agents.

---

## 🚀 Getting Started

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js**: v18.x or higher
- **npm** or **pnpm**: v8.x or higher
- **PostgreSQL**: v14.x or higher (or Docker)
- **Git**

### Installation

1.  **Clone or simply Fork the repository**
    ```bash
    git clone https://github.com/maskintell/hassqualityproperties.git
    cd hassqualityproperties
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    # or if using pnpm
    pnpm install
    ```

3.  **Database Setup**
    Copy and Paste (DATABASE SCHEMA)
    in your supabase SQL Editor and run in to create the needed schemas...
 
 5.  **Start Development Server**
    ```bash
    npm run dev
    ```

---

## 💡 Usage Guide

### Fetching Properties (API Example)
To fetch the latest premium listings from the backend:

```typescript
import axios from 'axios';

const fetchProperties = async (filter: string) => {
  try {
    const response = await axios.get(`/api/properties?category=${filter}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch properties:", error);
  }
};
```

### Creating a New Listing (Admin)
The platform uses a multi-step form for property creation to ensure data completeness:
1. **Basic Info**: Title, Description, Price.
2. **Media**: Image uploads via Cloudinary.
3. **Location**: Integration with Google Maps API for precise coordinates.
4. **Publish**: Toggle visibility on the public marketplace.

---

## 🗺 Roadmap

- [ ]  **Phase 1**: Core MVP - Listing and Search functionality. (Completed)
- [ ]  **Phase 2**: Advanced Analytics Dashboard for Admins.
- [ ]  **Phase 3**: Integration in Payment Gateway's.
- [ ]  **Phase 4**: AI-powered Property Valuation Tool.
- [ ]  **Phase 5**: Mobile App (React Native) for iOS and Android.

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

*   [Lucide React](https://lucide.dev/) - For the beautiful iconography.
*   [React Query](https://tanstack.com/query/latest) - For powerful data fetching.
*   [Shadcn/UI](https://ui.shadcn.com/) - For the accessible UI components.
*   [Prisma](https://www.prisma.io/) - For making database management effortless.

---
<div align="center">
    <i>Built with ❤️ in Uganda by MASK INTELLIGENCE.</i>
</div>

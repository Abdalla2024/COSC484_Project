# TU Marketplace

TU Marketplace is a digital marketplace platform designed specifically for college students to buy and sell textbooks, electronics, furniture, clothing, and other essentials within their campus community.

## Features

- **User Authentication**: Secure login and registration using Firebase authentication
- **Product Listings**: Create, view, edit, and delete product listings with multiple images
- **Categories**: Browse items by categories like Textbooks, Electronics, Furniture, etc.
- **Search & Filter**: Find items based on keywords, price range, and condition
- **Messaging**: Direct communication between buyers and sellers
- **User Profiles**: View seller information and reviews
- **Responsive Design**: Fully optimized for mobile, tablet, and desktop
- **Payment Processing**: Secure checkout using Stripe
- **Similar Items**: View related listings that might interest you

## Tech Stack

- **Frontend**: React with Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: Firebase Auth
- **Image Storage**: Cloudinary
- **Payment Processing**: Stripe
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v14+)
- npm or yarn
- MongoDB account
- Firebase account
- Cloudinary account
- Stripe account (for payment features)

### Installation

1. Clone the repository

   ```
   git clone https://github.com/yourusername/COSC484_Project.git
   cd COSC484_Project
   ```

2. Install frontend dependencies

   ```
   cd frontend
   npm install
   ```

3. Install backend dependencies

   ```
   cd ../backend
   npm install
   ```

### Running the Application

1. Start the backend server

   ```
   cd backend
   npm run dev
   ```

2. Start the frontend development server

   ```
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Deployment

The application is deployed using Vercel:

- Frontend: https://cosc-484-project-front.vercel.app
- Backend: https://cosc-484-project-back.vercel.app

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# TU Marketplace

TU Marketplace is a comprehensive platform designed for university students to buy, sell, and exchange goods within their campus community. The application combines modern e-commerce functionality with social features to create a seamless and secure marketplace experience.

## Features

- **User Authentication**: Secure login and registration with Firebase
- **Listings Management**: Create, browse, update, and delete product listings
- **Direct Messaging**: In-app messaging between buyers and sellers
- **Search & Filtering**: Find listings by category, price range, and keywords
- **Payment Processing**: Secure checkout via Stripe integration
- **User Profiles**: Customizable profiles with ratings and reviews
- **Order Management**: Track purchases and sales
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

### Frontend

- React.js with Vite
- TailwindCSS for styling
- React Router for client-side routing
- Firebase Authentication
- Stripe for payment processing
- Deployed on Vercel

### Backend

- Node.js with Express
- MongoDB for database (with Mongoose ORM)
- RESTful API architecture
- Stripe API integration
- Deployed on Vercel

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB account
- Firebase account
- Stripe account

### Installation

1. Clone the repository

   ```
   git clone https://github.com/your-username/COSC484_Project.git
   cd COSC484_Project
   ```

2. Install backend dependencies

   ```
   cd backend
   npm install
   ```

3. Install frontend dependencies

   ```
   cd ../frontend
   npm install
   ```

4. Start the backend server

   ```
   cd ../backend
   npm run dev
   ```

5. Start the frontend development server

   ```
   cd ../frontend
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Deployment

The project is deployed on Vercel with the following URLs:

- Frontend: https://cosc-484-project-front.vercel.app
- Backend API: https://cosc-484-project-api.vercel.app

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

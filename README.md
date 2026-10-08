# Envisense Project

This repository contains two main applications for the Envisense Project:
1. `public-app`: The public-facing web application.
2. `authority-dashboard`: The administrative dashboard.

## How to Run the Project Locally

Both applications are built using React and Vite, and they require Node.js to be installed on your system.

### Running the Public App

1. Open a terminal and navigate to the `public-app` directory:
   ```bash
   cd public-app
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Ensure you have your `.env.local` file set up with the necessary Firebase configurations.
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to the URL provided (typically `http://localhost:5173`).

### Running the Authority Dashboard

1. Open a terminal and navigate to the `authority-dashboard` directory:
   ```bash
   cd authority-dashboard
   ```
2. Install the dependencies:
   ```bash
   npm install
   ```
3. Ensure you have your `.env.local` file set up with the necessary Firebase configurations.
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open your browser and navigate to the URL provided (typically `http://localhost:5174` if the public app is already running on 5173).

---
*Note: If you haven't set up the `.env.local` files with your Firebase credentials, the applications might not be able to connect to the backend database.*

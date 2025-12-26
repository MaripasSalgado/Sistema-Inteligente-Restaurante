# sistema-inteligente-para-restaurante

Intelligent Restaurant Management System - "El Empanadazo"
This repository contains the comprehensive technological solution for "El Empanadazo", designed to automate operational management, administration, and data analysis. The system features a decoupled architecture focused on scalability, security, and predictive analytics.

🛠️ Tech Stack
Frontend: Vue.js 3 with Vite for a fast, reactive, and modern Single Page Application (SPA) experience.

Styling: Tailwind CSS for responsive and utility-first design.

Backend (API): Node.js with Express, implemented as Serverless Functions for high availability.

Database: PostgreSQL managed via Supabase, featuring business logic integrated through SQL functions and triggers.

Deployment:

Frontend: Vercel / Netlify.

Backend: Vercel (API) / Railway.

📂 Project Structure

api/: Server-side logic endpoints, including the Alerts module and Cron jobs for inventory control.

sql/: Database scripts, including prediction functions, dashboard seeds, and payroll management logic.

src/: Vue.js source code (components, views, and state management).

ModuloAlertasPorCorreo.md: Detailed documentation on the automated notification system.

PLAN_PREDICCIONES.md: Methodology used for consumption and sales forecasting.

🌟 Key Modules
1. Prediction Dashboard
Uses specialized SQL functions to analyze historical sales trends and project ingredient requirements with confidence intervals.

2. Inventory & Supply Management
Batch tracking, expiration date control, and automated email alerts triggered by low stock levels or anomalous consumption patterns.

3. Payroll Module
Automated salary calculation based on shifts, attendance, and compliance with Costa Rican labor regulations (CCSS, income tax, etc.).

4. Recipe & Costing System
Automatic production cost calculation for final products based on the ingredients used in the inventory.

5. Security & Auditing
Robust authentication and audit logs that track user access and suspicious login attempts.

🔧 Setup and Installation
Prerequisites
Node.js (version specified in .nvmrc).

PNPM (recommended package manager).

Supabase account for database hosting.

Steps
Clone the repository:

Bash

git clone https://github.com/MaripasSalgado/Sistema-Inteligente-Restaurante.git
Install dependencies:

Bash

pnpm install

Database Configuration: Execute the context.sql file and the scripts within the sql/ folder in your Supabase instance to create the necessary tables and functions.

Environment Variables: Configure your Supabase credentials and email service keys in a .env file based on the CONFIGURACION_SUPABASE.md guide.

Execution:

Frontend & Backend Dev: pnpm run dev (or as defined in your package.json).

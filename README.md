# invoice-expense-saas
A SaaS application for managing invoices, expenses, and role-based access control (RBAC).  
This repo contains **two projects**:  
- `api/` -> .NET Core Web API (backend)  
- `ui/` -> React.js frontend (user interface)  

##  Tech Stack
- **Backend (API)**: ASP.NET Core, Entity Framework, SQL Server  
- **Frontend (UI)**:  React, TailwindCSS  
- **Authentication & RBAC**: ASP.NET Core Identity (planned)  
- **Database**: SQL Server  

##  Project Structure
invoice-expense-saas/
├── api/ # Backend project (.NET Core Web API)
├── ui/ # Frontend project (React)
└── README.md # This file

## Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/AbeerUrRahim/invoice-expense-saas.git
cd invoice-expense-saas
cd api
dotnet restore
dotnet run

Run the UI (Frontend)
cd ../ui
npm install
npm run dev

Features (Planned & Implemented)

 Invoice & Expense Management

 CRUD Operations (Invoices, Expenses, Customers)

 Role-Based Access Control (RBAC)

 CSV Export of Invoices

 Dashboard & Reports

 Authentication with JWT

 Notes:
 Backend must run before UI to fetch data properly.

 Author

Abeer Ur Rahim

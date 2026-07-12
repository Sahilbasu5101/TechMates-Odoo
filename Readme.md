# TransitOps: Smart Transport Operations Platform 🚀

TransitOps is an AI-powered, end-to-end fleet and transport management platform designed to streamline logistics, dispatching, driver management, maintenance, and financial analytics. Built using a modern **MERN stack** integrated with **LangChain (Groq & FastAPI)** for advanced AI decision-making.

---

## 🌟 Key Features

### 1. Role-Based Access Control (RBAC) 🔐
A secure, multi-tenant architecture where access is scoped entirely by the user's role:
- **Fleet Manager:** Full access to Fleet Registry, Maintenance logs, and Global Settings.
- **Dispatcher:** Access to the Live Trip Board, Dispatching Engine, and Real-time Tracking.
- **Safety Officer:** Dedicated access to Driver Management and Compliance.
- **Financial Analyst:** Access to Fuel/Expenses tracking and high-level AI Analytics.

### 2. Smart Trip Dispatching (AI-Powered) 🧠
- **Automated Validation:** The LangChain dispatch agent automatically validates cargo vs. vehicle capacity and driver license validity before allowing a dispatch.
- **Real-Time Board:** Kanban-style board tracking trips from `Draft` &rarr; `Dispatched` &rarr; `Completed`.

### 3. Live Fleet Tracking & Socket.io 📡
- Real-time geospatial tracking of vehicles using **Socket.io**.
- Dispatchers can view active trip routes and driver locations live on an interactive map.

### 4. Predictive Maintenance & Fuel Tracking 🔧
- Comprehensive logging of all fuel expenses and maintenance records.
- Automatically calculates operational costs per vehicle.
- **FastAPI ML Service:** Predicts the next required service date based on odometer readings, vehicle age, and trip history.

### 5. Financial Analytics & AI Business Insights 📊
- Aggregated KPIs for Total Revenue, Operational Cost, Net Profit, ROI, and Fuel Efficiency.
- **AI Executive Summary:** Integrates with Groq via LangChain to generate human-readable, actionable business insights based on real-time financial data.

---

## 🛠️ Technology Stack

- **Frontend:** React.js, Tailwind CSS, Vite, React Router, Recharts, Socket.io-client.
- **Backend (Core APIs):** Node.js, Express.js, MongoDB (Mongoose), Socket.io.
- **Backend (AI & ML):** Python, FastAPI, LangChain, Groq API, Scikit-learn.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)
- MongoDB Atlas (or local instance)

### 1. Backend (Express.js)
```bash
cd backend/express
npm install
# Configure your .env file with PORT=5000 and MONGO_URI
npm run dev
```

### 2. Backend (FastAPI ML Service)
```bash
cd backend/fastapi
python -m venv venv
source venv/Scripts/activate  # On Windows
pip install -r requirements.txt
# Configure your .env file with PORT=8000
python -m uvicorn app.main:app --reload --port 8000
```

### 3. Frontend (Vite/React)
```bash
cd frontend
npm install
npm run dev
```

---

## 🤝 The Team (Hackathon Execution)
This project was successfully built from scratch over an 8-hour sprint by a 4-member team, utilizing a strictly modular, feature-wise roadmap to eliminate merge conflicts and maximize parallel development.

**TransitOps &copy; 2026**
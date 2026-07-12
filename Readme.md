**TransitOps**

Team Execution Guide - Feature-Wise Task Roadmap

_MERN + LangChain | 8-Hour Hackathon | 4-Member Team_

## **🎯 How to Use This Document**

- Har member apne naam wala section padhe - sirf usi feature folder ke andar kaam karna hai.
- Shared files (models, auth middleware, server.js) Hour 0 mein saath baithke banao, phir lock kar do.
- Checklist ke items complete hote hi tick maaro - isse progress track hoga.
- Order of build: Person A ka Auth+Models sabse pehle chahiye, baaki teen parallel kaam kar sakte hain.

## **🗂️ Overall Folder Structure**

transitops/

├── frontend/src/features/

│ ├── fleet-core/ → Person A

│ ├── trip-dispatch/ → Person B

│ ├── maintenance-fuel/ → Person C

│ └── analytics-insight/ → Person D

│

├── backend/express/ → Core CRUD APIs (all persons contribute routes)

└── backend/langchain-agents/ → AI layer (Person B + Person D)

**PERSON A**

Auth, RBAC, Fleet Core (Vehicles, Drivers, Dashboard, Settings)

### **📁 Frontend Folder (kaam sirf isi ke andar karo)**

- pages/DashboardPage.jsx - KPI cards + filters (type/status/region)
- pages/VehiclesPage.jsx - Vehicle Registry table + Add/Edit form
- pages/DriversPage.jsx - Driver Management table + Add/Edit form
- pages/SettingsPage.jsx - Depot info, Currency, RBAC role table
- components/ - LoginForm.jsx, ProtectedRoute.jsx (shared, build first)

### **📁 Backend Folder (routes/controllers yaha)**

backend/express/routes/auth.routes.js

backend/express/routes/vehicle.routes.js

backend/express/routes/driver.routes.js

backend/express/routes/dashboard.routes.js

backend/express/middleware/auth.middleware.js (JWT verify)

backend/express/middleware/rbac.middleware.js (role check)

backend/express/models/User.js, Vehicle.js, Driver.js

### **✅ Task Checklist**

**☐** Build User model + JWT login/signup (email + password, bcrypt hash)

**☐** Build RBAC middleware - 4 roles: Fleet Manager, Dispatcher, Safety Officer, Financial Analyst

**☐** Build Vehicle model + full CRUD (Reg No unique, Type, Capacity, Odometer, Cost, Status)

**☐** Build Driver model + full CRUD (License No, Category, Expiry, Contact, Safety Score, Status)

**☐** Enforce: Retired / In Shop vehicles hidden from any dispatch-related dropdown

**☐** Build Dashboard KPI aggregation route (Active/Available Vehicles, Vehicles in Maintenance, Drivers on Duty, Fleet Utilization %)

**☐** Build Settings page - Depot Name, Currency, Distance Unit, Role permission table

**☐** Share User/Vehicle/Driver models with team by Hour 1 - everyone depends on these

### **🔌 API Routes to Build**

| **Method** | **Route**           | **Purpose**                      |
| ---------- | ------------------- | -------------------------------- |
| **POST**   | /api/auth/register  | Create user with role            |
| **POST**   | /api/auth/login     | Login, return JWT                |
| **GET**    | /api/vehicles       | List all vehicles (with filters) |
| **POST**   | /api/vehicles       | Register new vehicle             |
| **PUT**    | /api/vehicles/:id   | Update vehicle / status          |
| **GET**    | /api/drivers        | List all drivers                 |
| **POST**   | /api/drivers        | Register new driver              |
| **PUT**    | /api/drivers/:id    | Update driver / status           |
| **GET**    | /api/dashboard/kpis | Aggregated KPI numbers           |

**PERSON B**

Trip Dispatch, Driver Portal + AI Dispatch Agent (Core Feature)

### **📁 Frontend Folder (kaam sirf isi ke andar karo)**

- pages/TripDispatcherPage.jsx - Order intake form + smart vehicle/driver match
- pages/LiveBoardPage.jsx - Live trip status board (Draft/Dispatched/Completed/Cancelled)
- pages/DriverPortalPage.jsx - Driver status update + complaint form + trip history
- components/AIReasoningCard.jsx - shows AI approve/reject reasoning trace

### **📁 Backend Folder (routes/controllers yaha)**

backend/express/routes/trip.routes.js

backend/express/routes/driverPortal.routes.js

backend/express/models/Trip.js, Complaint.js

backend/langchain-agents/dispatchAgent.js

backend/langchain-agents/maintenancePredictAgent.js

backend/langchain-agents/tools/checkCapacity.js, checkLicense.js, checkAvailability.js

### **✅ Task Checklist**

**☐** Build Trip model (source, destination, vehicle, driver, cargo weight, distance, status)

**☐** Build Trip lifecycle: Draft → Dispatched → Completed → Cancelled

**☐** Enforce rules: cargo ≤ vehicle capacity, driver license valid, no double-booking

**☐** On Dispatch: auto-set vehicle & driver status = On Trip

**☐** On Complete: capture final odometer + fuel consumed, auto-set both = Available

**☐** On Cancel: restore vehicle & driver to Available

**☐** Build Driver Portal - status update, complaint/issue raise, real-time journey update

**☐** Build LangChain Dispatch Agent - validates trip request step-by-step and returns reasoning text

**☐** Build post-trip prediction agent - estimate days until next service needed

**☐** Build emergency reassignment: if a trip vehicle breaks down, suggest next available match

### **🔌 API Routes to Build**

| **Method** | **Route**                         | **Purpose**                      |
| ---------- | --------------------------------- | -------------------------------- |
| **POST**   | /api/trips                        | Create trip (Draft)              |
| **POST**   | /api/trips/:id/dispatch           | Run AI validation, dispatch trip |
| **POST**   | /api/trips/:id/complete           | Complete trip, log odometer/fuel |
| **POST**   | /api/trips/:id/cancel             | Cancel trip, restore statuses    |
| **GET**    | /api/trips/live                   | Live board data                  |
| **POST**   | /api/driver-portal/status         | Driver updates own status        |
| **POST**   | /api/driver-portal/complaint      | Driver raises issue              |
| **POST**   | /api/trips/:id/emergency-reassign | Suggest replacement vehicle      |

### **🤖 AI / LangChain Part**

dispatchAgent.js: receives trip request → calls tools (checkCapacity, checkLicense, checkAvailability) against MongoDB data → returns a reasoning string like '✅ 450kg ≤ 500kg, driver license valid till 2027 → APPROVED'. This reasoning is shown live in AIReasoningCard.jsx. maintenancePredictAgent.js: after trip completion, takes odometer + fuel + trip frequency and predicts 'next service in X days'.

**PERSON C**

Maintenance & Fuel/Expense Management

### **📁 Frontend Folder (kaam sirf isi ke andar karo)**

- pages/MaintenancePage.jsx - Maintenance log list + Add record form
- pages/FuelExpensesPage.jsx - Fuel log + expense entry (tolls etc.)

### **📁 Backend Folder (routes/controllers yaha)**

backend/express/routes/maintenance.routes.js

backend/express/routes/fuelExpense.routes.js

backend/express/models/Maintenance.js, FuelLog.js, Expense.js

### **✅ Task Checklist**

**☐** Build Maintenance model + CRUD (vehicle ref, type of service, date, cost)

**☐** On creating active maintenance record: auto-set vehicle status = In Shop

**☐** On closing maintenance: auto-restore vehicle status = Available (unless Retired)

**☐** Build Fuel Log model + CRUD (liters, cost, date, vehicle ref)

**☐** Build Expense model + CRUD (tolls, misc expenses, vehicle ref)

**☐** Build aggregation: total operational cost per vehicle = Fuel + Maintenance

**☐** Expose this cost data cleanly - Person D's Analytics/ROI depends on it

### **🔌 API Routes to Build**

| **Method** | **Route**                  | **Purpose**                          |
| ---------- | -------------------------- | ------------------------------------ |
| **GET**    | /api/maintenance           | List maintenance records             |
| **POST**   | /api/maintenance           | Create record, auto In Shop          |
| **PUT**    | /api/maintenance/:id/close | Close record, restore vehicle        |
| **GET**    | /api/fuel                  | List fuel logs                       |
| **POST**   | /api/fuel                  | Add fuel log                         |
| **GET**    | /api/expenses              | List expenses                        |
| **POST**   | /api/expenses              | Add expense (toll etc.)              |
| **GET**    | /api/costs/:vehicleId      | Total operational cost for a vehicle |

**PERSON D**

Reports, Analytics & AI Business Insight

### **📁 Frontend Folder (kaam sirf isi ke andar karo)**

- pages/AnalyticsPage.jsx - Fuel Efficiency, Fleet Utilization, Operational Cost, ROI KPI cards
- components/AISummaryCard.jsx - 'Generate AI Summary' button + narrative text card
- components/charts/ - Top Costliest Vehicles bar chart, Monthly Revenue chart (Recharts)

### **📁 Backend Folder (routes/controllers yaha)**

backend/express/routes/analytics.routes.js

backend/langchain-agents/reportSummaryAgent.js

### **✅ Task Checklist**

**☐** Build Fuel Efficiency calc = Distance / Fuel used

**☐** Build Fleet Utilization % calc (from vehicle status data)

**☐** Build Operational Cost per vehicle (pull from Person C's cost API)

**☐** Build ROI calc = (Revenue - (Maintenance + Fuel)) / Acquisition Cost

**☐** Build Top Costliest Vehicles + Monthly Revenue charts

**☐** Build CSV export for reports

**☐** Build 'Generate AI Summary' - send KPI numbers to reportSummaryAgent.js, display plain-English insight

**☐** Build per-trip / per-vehicle profitability breakdown for Financial Analyst view

### **🔌 API Routes to Build**

| **Method** | **Route**                          | **Purpose**                             |
| ---------- | ---------------------------------- | --------------------------------------- |
| **GET**    | /api/analytics/kpis                | Fuel efficiency, utilization, cost, ROI |
| **GET**    | /api/analytics/top-costly-vehicles | Chart data                              |
| **GET**    | /api/analytics/monthly-revenue     | Chart data                              |
| **GET**    | /api/analytics/export/csv          | CSV export of report data               |
| **POST**   | /api/analytics/ai-summary          | Run LangChain summary agent             |

### **🤖 AI / LangChain Part**

reportSummaryAgent.js: takes the already-calculated KPI numbers (Fuel Efficiency, Utilization %, Operational Cost, ROI) and generates a 2-3 sentence plain-English business insight, e.g. 'Fleet utilization is 81%, above target. Van-05 has the lowest ROI due to recent maintenance costs.' No new data needed - just summarizes existing numbers.

## **🔒 Shared Files - Build Together in Hour 0, Then Lock**

- backend/express/models/\*.js - agree on schema fields together before anyone writes code
- backend/express/middleware/auth.middleware.js + rbac.middleware.js - Person A owns, others just use
- backend/express/server.js - route imports only, everyone adds their own line
- frontend/src/features/common/ - Navbar, Sidebar, ProtectedRoute, AuthContext

## **⏱️ Suggested Timeline (8 Hours)**

- Hour 0-1: Team sits together - finalize MongoDB schema, Express boilerplate, folder structure
- Hour 1-4: Everyone builds their own CRUD in their folder - fully parallel, no blocking
- Hour 4-5: Person B adds AI Dispatch Agent (needs Trip CRUD working first)
- Hour 5-6: Person D adds AI Report Summary Agent (needs Person C's cost data ready)
- Hour 6-7: Integration - connect frontend to backend, apply RBAC on all routes
- Hour 7-8: Run the full workflow end-to-end (register → dispatch → complete → maintenance → report), fix bugs, practice demo

## **🎯 Golden Rule**

**Stick to your own folder. Frontend: features/&lt;your-name&gt;/. Backend: your routes/models only. Shared files are locked after Hour 0. This avoids merge conflicts and keeps four people building in true parallel.**
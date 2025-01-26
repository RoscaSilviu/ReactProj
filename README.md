# Auto Service Appointment Scheduler

This app is meant to be used my users and mechanincs. 
The users can create an account , login , view available mechanics, schedule
an appointment , view/modify/delete appointments, and get real-time updates on their appointment from the mechanics. 
The mechanics can view all their appointments, mark them as complete or add updates.

## 🛠 Technologies Used

- **Frontend**:
  - React (v18+)
  - React Router (v6+)
  - Bootstrap (v5+) + React Bootstrap
  - React Date Picker

### Backend
- **Core**:
  - Node.js
  - Express.js
  - Mysql
  - Swagger

- **Security & Auth**:
  - JWT (JSON Web Tokens)
  - bcrypt (for password hashing)
  - Helmet (header securing)
  - CORS (Cross-Origin Resource Sharing)
  - express-rate-limit (request limiting)

- **Utilities**:
  - express-validator (input validation)
  - body-parser (request parser)
  - dotenv (managing env variables)

- **ORM/ODM** 
  - Sequelize

- **Testing** 
  - Playwright

## 📁 Project Folder Structure

ReactProj/
├── public/
│ ├── index.html
│ └── ... (other static assets)
│
├── src/
│ ├── components/
│ │ ├── Pages
│ │ ├── Auth
│ │ └── NavigationBar
│ │
│ ├── context
│ ├── stykes
│ │
│ │ 
│ │
│ ├── App.js
│ ├── index.js
│ │
│
├── backend
│ ├── config/
│ ├── models/
│ ├── migrations/
│ └── server.js
│
├── .gitignore
├── package.json
└── README.md


## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm (v8+)
- PostgreSQL/MongoDB (if using database)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/RoscaSilviu/ReactProj.git
   cd ReactProj
2. **Install dependencies**
   npm install
   cd backend; npm install
3. **Install MySql and configure database**
4. **Run server and start the app**
   node server.js 
   npm start


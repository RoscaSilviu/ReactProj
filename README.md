# Cat Adoption Appointment Scheduler

Fur-Ever Home is a full-stack web application designed to streamline the cat adoption process. Users can log in, browse adoptable cats, and register appointments to meet them. Admins can manage cat listings through a secure dashboard with full CRUD capabilities.

## User Stories
- Adopter:
    As a possible pet owner, I want to log in, view available cats, and schedule an appointment to meet one so I can find my perfect companion.
- Admin:
    As an admin, I want to add, update, and delete cat listings so the adoption information stays current and accurate.

## Features
- User authentication
- View cat profiles with details and images
- Appointment registration system
- Admin dashboard (Create, Read, Update, Delete cats)

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

- **Containerization** 
  - Docker

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
│ │ 
├── backend  
│ ├── config/  
│ ├── models/  
│ ├── migrations/  
│ ├── Dockerfile  
│ └── server.js  
│  
├── .gitignore  
├── package.json  
└── README.md  


## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16+)
- npm (v8+)
- Docker

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/RoscaSilviu/ReactProj.git
   cd ReactProj
2. **Install dependencies**  
   npm install  
   cd backend; npm install
3. **Create a .env file with the following content**
    MYSQL_ROOT_PASSWORD=parola
    MYSQL_DATABASE=proiect_final
    MYSQL_USER=appuser
    MYSQL_PASSWORD=parola
    MYSQL_HOST=db
    JWT_SECRET=CatSuperSecret123!@#
    CAT_UNIVERSAL_PASSWORD=cat
    FRONTEND_URL=http://localhost:3000
    BACKEND_PORT=5000
    FRONTEND_PORT=3000
4. **Open Docker Desktop**  
5. **Start the app using Docker**  
   docker-compose up --build




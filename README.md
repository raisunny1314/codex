# 🚀 Codex – DSA Problem Solving Platform  

## 🔗 Live Demo  
- **Frontend (Vercel):** [Codex](https://codex-iota-lac.vercel.app)  
- **Backend (Render):** [API Link](https://codex-mulj.onrender.com)  

---

## 📖 About the Project  
**Codex** is an interactive platform for practicing **Data Structures and Algorithms**.  
It allows students to solve coding problems in real time with **Judge0 API**, receive AI assistance, watch video explanations, and track submission history.  
Admins can manage problems, upload video solutions via **Cloudinary**, and maintain the platform using a secure **Admin Panel**.  

---

## ✨ Features  

### 👩‍🎓 Student Panel  
- Browse problems by category (Array, Linked List, Graph, etc.)  
- Solve problems with **online code editor** (Run & Submit via Judge0 API)  
- AI-powered assistant for coding help  
- Video solutions for problems  
- Submission history tracking  

### 🛠️ Admin Panel  
- Create, Update, Delete problems  
- Upload solution videos (Cloudinary)  
- Manage problem database  

---

## 🛠️ Tech Stack  
**Frontend:** React (Vite), TailwindCSS, Axios  
**Backend:** Node.js, Express.js, MongoDB, JWT Authentication  
**Code Execution:** Judge0 API  
**Media Uploads:** Cloudinary  
**Session Management:** Redis  
**Deployment:** Vercel (Frontend), Render (Backend)  

---

## 🏗️ System Architecture  

```mermaid
flowchart TD

subgraph Student["👩‍🎓 Student"]
  A1[Login / Signup] --> A2[Select Problem]
  A2 --> A3[Code Editor (Run / Submit)]
  A3 --> A4[View Video Solution]
  A3 --> A5[Submission History]
end

subgraph Admin["🛠️ Admin"]
  B1[Login / JWT Auth] --> B2[Create / Update / Delete Problem]
  B2 --> B3[Upload Video Solution (Cloudinary)]
end

subgraph Backend["⚙️ Backend (Node.js + Express)"]
  A1 & A3 & A5 --> C1[API Gateway]
  B1 & B2 & B3 --> C1
  C1 --> C2[(MongoDB Database)]
  C1 --> C3[(Redis Cache / Session Cookies)]
  C1 --> C4{{Judge0 API}}
  C1 --> C5[(Cloudinary Storage)]
end

Student <--> Backend
Admin <--> Backend
```

---

## 📂 Project Structure  

```
codex/
│── backend/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── problemController.js
│   │   ├── submissionController.js
│   │   ├── videoController.js
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/ (redis, cloudinary configs)
│   └── server.js
│
│── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Admin/
│   │   │   ├── Auth/
│   │   │   ├── Problems/
│   │   │   ├── Submissions/
│   │   │   ├── Video/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.js
│
│── package.json
│── README.md
```

---

## ⚙️ Installation & Setup  

### 1️⃣ Clone the repository  
```bash
git clone https://github.com/raisunny1314/codex.git
cd codex
```

### 2️⃣ Backend Setup  
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:  
```
PORT
AI_KEY
MONGO_URI=your_mongodb_url
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
REDIS_URL=your_redis_url
```

Run backend server:  
```bash
npm run dev
```

### 3️⃣ Frontend Setup  
```bash
cd frontend
npm install
npm run dev
```

---

## 📡 API Endpoints (Sample)  
- `POST /api/auth/signup` → Register user  
- `POST /api/auth/login` → Login user  
- `GET /api/problems` → Get all problems  
- `POST /api/submit/:id` → Submit solution  
- `POST /api/admin/problem` → Add problem (Admin only)  
- `POST /api/admin/upload-video` → Upload solution video  

---

## 🤝 Contributing  
Contributions are welcome! Fork this repo and submit a PR 🚀  

---

## 📜 License  
MIT License  

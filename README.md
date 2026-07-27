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
## 📸 Screenshots

![SignIn Page](<frontend/Screenshot (286).png.png>)
![LogIn Page](<image/Screenshot (287).png>)
![Home Problems Page](<image/Screenshot (288).png>)
![Code Solve Editor page](<image/Screenshot (289).png>)
![Refer. Solution](<image/Screenshot (290).png>)
![Submission History](<image/Screenshot (291).png>)
![AdminPaned](<image/Screenshot (292).png>)
![Create a new Problem](<image/Screenshot (293).png>)
![Delete a problem](<image/Screenshot (294).png>)
![Add Solution Video](<image/Screenshot (295).png>)

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
│   └── index.js
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

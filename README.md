# 🧠 AI Complaint Management System

A full-stack web application that allows users to raise, track, and manage complaints efficiently.  
The system provides a centralized dashboard for users and administrators, enabling structured complaint handling with categories, priorities, and status updates.

🚀 **Live Demo:** https://ai-complaint-system-beta.vercel.app/
📦 **Deployed on:** Vercel

---

## 📌 Project Overview

The **AI Complaint Management System** is designed to solve real-world issues where complaints raised by users are often unorganized, delayed, or ignored.

This project provides:
- A user-friendly interface to raise complaints
- A dashboard to view complaint status
- An admin panel to manage and resolve complaints
- A scalable backend using Supabase
- A modern frontend using Next.js

The goal is to simulate a **real-world complaint resolution workflow** used in organizations, societies, or service platforms.

---

## 🛠️ Tech Stack

### Frontend
- **Next.js (App Router)**
- **React**
- **Tailwind CSS**
- **JavaScript**

### Backend / Database
- **Supabase**
  - PostgreSQL Database
  - Authentication (Email-based)
  - Storage (for future image uploads)

### Deployment
- **Vercel**
- Environment-based configuration using `.env` variables

---

## ✨ Key Features

### 👤 User Features
- User signup and login
- Raise a complaint with:
  - Title
  - Description
  - Category
  - Priority
- View all raised complaints on dashboard
- Track complaint status (Open / In Progress / Resolved)

### 🛡️ Admin Features
- Admin dashboard to view all complaints
- View complete complaint details
- Update complaint status
- Centralized complaint monitoring

### ⚙️ System Features
- Clean and responsive UI
- Real-time database updates
- Stable architecture (no random empty states)
- Secure environment variables

---

## 📂 Project Structure
ai-complaint-system/
│
├── src/
│ ├── app/
│ │ ├── dashboard/ # User dashboard
│ │ ├── complaints/
│ │ │ └── new/ # Raise complaint page
│ │ ├── login/ # Login page
│ │ ├── signup/ # Signup page
│ │ ├── admin/ # Admin dashboard
│ │ ├── layout.js # App layout
│ │ └── page.js # Landing page
│ │
│ ├── lib/
│ │ └── supabaseClient.js # Supabase configuration
│ │
│ └── components/ # Reusable UI components
│
├── public/
├── package.json
├── README.md
└── .env.local


---

## 🧪 How the Application Works

### User Flow
1. User signs up or logs in
2. User raises a complaint by filling a form
3. Complaint is stored in Supabase database
4. User dashboard displays all complaints
5. Complaint status is updated by admin

### Admin Flow
1. Admin logs in
2. Admin views all complaints
3. Admin updates status (Open / In Progress / Resolved)
4. Changes reflect immediately on dashboards

---

## 🔮 Future Improvements

- Role-based access using Supabase RLS
- File/image upload support
- Advanced analytics dashboard
- Email notifications
- AI-based complaint categorization
- Better UI animations and transitions

---

## 👨‍💻 Author

**Adil Hamid Khan**  
Third Year Computer Engineering Student  
Passionate about Full-Stack Development





# 🏫 School Attendance System

A full-stack web application that enables teachers to manage classes, track student attendance, and view attendance reports. Built with **Next.js 15 App Router**, **Prisma**, **PostgreSQL**, and **TailwindCSS**, and powered by **Firebase** for authentication.

---

## 🚀 Features

- 🔐 **User Authentication** (via Firebase)
- 👨‍🏫 **Class Management** (Create & manage classes)
- 👨‍🎓 **Student Management** (Add students to specific classes)
- 📅 **Attendance Tracking** (Mark students present/absent)
- 📊 **Attendance History** (View and filter attendance records)
- 🎨 **Responsive UI** using TailwindCSS and Material UI
- 🧠 **Type-safe Database Access** via Prisma

---

## 🧱 Tech Stack

| Layer       | Tool/Service                        |
|-------------|-------------------------------------|
| Frontend    | [Next.js 15 (App Router)](https://nextjs.org/) |
| Styling     | [TailwindCSS](https://tailwindcss.com/) |
|             | [MaterialUI].(https://mui.com/material-ui/). |
| Auth        | [Firebase Auth](https://firebase.com/) |
| Backend     | [Prisma ORM](https://www.prisma.io/) |
| Database    | [PostgreSQL](https://www.postgresql.org/) via Supabase |
| Hosting     | Local / Vercel / Custom (configurable) |

---

## 📂 Folder Structure
/
-  ├── app/ # App Router Pages
-  ├── components/ # Reusable components
-  ├── lib/ # Utility functions
-  ├── prisma/ # Prisma schema & migration files
-  ├── public/ # Static files
-  ├── styles/ # Global styles
---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/Melka1/upwork-school-attendance.git
cd upwork-school-attendance
npm install

# Prisma database URL
DATABASE_URL=your-postgres-connection-url

npx prisma generate
npx prisma db push
npm run dev
```

## ✅ Todos / Improvements
-  Attendance PDF export or reports

-  Unit & integration tests

## 🧑‍💻 Author
-  Built by Melka1 for an Upwork client project.
-  Open to collaboration or improvements.


├── .env.local # Environment variables

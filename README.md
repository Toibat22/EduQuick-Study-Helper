# 📘 EduQuick – Study Helper (MVP)

A study assistant that helps students learn faster by automatically generating summaries, quizzes, and homework explanations based on their study materials.

## 🚀 Live Demo

Frontend: EduQuick – Study Helper

Backend API: EduQuick Backend

## 📌 About the Project

EduQuick – Study Helper is a simple but powerful learning tool designed to help students understand study materials more efficiently.

With EduQuick, users can:

✔ Summarize long notes

✔ Generate quiz questions from any content

✔ Get step-by-step homework help

✔ Sign up & log in securely

This is an MVP (Minimum Viable Product) built for the Power Learn Project Final Project.

## 🛠 Tech Stack
### Frontend

React (Vite)

Context API (Authentication)

TailwindCSS (optional)

Render (static hosting)

### Backend

Node.js + Express

MongoDB Atlas

Mongoose

JWT Authentication

OpenAI API (for AI features)

Render (web service)

## 🔐 Core Features
1. User Authentication

Sign up

Log in

JWT-secured routes

2. Summarizer

Enter any text → receive a concise summary.

3. Quiz Generator

Automatically generates multiple-choice questions from any material.

4. Homework Helper

Gives clear explanations and guidance based on user input.

5. Clean, Student-Friendly UI

Simple, responsive, and easy to use.

## 📡 API Endpoints
### Auth

POST /api/auth/signup
POST /api/auth/login

## Study Tools (Protected)

#### Requires: Authorization: Bearer <token>

| Feature        | Endpoint               | Method |
| -------------- | ---------------------- | ------ |
| Summarize text | `/api/study/summarize` | POST   |
| Generate quiz  | `/api/study/quiz`      | POST   |
| Homework help  | `/api/study/homework`  | POST   |


## 📁 Project Structure

### Backend
/controllers  
/routes  
/middleware  
/models  
server.js  
.env  

### Frontend
/src  
  /assets  
  /components  
  /lib  
  api.js
  .env  

## ⚙️ Environment Variables

#### Backend (.env)
PORT=5000
MONGO_URI=your_mongo_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES=7d
OPENAI_API_KEY=your_openai_key

## 🚀 How to Run Locally

#### Backend
pnpm install
pnpm run dev

#### Frontend
pnpm install
pnpm run dev

## 🧪 Testing the API (Postman)

POST example body:

{
  "text": "Your study material here..."
}


Don’t forget your Bearer token in headers.

## 📝 Current Limitations (MVP)

No saved summaries or quiz history yet

Basic UI (no advanced styling yet)

Requires internet connection for AI features

No PDF upload or document scanning yet

## 🔮 Planned Future Improvements

Save generated summaries/quizzes

Add user dashboard

Upload PDFs and images

Improve UI/UX

Add speech-to-text learning

Personalized study plans

Add progress tracking

Add customizable quiz formats


## 👩🏽‍🎓 About the Developer

Developed by Abdulhammed Toibat as part of the Power Learn Project (PLP) Software Development Scholarship, demonstrating full-stack skills with the MERN stack.









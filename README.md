# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

# 🧠 SereneMind AI Chatbot

SereneMind is a beginner-friendly AI-powered mental health chatbot. It offers a safe and interactive space where users can chat, track their moods, write journal entries, and view personal insights — all in one place.

> ⚠️ For informational and self-reflection purposes only. Not a replacement for professional mental health support.

---

## ✅ Features

- 🔐 User login and signup (mock authentication)
- 💬 AI-style chatbot for casual, supportive conversations
- 📓 Journal feature to reflect and record thoughts
- 📊 Dashboard for mood insights
- 🌐 React + TypeScript + Tailwind CSS frontend

---

## 🛠 Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Routing:** React Router
- **State:** React Context API
- **Backend:** Mock services (no real backend yet)

---

## 🚀 Getting Started

1. Clone the repository

```bash
git clone https://github.com/Stoicpals/serene-mind-ai-chatbot.git
cd serene-mind-ai-chatbot

2. Install dependencies
bash
Copy
Edit
npm install
3. Start the development server
bash
Copy
Edit
npm run dev
Now visit http://localhost:5173 in your browser.

📁 Project Structure
php
Copy
Edit
serene-mind-ai-chatbot/
├── public/
├── src/
│   ├── components/         # ChatPage, Navbar, AuthPage, etc.
│   ├── services/           # mockDataService for auth
│   ├── types/              # TypeScript types
│   └── App.tsx             # Main app routes and context
├── .gitignore
├── package.json
└── README.md
🌱 Future Enhancements
Real AI chatbot using OpenAI GPT-4 API

Firebase backend for real authentication and storage

Sentiment analysis on journal entries

Mobile responsiveness

Dark mode

⚖️ License
This project is open-source under the MIT License.

👩‍💻 Author
Built with 💙 by Stoicpals (Pallavi)
If you like it, consider ⭐ starring the repo or sharing it!

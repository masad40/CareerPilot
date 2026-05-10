# 🚀 CareerPilot

### AI-Powered Career Roadmap Generator

CareerPilot is an intelligent web application that generates structured,
personalized career roadmaps using AI. Users can enter their target
career, experience level, and goals --- and receive a step-by-step
learning path instantly.

---

## 🌟 Features

- 🤖 AI-generated structured career roadmaps\
- 📊 Phase-based learning plan (Beginner → Advanced)\
- 📚 Recommended tools & resources\
- 🔐 JWT Authentication\
- 📱 Fully responsive UI

---

## 🛠 Tech Stack

### Frontend

- Next.js
- Tailwind CSS
- Axios

### Backend

- Node.js
- Express.js
- MongoDB

### AI Integration

- Gemini API

---

## 🧠 How It Works

1.  User selects:
    - Career goal (e.g., MERN Developer)
    - Experience level (Beginner / Intermediate / Advanced)
    - Time commitment

2.  Backend sends structured prompt to Gemini LLM.

3.  AI generates:
    - Learning Phases
    - Technologies
    - Projects
    - Resources
    - Milestones

4.  Roadmap is displayed in structured UI format.

---

## 🔥 Contribution Guidelines

## 📦 Step 1: Clone the Repository

First, download the project code onto your computer.

Open your terminal and run:

```bash
git clone https://github.com/alvy00/eg-careerpilot-asyncawait.git
```
## 🧹 Step 2: Install All Dependencies

Make sure you are inside the main project folder:

```bash
cd eg-careerpilot-asyncawait
```

Then install all necessary libraries:

```bash
npm install
```

✅ This will install dependencies for **both** frontend and backend at once!

---

## 🚀 Step 3: Run the Project Locally

Start both the frontend and backend servers:

```bash
npm run dev
```


## 🔥 Step 4: Basic Commands You'll Use

| Command             | Purpose                                 |
|---------------------|-----------------------------------------|
| `npm install`        | Install all project dependencies       |
| `npm run dev`        | Start frontend and backend together    |
| `npm run build`      | Create optimized production builds     |

---

## 🔒 Step 5: How We Manage Code (VERY IMPORTANT)

### You CANNOT push directly to `main`.  
Instead, follow this process:

1. Create a **new branch** from `main`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   Example:
   ```bash
   git checkout -b feature/add-login-page
   ```

2. Work on your task in your branch.

3. Stage and commit your changes:
   ```bash
   git add .
   git commit -m "Added login page"
   ```

4. Push your branch to GitHub:
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Open a Pull Request (PR)** from GitHub UI:
   - Base branch = `developement`
   - Compare branch = your feature branch
   - Write a clear PR description (what you changed).

6. Once approved, you or the reviewer can merge it!

---

Please **read these files** before working on big features or backend routes!

---

## ⚡ Quick Troubleshooting

| Problem                          | Solution |
|----------------------------------|----------|
| `npm install` fails?             | Make sure Node.js and npm are installed. |
| Ports already in use?            | Stop any running servers or change ports. |
| Project doesn't run?             | Check for missing environment variables or dependencies. |
| Can't push to `main`?            | You're doing it right — open a Pull Request instead! |

---

## 🎯 Final Reminder

- **Always** pull the latest `development` branch before starting a new feature:
  ```bash
  git checkout your-branch
  git pull origin development
  ```
- **Small commits** and **small PRs** are better than huge ones.
- **Ask questions early** — don’t stay stuck!

---


## ⚡ Useful Commands

| Command           | What it Does                     |
| ----------------- | --------------------------------- |
| `npm install`      | Install all dependencies         |
| `npm run dev`      | Start frontend + backend locally |
| `npm run build`    | Build production versions        |

---


## 🔑 Environment Variables

Create a `.env` file inside the server directory:

PORT=3000\
MONGO_URI=your_mongodb_connection\
JWT_SECRET=your_secret_key\
GEMINI_API_KEY=your_gemini_api_key

---

## 🔮 Future Enhancements

- 🔎 RAG-based resource injection
- 📈 Skill gap analysis
- 📊 Progress tracking dashboard
- 🎯 Resume builder integration
- 🤝 Mentor chat mode
- 🏆 Gamification system

---

## 🛡 Security Features

- Password hashing (bcrypt)
- JWT authentication
- API validation & sanitization
- Rate limiting

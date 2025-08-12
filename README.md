# Project Title – Cricket Chatbot

A conversational cricket assistant powered by AI, designed to answer cricket-related queries, share fun facts, run quizzes, and provide general information in real time.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

## Project Overview

This project is a **Cricket Chatbot** that allows users to interact via a web interface to ask cricket-related questions, get live match insights, explore trivia, and participate in quizzes. The chatbot uses AI to provide intelligent and context-aware responses, with the backend powered by FastAPI and the frontend built in React.

The backend handles request processing, query parsing, and interaction with the AI model, while the frontend provides a clean and responsive user interface.

**Live Demo:** [View on Vercel](https://v0-image-analysis-amber-sigma-22.vercel.app/)  
**Backend Repo:** [View on GitHub](https://github.com/AadilUsmani/Cricket_chatbot)

## Features

- AI-powered cricket-related Q&A
- Fun fact and trivia generation
- Cricket quiz mode
- Responsive UI for desktop and mobile
- Smooth API integration between frontend and backend

## Technologies Used

- **Frontend:**
  - TypeScript
  - React
  - Vercel (deployment)
  - Axios (API requests)
  - Tailwind CSS (styling)

- **Backend:**
  - [Backend Repository](https://github.com/AadilUsmani/Cricket_chatbot)
  - FastAPI
  - Python
  - OpenAI API / Gemini API (for AI responses)
  - Render (backend deployment)

## Getting Started

### Prerequisites

- Node.js (>= 18.x)
- npm or yarn
- Vercel account (if deploying frontend)
- Backend server running (or use deployed backend URL)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/your-frontend-repo.git
   cd your-frontend-repo
   ```

2. **Install dependencies:**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the root folder:
   ```env
   VITE_BACKEND_URL=https://your-backend-domain.com
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser at `http://localhost:5173`

## Usage

- Select the chatbot mode (General Q&A, Fun Facts, or Quiz)
- Ask cricket-related questions or request trivia
- For quizzes, answer multiple-choice questions and see your score

## API Reference

The backend exposes endpoints such as:

- `POST /chat` – Sends a user query to the AI and receives a response
- `GET /quiz` – Fetches cricket quiz questions
- `GET /funfact` – Retrieves a random cricket fact

See the [Backend Repository](https://github.com/AadilUsmani/Cricket_chatbot) for full API documentation.

## Deployment

- The frontend is deployed on **Vercel**.
- The backend is deployed on **Render**.

When deploying the frontend:
1. Push your frontend repo to GitHub
2. Connect the repo to Vercel
3. Set the environment variable `VITE_BACKEND_URL` in Vercel’s dashboard
4. Deploy and share your live link

## Contributing

Contributions are welcome! Please fork the repository, create a new branch for your feature/fix, and submit a pull request.

## License

This project is licensed under the MIT License – see the [LICENSE](LICENSE) file for details.

## Contact

**Muhammad Adil Usmani**  
- GitHub: [AadilUsmani](https://github.com/AadilUsmani)  
- Email: muhammadaadilusmani@gmail.com

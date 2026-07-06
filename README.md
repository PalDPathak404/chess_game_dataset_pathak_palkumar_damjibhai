# Knightly

Knightly is a high-end, AI-powered humanized chess review and coaching platform designed specifically for beginner and intermediate players. It acts as an intelligence, exploration, and coaching tool, bringing a premium SaaS design aesthetic and conversational AI learning to chess analysis.

## Problem Statement

Traditional chess engines like Stockfish are clinical, overwhelming, and unhelpful for beginners. They output raw centipawn evaluations and complex variations without explaining *why* a move was bad or *how* to improve. Existing platforms present this data in dense layouts that feel like gaming dashboards rather than professional learning tools.

## Why Knightly Exists

Knightly exists to translate raw engine output into humanized, contextual coaching. Instead of seeing "-3.54", a beginner is told: *"A serious opening error! This gives your opponent a decisive early advantage because you neglected center control."* Knightly wraps this intelligence in a minimal, dark-first, premium interface designed for focus and clarity.

## Features

- **Asynchronous Engine Analysis**: Highly accurate evaluations and classifications (blunder, mistake, inaccuracy, best, forced) based on real evaluation deltas.
- **Context-Aware Coaching**: Explanations that understand game phase (opening, middlegame, endgame) and evaluation swings.
- **Conversational AI Chat**: Interactive sessions allowing players to ask their "AI Coach" specific questions about any move.
- **User Ownership & History**: JWT-based authentication to manage personal import history, reviews, and chat sessions securely.
- **Search & Discovery**: Fuzzy-matching and autocomplete for exploring datasets, players, and openings.

## Architecture

Knightly is built as a Modular Monolith, separating backend intelligence from frontend presentation. The application is dataset-centric, deriving player insights dynamically without rigid synchronized tables.

### Tech Stack

- **Backend**: Node.js, Express, MongoDB (Mongoose)
- **Frontend**: React (Vite), React Router (In Progress)
- **Authentication**: JWT, bcryptjs
- **Design System**: Custom CSS (Dark First, Premium AI SaaS aesthetic)

## Folder Structure

```
knightly/
├── backend/          # Express REST API
│   ├── src/          # Controllers, models, routes, services
│   └── data/         # Dataset seeding resources
├── frontend/         # React SPA (Vite)
│   └── src/          # Components, layouts, pages, hooks, services
└── README.md         # Project documentation
```

## Backend Overview

The backend provides a robust suite of REST APIs. It handles PGN parsing, async review processing simulation (queue-ready), conversational context extraction, and complex Mongoose aggregation pipelines for real-time analytics. Authentication secures ownership routes while maintaining backward compatibility for anonymous usage.

## Frontend Overview (In Progress)

The frontend foundation has been established using React and Vite. It utilizes a custom minimal CSS design system targeting a premium "AI SaaS" look (similar to Linear or Vercel). The architecture is currently wired with React Router and a foundational `GlobalLayout`, preparing for future integration of an interactive chessboard, move timeline, and AI coach panel.

## Installation & Running Locally

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/knightly.git
   cd knightly
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   # Create a .env file based on .env.example
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## Environment Variables

Check `backend/.env.example` for required variables, including `PORT`, `MONGO_URI`, and `JWT_SECRET`.

## Future Roadmap

- Interactive chessboard and timeline integration.
- True Stockfish engine binary integration replacing the deterministic simulator.
- LLM API integration (e.g., OpenAI) for dynamic, non-templated coaching generation.
- Player dashboard for personalized progression tracking.
- WebSockets for real-time analysis progress streaming.

## Contributors

Knightly is developed as an advanced AI coding assistant showcase project.
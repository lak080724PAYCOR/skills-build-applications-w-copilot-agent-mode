# OctoFit Tracker

<img src="./docs/octofitapp-small.png" alt="OctoFit Tracker" width="180"/>

OctoFit Tracker is a full-stack prototype for Mergington High School students and gym teachers. It combines a React frontend, an Express + TypeScript API, and MongoDB-ready Mongoose models to support social fitness tracking, team competition, and personalized workout guidance.

## Features

- Student and gym teacher profiles
- Activity logging for running, walking, cycling, workouts, swimming, yoga, and basketball
- Progress tracking with total points, distance, and activity history
- Team creation, team joining, and team dashboard summaries
- Individual and team leaderboards ranked by earned points
- Personalized workout suggestions based on each student's recent activity
- Seed data for users, teachers, teams, activities, workouts, and leaderboard snapshots
- Responsive Bootstrap UI optimized for quick updates during class or after school

## Project structure

```text
octofit-tracker/
├── backend/
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── app.ts
│       ├── server.ts
│       ├── config/
│       ├── data/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── scripts/
│       ├── types/
│       └── utils/
└── frontend/
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── components/
        ├── pages/
        └── services/
```

## Setup

### 1. Install dependencies

```bash
npm install --prefix octofit-tracker/backend
npm install --prefix octofit-tracker/frontend
```

### 2. Start MongoDB

The devcontainer is configured for `mongodb-org` and uses the `octofit_db` database.

```bash
ps aux | grep mongod
mongod --dbpath /data/db --fork --logpath /tmp/mongod.log
```

### 3. Seed the database

```bash
npm run seed --prefix octofit-tracker/backend
```

If MongoDB is not available, the API still serves the bundled seed data from memory so the prototype can run locally.

### 4. Run the backend and frontend

```bash
npm run dev --prefix octofit-tracker/backend
npm run dev --prefix octofit-tracker/frontend -- --host 0.0.0.0
```

The frontend runs on port `5173` and the API runs on port `8000`.

## Testing

```bash
npm test --prefix octofit-tracker/backend
npm run build --prefix octofit-tracker/backend
npm run build --prefix octofit-tracker/frontend
```

## API overview

- `GET /api/health`
- `GET /api/bootstrap`
- `POST /api/users`
- `POST /api/activities`
- `POST /api/teams`
- `POST /api/teams/:teamId/join`
- `GET /api/users/:userId/workout-suggestions`

## Notes

- The frontend automatically uses a Codespaces-friendly backend URL when `VITE_CODESPACE_NAME` is available.
- Workout suggestions are regenerated whenever activity or team data changes.
- Leaderboards are stored in MongoDB when the database is available and are computed in-memory otherwise.

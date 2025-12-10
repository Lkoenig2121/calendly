# Calendly Clone

A full-stack clone of Calendly built with Next.js, TypeScript, Tailwind CSS, Node.js, and Express.

## Features

- **Sign In Page**: Authentication page with dummy credentials
- **Scheduling Dashboard**: Main page showing event types, single-use links, and meeting polls
- **Account Settings**: Profile management with various settings options
- **Sidebar Navigation**: Complete navigation with all main sections
- **Responsive Design**: Modern UI matching Calendly's design

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Node.js, Express
- **Authentication**: Session-based with cookies

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start both servers concurrently:
```bash
npm run dev
```

This will start both the Express backend server (port 3001) and Next.js frontend server (port 3000) at the same time.

3. Open [http://localhost:3000](http://localhost:3000) in your browser

**Note:** If you need to run them separately, you can use:
- `npm run server` - Backend only (port 3001)
- `npm run client` - Frontend only (port 3000)

## Demo Credentials

- **Email**: `lukas@example.com`
- **Password**: `password123`

Or use:
- **Email**: `demo@calendly.com`
- **Password**: `demo123`

## Project Structure

```
calendly/
├── app/                    # Next.js app directory
│   ├── signin/            # Sign in page
│   ├── scheduling/        # Main scheduling dashboard
│   ├── account/           # Account settings pages
│   └── ...                # Other navigation pages
├── components/            # React components
│   ├── Sidebar.tsx       # Navigation sidebar
│   └── Header.tsx        # Top header bar
├── server/               # Express backend
│   └── index.js          # API server
└── package.json          # Dependencies
```

## Available Pages

- `/signin` - Sign in page
- `/scheduling` - Main scheduling dashboard (default after login)
- `/meetings` - Meetings page
- `/availability` - Availability settings
- `/contacts` - Contacts page
- `/workflows` - Workflows automation
- `/integrations` - Integrations & apps
- `/routing` - Meeting routing
- `/analytics` - Analytics dashboard
- `/admin` - Admin center
- `/upgrade` - Upgrade plan
- `/help` - Help & support
- `/account/profile` - Profile settings
- `/account/branding` - Branding settings
- `/account/link` - My Link settings
- `/account/communication` - Communication settings
- `/account/login` - Login preferences
- `/account/security` - Security settings
- `/account/cookies` - Cookie settings

## API Endpoints

- `POST /api/auth/signin` - Sign in
- `POST /api/auth/signout` - Sign out
- `GET /api/auth/me` - Get current user
- `GET /api/event-types` - Get event types

## Notes

- The backend server runs on port 3001
- The frontend runs on port 3000
- Sessions are stored in memory (reset on server restart)
- This is a demo application with dummy data


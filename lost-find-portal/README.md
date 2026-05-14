# Lost&Find Pro - Full Stack Lost and Found Portal

A professional React + Express project for managing lost and found items with authentication, manager control, live GPS location, real-time notifications, and a sandbox bKash/Nagad payment API layer.

## What Was Fixed / Added

- Fixed login/register reliability by adding a demo storage mode that works even if MongoDB is not installed.
- Added user and manager login flows.
- Added Manager Panel for all posts, users, claims, status control, and delete control.
- Added Live Location page and GPS capture in item posting.
- Added API & Payment page with bKash/Nagad sandbox payment initialization.
- Added professional homepage sections, workflow page, improved navbar/footer, stats cards, and API documentation page.
- Kept MongoDB support for real deployment.

## Quick Start for Submission Demo

### 1. Start Backend

```bash
cd server
npm install
npm start
```

Backend runs on:

```txt
http://localhost:5000
```

The included `server/.env` uses:

```env
STORAGE_MODE=demo
```

So MongoDB is not required for a quick local demonstration.

### 2. Start Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## Demo Accounts

### Normal User

```txt
Email: demo@student.com
Password: password123
```

### Manager

```txt
Email: manager@lostfind.com
Password: manager123
```

Manager registration access code:

```txt
manager123
```

## Main Pages

- `/` - Professional homepage / index
- `/how-it-works` - project workflow page
- `/items` - browse/search/filter lost and found posts
- `/create` - protected item posting page with GPS
- `/dashboard` - user dashboard
- `/manager` - manager control panel
- `/live-location` - live GPS capture page
- `/api-payments` - API documentation + bKash/Nagad sandbox module

## API Summary

### Security

- `GET /api/security/csrf-token`

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Items

- `GET /api/items`
- `GET /api/items/:id`
- `POST /api/items`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`
- `POST /api/items/:id/claim`
- `PATCH /api/items/:id/resolve`
- `GET /api/items/user/mine`

### Manager

- `GET /api/manager/overview`
- `PATCH /api/manager/items/:id/status`
- `DELETE /api/manager/items/:id`

### Payments

- `GET /api/payments/providers`
- `POST /api/payments/create`
- `GET /api/payments/sandbox/:transactionId`

## Real MongoDB Mode

To use MongoDB instead of demo mode, edit `server/.env`:

```env
STORAGE_MODE=mongodb
MONGODB_URI=mongodb://127.0.0.1:27017/lost_find_portal
JWT_SECRET=your_secure_secret
CSRF_SECRET=your_secure_secret
CLIENT_ORIGIN=http://localhost:5173
```

Then run:

```bash
cd server
npm start
```

## Notes About bKash/Nagad

This project contains a professional sandbox/mock payment API layer. Real bKash or Nagad production checkout requires official merchant credentials, provider API approval, and server-side credential configuration.

## Tech Stack

- Frontend: React, Vite, Bootstrap, Axios, React Router, Socket.io Client
- Backend: Node.js, Express, JWT, CSRF token, Helmet, CORS, Rate Limiting, Socket.io
- Database: MongoDB with Mongoose or built-in demo storage mode

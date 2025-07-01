# EchoLine

A full-stack real-time messaging platform with WebSocket communication, file uploads, and a sleek UI.

![EchoLine](https://github.com/elitebot47/EchoLine/raw/main/client/public/preview.png)

## Live Demo
[https://chat-app-roan-psi.vercel.app](https://chat-app-roan-psi.vercel.app)

## ✨ Features

- ⚡ Real-time messaging with Socket.io
- 🔔 In-app notifications system
- 📁 File uploads and sharing via Cloudinary
- 🔒 Secure authentication with NextAuth.js
- 👤 User presence indicators and typing status
- 🎨 Modern UI with Tailwind CSS and Shadcn UI
- 📱 Responsive design for mobile and desktop
- 🔍 Message search and history

## 🛠️ Tech Stack

### Frontend
- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS
- Zustand (State Management)
- React Query / TanStack Query
- Socket.io Client
- Framer Motion (Animations)
- Cloudinary (File Storage)

### Backend
- Node.js
- Express
- Socket.io
- PostgreSQL
- Prisma ORM
- NextAuth.js

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Cloudinary account (for file uploads)

### Installation

#### 1. Clone the repository
```bash
git clone https://github.com/elitebot47/EchoLine.git
cd EchoLine
```

#### 2. Set up the client

```bash
cd client
npm install

# Create .env.local file with:
cp .env.example .env.local
# Edit .env.local with your credentials
```

#### 3. Set up the database
```bash
# In the client directory
npx prisma migrate dev
npx prisma generate
```

#### 4. Set up the server
```bash
cd ../server
npm install
```

#### 5. Start the development servers

In one terminal (client):
```bash
cd client
npm run dev
```

In another terminal (server):
```bash
cd server
npm run dev
```

### Environment Variables

Create a `.env.local` file in the client directory with:

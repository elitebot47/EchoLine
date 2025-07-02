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

## 🏗️ Project Architecture

### Client-Server Architecture

EchoLine uses a separated architecture with:

- **Next.js Frontend**: Handles UI, authentication, and API routes
- **Express Socket.io Server**: Manages real-time communication

This separation allows for independent scaling and deployment of each component.

## 🔄 Real-time Communication Flow

```mermaid
sequenceDiagram
    participant Client1 as User 1
    participant NextJS as Next.js App
    participant Socket as Socket.io Server
    participant Client2 as User 2

    Client1->>NextJS: Send message
    NextJS->>NextJS: Store in PostgreSQL
    NextJS->>Socket: Emit message event
    Socket->>Client2: Broadcast message
    Socket->>Client2: Send typing notification
    Client2->>Socket: Acknowledge receipt
    Socket->>Client1: Deliver receipt status
```

## 🛡️ Authentication Flow

EchoLine uses NextAuth.js for secure authentication with:

- Email/password authentication
- Google OAuth (optional)
- Session-based authentication
- Secure password hashing with Argon2

## 💾 Database Schema

### Core Entities

- **User**: User profiles and authentication
- **Room**: Chat rooms (private or group)
- **Message**: Individual messages with content and metadata
- **Notification**: System and user notifications

### Key Relationships

- Users participate in multiple Rooms
- Rooms contain multiple Messages
- Messages generate Notifications

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

## 🔐 Environment Variables

### Client Environment Setup (.env.local)

Create a `.env.local` file in the `client` directory with the following variables:

```env
# Database Connection
DATABASE_URL="postgresql://username:password@localhost:5432/echoline"

# NextAuth Authentication
AUTH_SECRET="your-nextauth-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional - for Google Sign-in)
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# Cloudinary Configuration (File Storage)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"

# Cloudinary Upload Presets
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_ROOM_IMAGE="preset-for-room-images"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_ROOM_DOCUMENT="preset-for-documents"
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_USER_AVATAR="preset-for-avatars"

# Socket.io Server URL
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
```

### Server Environment Setup (.env)

Create a `.env` file in the `server` directory with:

```env
# Server Configuration
PORT=3001

# CORS Origins (comma-separated)
ALLOWED_ORIGINS="http://localhost:3000,https://your-production-domain.com"
```

### Environment Variable Details

| Variable                                 | Description                                | Required         |
| ---------------------------------------- | ------------------------------------------ | ---------------- |
| `DATABASE_URL`                           | PostgreSQL connection string               | Yes              |
| `AUTH_SECRET`                            | Secret key for NextAuth session encryption | Yes              |
| `NEXTAUTH_URL`                           | Full URL of your Next.js application       | Yes              |
| `AUTH_GOOGLE_ID`                         | Google OAuth client ID                     | For Google login |
| `AUTH_GOOGLE_SECRET`                     | Google OAuth client secret                 | For Google login |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`      | Your Cloudinary cloud name                 | Yes              |
| `CLOUDINARY_API_KEY`                     | Cloudinary API key                         | Yes              |
| `CLOUDINARY_API_SECRET`                  | Cloudinary API secret                      | Yes              |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET_*` | Upload presets for different file types    | Yes              |
| `NEXT_PUBLIC_SOCKET_URL`                 | URL for Socket.io server                   | Yes              |
| `PORT`                                   | Server port (server only)                  | Yes              |
| `ALLOWED_ORIGINS`                        | CORS allowed origins (server only)         | Yes              |

### Setting Up Cloudinary Upload Presets

1. Log in to your [Cloudinary Console](https://cloudinary.com/console)
2. Navigate to Settings > Upload
3. Scroll down to "Upload presets" and click "Add upload preset"
4. Create three presets with appropriate settings:
   - One for room images
   - One for documents
   - One for user avatars
5. Copy the preset names to your environment variables

## 🔧 Code Quality & Linting

EchoLine maintains high code quality standards with:

```bash
# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Format code with Prettier
npm run format
```

### ESLint Configuration

The project uses ESLint with custom rules for React, TypeScript, and Next.js to ensure code quality and consistency.

### Prettier Configuration

Code formatting is standardized using Prettier with the following settings:

```json
{
  "singleQuote": true,
  "jsxSingleQuote": true,
  "tabWidth": 2,
  "semi": true
}
```

---

### REST API Endpoints

The application provides the following API endpoints:

```
GET /api/users - Get all users
GET /api/users/:id - Get user by ID
POST /api/rooms - Create a new chat room
GET /api/rooms/:id/messages - Get messages for a room
POST /api/messages - Send a new message
```

### Open the App

Go to [http://localhost:3000](http://localhost:3000) in your browser to use the application.

---

### (Optional) Seed the Database

If you have a seed script, you can run it to populate your database with initial data:

```bash
npx prisma db seed
```

---

## 🚀 Deployment

### Frontend Deployment (Next.js)

1. **Vercel** (Recommended)

   ```bash
   vercel
   ```

2. **Netlify**
   ```bash
   netlify deploy
   ```

### Backend Deployment (Socket.io Server)

1. **Render**

   - Connect your GitHub repository
   - Set build command: `npm install && npm run build`
   - Set start command: `npm start`

2. **Railway**

   ```bash
   railway up
   ```

3. **Fly.io**
   ```bash
   fly launch
   fly deploy
   ```

## 🔮 Future Roadmap

- [ ] End-to-end encryption
- [ ] Protected socket.io backend with JWT
- [ ] Message reactions and emoji support
- [ ] Message search and filtering

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.

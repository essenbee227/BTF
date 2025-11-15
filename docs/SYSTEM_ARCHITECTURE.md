# Dubai GaiaGro - System Architecture Document

## Table of Contents
1. [Overview](#overview)
2. [Architecture Diagram](#architecture-diagram)
3. [Tech Stack](#tech-stack)
4. [System Components](#system-components)
5. [Data Flow](#data-flow)
6. [Database Schema](#database-schema)
7. [API Architecture](#api-architecture)
8. [Authentication & Authorization](#authentication--authorization)
9. [File Structure](#file-structure)
10. [Key Features Implementation](#key-features-implementation)
11. [Security Considerations](#security-considerations)
12. [Deployment Architecture](#deployment-architecture)

---

## Overview

**Dubai GaiaGro** is a sustainability-focused travel companion web application built with Next.js 16 (App Router). The application enables users to discover eco-friendly locations in Dubai, complete sustainability missions, earn rewards (EcoCoins), and connect with like-minded travelers through community groups.

### Core Functionality
- **Interactive Eco Map**: Discover eco-friendly hotels, attractions, water refill points, and districts
- **Mission System**: Complete sustainability challenges with photo proof uploads
- **Reward System**: Earn EcoCoins for completing missions
- **Community Groups**: Join themed groups and participate in discussions
- **User Authentication**: Secure email/password authentication

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │   Browser    │  │   React      │  │   Leaflet    │          │
│  │              │  │   Components │  │   Maps       │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                    NEXT.JS APPLICATION LAYER                    │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              App Router (Server Components)              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│   │
│  │  │  Pages   │  │ Layouts │  │ Providers│  │  Auth    ││   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘│   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              API Routes (Route Handlers)                  │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │   │
│  │  │   Auth API   │  │ Missions API │  │  Photo API   │  │   │
│  │  └──────────────┘  └──────────────┘  └──────────────┘  │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              Client Components (React)                     │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐│   │
│  │  │ Navbar   │  │   Map    │  │ Mission  │  │Community ││   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘│   │
│  └──────────────────────────────────────────────────────────┘   │
└────────────────────────────┬────────────────────────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                      SERVICE LAYER                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   NextAuth   │  │   Prisma     │  │    Sharp     │         │
│  │   (Auth)     │  │   (ORM)      │  │  (Image Proc)│         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
└─────────┼──────────────────┼──────────────────┼─────────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
┌────────────────────────────┼────────────────────────────────────┐
│                      DATA LAYER                                  │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │                    SQLite Database                         │ │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐  │ │
│  │  │ Users  │ │Missions│ │Photos  │ │ Posts  │ │Locations│ │ │
│  │  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘  │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │              File System Storage                          │ │
│  │         public/uploads/missions/                          │ │
│  └──────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

---

## Tech Stack

### Frontend
- **Framework**: Next.js 16.0.3 (App Router)
- **UI Library**: React 19.2.0
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 4 (via PostCSS)
- **Maps**: Leaflet 1.9.4 + react-leaflet 5.0.0
- **Fonts**: Geist Sans, Geist Mono, Roboto Condensed, Stack Sans Headline

### Backend
- **Runtime**: Node.js
- **Framework**: Next.js API Routes
- **Authentication**: NextAuth.js 5.0.0-beta.30
- **Password Hashing**: bcryptjs 3.0.3
- **Image Processing**: sharp 0.34.5
- **Crypto**: crypto-js 4.2.0, Node.js crypto

### Database
- **ORM**: Prisma 6.19.0
- **Database**: SQLite (development)
- **Adapter**: @auth/prisma-adapter 2.11.1

### Development Tools
- **Linting**: ESLint 9
- **Type Checking**: TypeScript
- **Package Manager**: npm

---

## System Components

### 1. **Frontend Components**

#### Page Components
- **`app/page.tsx`**: Landing page with hero section and feature overview
- **`app/map/page.tsx`**: Protected eco map page (server component)
- **`app/missions/page.tsx`**: Protected missions dashboard (server component)
- **`app/community/page.tsx`**: Protected community groups page (server component)
- **`app/auth/signin/page.tsx`**: Sign-in form (client component)
- **`app/auth/signup/page.tsx`**: Sign-up form (client component)

#### Reusable Components
- **`components/Navbar.tsx`**: Top navigation bar with authentication-aware links
- **`components/MapComponent.tsx`**: Leaflet map with custom markers
- **`components/MapClient.tsx`**: Client wrapper for map (SSR disabled)
- **`components/MissionCard.tsx`**: Mission card with photo upload functionality
- **`components/Providers.tsx`**: Session provider wrapper for NextAuth

#### Data Components
- **`data/ecoPlaces.ts`**: Static typed data for eco-friendly locations

### 2. **Backend Services**

#### Authentication Service
- **Location**: `lib/auth.ts`
- **Provider**: NextAuth with Credentials Provider
- **Session Strategy**: JWT
- **Password Verification**: bcryptjs compare

#### API Routes
- **`api/auth/[...nextauth]/route.ts`**: NextAuth handler
- **`api/auth/register/route.ts`**: User registration endpoint
- **`api/missions/upload-photo/route.ts`**: Photo upload with duplicate detection
- **`api/missions/photos/route.ts`**: Fetch mission photos
- **`api/missions/delete-photo/route.ts`**: Delete photo and refund EcoCoins

### 3. **Data Layer**

#### Database Models (Prisma)
- **User**: User accounts with authentication and profile data
- **Mission**: User-specific sustainability missions
- **MissionPhoto**: Uploaded photos with metadata and analysis
- **Account/Session**: NextAuth authentication tables
- **Post/Comment**: Community features (future)
- **EcoLocation**: Eco-friendly locations (future)

#### File Storage
- **Path**: `public/uploads/missions/`
- **Format**: Optimized JPEG/PNG
- **Naming**: `{userId}_{timestamp}_{hash}.{ext}`

---

## Data Flow

### 1. **User Authentication Flow**

```
User → Sign In Page → Credentials Submit
  ↓
API Route (/api/auth/[...nextauth])
  ↓
NextAuth Credentials Provider
  ↓
Prisma Query (find user by email)
  ↓
bcryptjs (compare password)
  ↓
JWT Token Generation
  ↓
Session Creation
  ↓
Redirect to Protected Page
```

### 2. **Mission Photo Upload Flow**

```
User → Mission Card → Upload Photo
  ↓
API Route (/api/missions/upload-photo)
  ↓
Authentication Check (auth())
  ↓
File Validation (type, size)
  ↓
Image Processing (sharp)
  ├─ Resize to max 1920x1920
  ├─ Compress (quality: 85)
  └─ Generate hash (SHA-256)
  ↓
Duplicate Detection (query by hash)
  ↓
Save to File System
  ↓
Create MissionPhoto Record
  ↓
Update Mission Progress
  ↓
Award EcoCoins (if progress increased)
  ↓
Return Success Response
```

### 3. **Map Rendering Flow**

```
User → Map Page
  ↓
Server Component (auth check)
  ↓
Load Eco Places Data (static)
  ↓
Render MapClient (client component)
  ↓
MapComponent (SSR disabled)
  ├─ Initialize Leaflet Map
  ├─ Add Tile Layer
  ├─ Create Custom Markers
  └─ Add Popups with Place Info
  ↓
Interactive Map Display
```

---

## Database Schema

### Core Models

#### User
```prisma
- id: String (CUID)
- name: String?
- email: String? (unique)
- password: String? (hashed)
- ecoCoins: Int (default: 0)
- level: Int (default: 1)
- Relations: missions, missionPhotos, accounts, sessions
```

#### Mission
```prisma
- id: String (CUID)
- title: String
- description: String
- reward: Int
- completed: Boolean
- progressCount: Int (current progress)
- targetCount: Int (target to complete)
- userId: String (FK → User)
- Relations: user, photos
```

#### MissionPhoto
```prisma
- id: String (CUID)
- missionId: String (FK → Mission)
- imageUrl: String
- imageHash: String (SHA-256, indexed)
- verified: Boolean
- aiAnalysis: String? (JSON)
- uploadedAt: DateTime
- uploadedBy: String (FK → User)
- Indexes: imageHash, missionId
```

#### NextAuth Tables
- **Account**: OAuth account linking
- **Session**: User sessions
- **VerificationToken**: Email verification tokens

### Relationships

```
User (1) ──→ (N) Mission
User (1) ──→ (N) MissionPhoto
Mission (1) ──→ (N) MissionPhoto
User (1) ──→ (N) Account
User (1) ──→ (N) Session
```

---

## API Architecture

### RESTful API Endpoints

#### Authentication
- **POST** `/api/auth/[...nextauth]`: NextAuth handler
  - Handles sign in, sign out, session management
- **POST** `/api/auth/register`: User registration
  - Validates input, hashes password, creates user

#### Missions
- **POST** `/api/missions/upload-photo`
  - **Auth**: Required
  - **Body**: FormData (file, missionId)
  - **Process**: Validate → Process → Save → Update Progress → Award Coins
  - **Response**: `{ success, message, coinsAwarded, progress }`

- **GET** `/api/missions/photos?missionId={id}`
  - **Auth**: Required
  - **Query**: missionId
  - **Response**: Array of photo objects

- **DELETE** `/api/missions/delete-photo`
  - **Auth**: Required
  - **Body**: `{ photoId, missionId }`
  - **Process**: Delete file → Delete record → Refund coins → Update progress
  - **Response**: `{ success, message, coinsRefunded }`

### Request/Response Patterns

#### Success Response
```json
{
  "success": true,
  "message": "Photo uploaded successfully!",
  "coinsAwarded": 50,
  "progress": {
    "current": 3,
    "target": 5,
    "completed": false
  }
}
```

#### Error Response
```json
{
  "success": false,
  "error": "Invalid file type"
}
```

---

## Authentication & Authorization

### Authentication Strategy

**Provider**: NextAuth Credentials Provider
**Session Type**: JWT (stateless)
**Password Storage**: bcryptjs hashed

### Flow

1. **Registration**
   ```
   User Input → Validation → Password Hash (bcrypt) → Create User → Return Success
   ```

2. **Sign In**
   ```
   Credentials → Find User → Compare Password → Generate JWT → Create Session
   ```

3. **Session Management**
   - JWT stored in HTTP-only cookie
   - Session validated on each request
   - User ID embedded in JWT token

### Protected Routes

Routes protected via server-side `auth()` check:
- `/map`
- `/missions`
- `/community`

Unauthenticated users redirected to `/auth/signin`

### Authorization

- Users can only access their own missions
- Photo uploads validated against user's missions
- EcoCoins tracked per user

---

## File Structure

```
BTF/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (auth)/                   # Auth route group
│   │   │   └── layout.tsx
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/   # NextAuth handler
│   │   │   │   └── register/        # Registration endpoint
│   │   │   └── missions/
│   │   │       ├── upload-photo/     # Photo upload
│   │   │       ├── photos/          # Get photos
│   │   │       └── delete-photo/    # Delete photo
│   │   ├── auth/
│   │   │   ├── signin/               # Sign in page
│   │   │   └── signup/               # Sign up page
│   │   ├── community/                # Community pages
│   │   │   ├── chat/[groupId]/       # Chat room (placeholder)
│   │   │   ├── CommunityContent.tsx  # Community component
│   │   │   └── page.tsx
│   │   ├── map/                      # Map page
│   │   │   └── page.tsx
│   │   ├── missions/                 # Missions page
│   │   │   └── page.tsx
│   │   ├── globals.css               # Global styles
│   │   ├── layout.tsx                # Root layout
│   │   └── page.tsx                  # Landing page
│   ├── components/                    # React components
│   │   ├── MapClient.tsx            # Map client wrapper
│   │   ├── MapComponent.tsx          # Leaflet map
│   │   ├── MissionCard.tsx          # Mission card UI
│   │   ├── Navbar.tsx                # Navigation
│   │   └── Providers.tsx            # Session provider
│   ├── data/
│   │   └── ecoPlaces.ts              # Static location data
│   └── lib/
│       └── auth.ts                    # NextAuth configuration
├── prisma/
│   ├── schema.prisma                 # Database schema
│   ├── migrations/                   # Database migrations
│   └── dev.db                        # SQLite database
├── public/
│   ├── uploads/
│   │   └── missions/                 # Uploaded photos
│   └── [static assets]
├── docs/                             # Documentation
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## Key Features Implementation

### 1. **Interactive Eco Map**

**Technology**: Leaflet + react-leaflet
**Data Source**: Static TypeScript file (`ecoPlaces.ts`)
**Features**:
- Custom colored markers by place type
- Popups with place information
- Client-side rendering (SSR disabled)

**Implementation**:
```typescript
// MapComponent.tsx
- Uses MapContainer, TileLayer, Marker, Popup from react-leaflet
- Custom icon configuration per place type
- Static data loaded from ecoPlaces.ts
```

### 2. **Mission System**

**Core Logic**:
- Each user has personalized missions
- Progress tracked via `progressCount` / `targetCount`
- Photos uploaded as proof
- EcoCoins awarded on progress increase

**Photo Upload Process**:
1. File validation (type: jpeg/png, size: max 10MB)
2. Image optimization (resize, compress via sharp)
3. Hash generation (SHA-256 for duplicate detection)
4. Duplicate check against existing photos
5. File system storage
6. Database record creation
7. Progress update
8. EcoCoins calculation and award

### 3. **EcoCoins Reward System**

**Award Logic**:
- Coins awarded when mission progress increases
- Amount = `mission.reward` (one-time per mission completion)
- Refunded when photo deleted (if progress decreases)

**Storage**:
- Stored in `User.ecoCoins` field
- Updated atomically with mission progress

### 4. **Image Processing**

**Library**: sharp
**Operations**:
- Resize: Max 1920x1920 (maintain aspect ratio)
- Compress: Quality 85%
- Format: JPEG/PNG preserved

**Duplicate Detection**:
- SHA-256 hash of image buffer
- Indexed database query for fast lookup
- Similarity threshold: 100% (exact match)

### 5. **Community Groups**

**Current State**: Static data with filtering
**Features**:
- Tag-based filtering
- Group cards with member count
- Placeholder chat rooms

**Future**: Real-time chat integration

---

## Security Considerations

### Authentication Security
- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ JWT tokens for stateless sessions
- ✅ HTTP-only cookies for session storage
- ✅ Server-side route protection

### File Upload Security
- ✅ File type validation (MIME type check)
- ✅ File size limits (10MB max)
- ✅ Secure file naming (user ID + timestamp + hash)
- ✅ Image processing to prevent malicious files

### Data Security
- ✅ SQL injection prevention (Prisma ORM)
- ✅ Input validation on API routes
- ✅ User authorization checks
- ✅ CORS configuration (Next.js default)

### Environment Variables
- `DATABASE_URL`: Database connection string
- `NEXTAUTH_SECRET`: JWT signing secret
- `NEXTAUTH_URL`: Application URL

---

## Deployment Architecture

### Recommended Stack

**Hosting**: Vercel (Next.js optimized)
**Database**: 
- Development: SQLite
- Production: PostgreSQL (recommended) or SQLite
**File Storage**:
- Development: Local file system
- Production: Cloud storage (AWS S3, Vercel Blob, etc.)

### Environment Configuration

```env
# Development
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_SECRET="[generated-secret]"
NEXTAUTH_URL="http://localhost:3000"

# Production
DATABASE_URL="[postgres-connection-string]"
NEXTAUTH_SECRET="[secure-random-secret]"
NEXTAUTH_URL="https://yourdomain.com"
```

### Build Process

```bash
# Install dependencies
npm install

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Build application
npm run build

# Start production server
npm start
```

### Scalability Considerations

1. **Database**: Migrate to PostgreSQL for production
2. **File Storage**: Use cloud storage (S3, Cloudinary)
3. **Image Processing**: Consider serverless functions or queue
4. **Caching**: Implement Redis for session storage
5. **CDN**: Use Vercel Edge Network for static assets

---

## Future Enhancements

### Planned Features
1. **Real-time Chat**: WebSocket integration for community groups
2. **Advanced Image Analysis**: AI/ML for mission verification
3. **Admin Dashboard**: Mission photo verification interface
4. **Enhanced Eco Locations**: Ratings, reviews, detailed info
5. **Social Features**: Post sharing, comments, likes
6. **Mobile App**: React Native or PWA

### Technical Improvements
1. **Database Migration**: PostgreSQL for production
2. **Caching Layer**: Redis for sessions and frequently accessed data
3. **Image CDN**: Cloud storage with CDN
4. **Monitoring**: Error tracking and analytics
5. **Testing**: Unit and integration tests
6. **CI/CD**: Automated deployment pipeline

---

## Conclusion

Dubai GaiaGro is built on a modern, scalable architecture using Next.js 16's App Router. The application follows best practices for security, performance, and maintainability. The modular structure allows for easy extension and enhancement of features.

**Key Strengths**:
- Type-safe codebase (TypeScript)
- Server-side rendering for performance
- Secure authentication and authorization
- Efficient image processing
- Scalable database design

**Areas for Growth**:
- Real-time features (chat)
- Advanced image analysis
- Cloud infrastructure migration
- Comprehensive testing suite

---

*Document Version: 1.0*  
*Last Updated: 2024*


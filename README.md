# AI Web Builder (Wix Clone)

An AI-powered website builder that allows users to quickly create and edit websites through drag-and-drop interface and AI-assisted content generation.

## Project Overview

AI Web Builder is a modern web application that combines a **visual editor** with **AI-powered content generation** capabilities. Users can leverage simple prompts to have AI generate professional content and styles for various sections of their websites, similar to modern website builders like Wix.

## Key Features

- 🎨 **Visual Editor** - Intuitive drag-and-drop interface for designing websites
- 🤖 **AI Content Generation** - Uses Google Gemini AI to intelligently generate website content and styles
- 📱 **Responsive Preview** - Supports three viewport modes: desktop, tablet, and mobile
- 🎯 **Element Management** - Supports various website element types (navbar, hero, text, images, buttons, features, footer, etc.)
- ⚙️ **Property Editing** - Real-time editing of element content and styles
- 🔐 **User Authentication** - JWT-based user authentication system
- 💾 **Data Persistence** - Uses Prisma ORM with SQLite database

## Tech Stack

### Frontend

- **Framework**: React 19.2
- **Build Tool**: Vite 6.2
- **Language**: TypeScript 5.8
- **Dependencies**: 
  - React DOM 19.2
  - Google GenAI SDK 1.30

### Backend

- **Framework**: Express 5.1
- **Database**: SQLite + Prisma ORM 5.22
- **Authentication**: JWT + bcryptjs
- **Email Service**: Nodemailer 7.0
- **Utilities**: Cookie Parser, CORS, UUID

## Project Structure

```
ai-web-builder/
├── App.tsx                    # Main application component
├── index.tsx                  # Application entry point
├── index.html                 # HTML template
├── types.ts                   # TypeScript type definitions
├── package.json               # Frontend dependencies
├── vite.config.ts             # Vite configuration
├── tsconfig.json              # TypeScript configuration
├── vercel.json                # Vercel deployment config
├── metadata.json              # Project metadata
│
├── components/                # React components
│   ├── EditorCanvas.tsx       # Editor canvas component
│   ├── Sidebar.tsx            # Sidebar (element selection)
│   ├── PropertiesPanel.tsx    # Properties editing panel
│   ├── Icons.tsx              # Icon components
│
├── services/                  # Service layer
│   └── geminiService.ts       # Google Gemini AI service
│
├── app/                       # App-related files
├── docs/                      # Documentation files
│
└── server/                    # Backend service
    ├── package.json           # Backend dependencies
    ├── tsconfig.json          # TypeScript configuration
    │
    ├── src/
    │   ├── index.ts           # Server entry point
    │   ├── jwt.ts             # JWT utilities
    │   ├── mail.ts            # Email service
    │   ├── prisma.ts          # Prisma client config
    │   │
    │   └── routes/
    │       └── auth.ts        # Authentication routes
    │
    └── prisma/
        ├── schema.prisma      # Prisma database schema
        └── migrations/        # Database migration files
```

## Supported Element Types

| Element Type | Description |
|-------------|-------------|
| `SECTION` | Generic container area |
| `HERO` | Hero section (large banner) |
| `TEXT_BLOCK` | Text block |
| `IMAGE` | Image element |
| `BUTTON` | Button element |
| `FEATURES` | Features list |
| `NAVBAR` | Navigation bar |
| `FOOTER` | Footer |

## Getting Started

### Frontend Development

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will run at `http://localhost:5173`

3. **Build Production Version**
   ```bash
   npm run build
   ```

4. **Preview Production Build**
   ```bash
   npm run preview
   ```

### Backend Development

1. **Navigate to Server Directory**
   ```bash
   cd server
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file with the following environment variables:
   ```
   DATABASE_URL="file:./dev.db"
   JWT_SECRET="your-secret-key"
   API_KEY="your-google-gemini-api-key"
   MAIL_USER="your-email@gmail.com"
   MAIL_PASS="your-app-password"
   ```

4. **Set Up Database**
   ```bash
   npm run prisma:migrate
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Open Prisma Studio (Visual Database Manager)**
   ```bash
   npm run prisma:studio
   ```

## Core Components

### EditorCanvas
- Main canvas for website preview and editing
- Supports element selection, deletion, and drag-to-reorder
- Real-time style updates

### Sidebar
- Provides selection of all available element types
- Supports AI prompt input
- Quick element addition

### PropertiesPanel
- Edit selected element's content and styles
- Supports basic CSS property modification
- Real-time preview of changes

### Gemini AI Service
- Integrates with Google Gemini 2.5 Flash model
- Generates professional website content based on user prompts
- Generates appropriate styles and color schemes

## API Features

### Authentication Routes (`/api/auth`)
- User registration/login
- JWT token management
- Secure password storage (bcryptjs)

### Email Service
- Account verification emails
- Password reset emails
- Nodemailer integration

## Deployment

The project is configured for Vercel deployment using the `vercel.json` file.

**Deployment Steps:**
1. Connect your GitHub repository to Vercel
2. Environment variables will be read from Vercel dashboard
3. Push to main branch to trigger automatic deployment

## Environment Variables

### Google Gemini API
- `API_KEY` - Google Gemini API key (get from https://ai.google.dev)

### Database
- `DATABASE_URL` - SQLite database connection string

### Authentication
- `JWT_SECRET` - JWT signing secret

### Email Service
- `MAIL_USER` - Gmail account
- `MAIL_PASS` - Gmail app password

## Development Tools

- **Package Manager**: npm
- **Code Language**: TypeScript/TSX
- **Formatting**: Built-in Vite support
- **Database Manager**: Prisma Studio

## Common Tasks

### Adding a New Element Type
1. Add new type to `ElementType` enum in `types.ts`
2. Define default values in `getDefaultContent()` and `getDefaultStyles()` in `App.tsx`
3. Add UI controls in `Sidebar.tsx`
4. Add rendering logic in `EditorCanvas.tsx`

### Modifying Database Schema
1. Edit `server/prisma/schema.prisma`
2. Run `npm run prisma:migrate`
3. Enter migration name

### Building Custom AI Prompts
- Modify `systemInstruction` and schema definition in `services/geminiService.ts`

## License

ISC

## Contributing

We welcome issue reports and pull requests!



# Notes App Frontend

A modern, responsive notes application built with React, Vite, and the Heming variable monotype font. This frontend integrates with a microservices backend to provide full user and notes management capabilities.

## Features

- **User Management**: Create and switch between multiple users
- **Notes CRUD**: Create, read, update, and delete notes
- **Real-time Updates**: All changes are immediately persisted to the backend
- **Pin Notes**: Pin important notes for quick access
- **Tag Support**: Organize notes with tags
- **Search**: Filter notes by title or content
- **Modern UI**: Clean design with the Heming monotype font
- **Responsive**: Works seamlessly on desktop, tablet, and mobile

## Technology Stack

- **React** 19.2.0
- **Vite** 7.2.4 (build tool)
- **Heming Font** (variable monotype)
- **Custom CSS** with modern design system
- **Nginx** (production deployment)

## Prerequisites

- Node.js 20+
- Backend services running (API Gateway at http://localhost:8080)
- MongoDB with notes-service and userservice

## Getting Started

### Development Mode

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file (optional):
```bash
# Copy from .env.example
cp .env.example .env
```

3. Start the development server:
```bash
npm run dev
```

The app will be available at http://localhost:5173

### Production Build

Build the application for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Docker Deployment

Build and run with Docker:
```bash
# From project root
docker-compose up -d frontend
```

Access at http://localhost:3000

## API Integration

The frontend communicates with backend microservices through the API Gateway:

### User Service
- **Base URL**: `http://localhost:8080/userservice/api/users`
- **Endpoints**:
  - `GET /` - Get all users
  - `POST /` - Create new user
  - `GET /{id}` - Get user by ID
  - `PUT /{id}` - Update user
  - `DELETE /{id}` - Delete user

### Notes Service
- **Base URL**: `http://localhost:8080/notes-service/api/notes`
- **Authentication**: Requires `X-User-Id` header
- **Endpoints**:
  - `GET /?page=0&size=100` - Get all notes (paginated)
  - `POST /` - Create new note
  - `GET /{id}` - Get note by ID
  - `PUT /{id}` - Update note
  - `DELETE /{id}` - Delete note

### API Service Layer

All API calls are handled through `src/services/api.js`:

```javascript
import api from './services/api'

// User operations
const users = await api.users.getAllUsers()
const user = await api.users.createUser({ firstName, lastName, email })

// Notes operations
const notes = await api.notes.getNotes(userId)
const note = await api.notes.createNote(userId, { title, content, tags, pinned, archived })
await api.notes.updateNote(userId, noteId, noteData)
await api.notes.deleteNote(userId, noteId)
```

## Project Structure

```
frontend/
├── src/
│   ├── services/
│   │   └── api.js          # API service layer
│   ├── App.jsx             # Main application component
│   ├── App.css             # Application styles
│   ├── index.css           # Global styles & design system
│   └── main.jsx            # Application entry point
├── public/                 # Static assets
├── Dockerfile              # Multi-stage Docker build
├── nginx.conf              # Nginx configuration
├── .dockerignore           # Docker ignore rules
├── .env.example            # Environment variables template
└── package.json            # Dependencies & scripts
```

## Environment Variables

- `VITE_API_BASE_URL`: Backend API Gateway URL (default: http://localhost:8080)

## Design System

The app uses a modern design system with CSS custom properties:

### Colors
- **Primary Background**: `#F8F9FA`
- **Secondary Background**: `#FFFFFF`
- **Accent**: `#7C3AED` (Purple)
- **Text Primary**: `#1F2937`
- **Text Secondary**: `#6B7280`

### Typography
- **Font**: Heming (variable monotype)
- **Fallback**: Courier New, monospace

## User Workflow

1. **First Time**: App prompts to create or select a user
2. **User Selection**: Click user avatar in sidebar to switch users
3. **Create Note**: Click the "+" button in the sidebar header
4. **Edit Note**: Click on any note to select and edit
5. **Search**: Use the search box to filter notes
6. **Pin**: Click the pin icon to keep important notes accessible
7. **Delete**: Click the trash icon to remove a note

## Error Handling

The app includes comprehensive error handling:
- Network errors display an error banner at the top
- Failed API calls show user-friendly error messages
- Automatic retry for transient failures
- Graceful degradation when backend is unavailable

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Style

- Follow React best practices
- Use functional components and hooks
- Keep components focused and single-purpose
- Use CSS custom properties for theming

## Deployment

### Docker Production Deployment

The app uses a multi-stage Docker build:

1. **Build Stage**: Node.js builds the React app
2. **Runtime Stage**: Nginx serves static files

The nginx configuration includes:
- Gzip compression
- Static asset caching
- Security headers
- API proxying to backend

Access the production app at http://localhost:3000

## Troubleshooting

### Backend Connection Issues
- Verify API Gateway is running at http://localhost:8080
- Check CORS settings in backend services
- Ensure all microservices are registered with Eureka

### User Not Found
- Ensure userservice is running and accessible
- Check MongoDB connection
- Verify data exists in `notesdb.users` collection

### Notes Not Loading
- Ensure notes-service is running
- Check `X-User-Id` header is being sent
- Verify user has permission to access notes

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Test thoroughly with backend services
4. Submit a pull request

## License

This project is part of the NotesApp microservices application.

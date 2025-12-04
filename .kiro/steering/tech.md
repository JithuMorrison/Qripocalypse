# Technology Stack

## Build System

- **Bundler**: Vite 7.x
- **Package Manager**: npm
- **Node Version**: 16+

## Frontend Stack

- **Framework**: React 19.1.1 (with React DOM)
- **Routing**: React Router DOM v7.9.1
- **Styling**: Tailwind CSS 4.1.17 with custom haunted theme CSS
- **Icons**: Lucide React 0.555.0
- **State Management**: React Context API (ProjectContext for global project state)

## Key Libraries

- **qrcode**: QR code generation (1.5.4)
- **react-qr-reader**: QR code scanning (3.0.0-beta-1)
- **react-webcam**: Camera access for QR scanning (7.2.0)

## Development Tools

- **Linter**: ESLint 9.x with React Hooks and React Refresh plugins
- **Type Checking**: None (pure JavaScript, no TypeScript)

## Storage & Authentication

- **Persistence**: localStorage for all data (users, projects, files, configurations, deployments)
- **Authentication**: Client-side with Web Crypto API (PBKDF2 password hashing, base64 session tokens)
- **No Backend**: Fully client-side application

## Common Commands

```bash
# Install dependencies
npm install

# Start development server (http://localhost:5173)
npm run dev

# Build for production
npm run build

# Preview production build
npm preview

# Run linter
npm run lint
```

## Browser Requirements

- Modern browser with Web Crypto API support
- localStorage enabled
- Camera access for QR scanning features

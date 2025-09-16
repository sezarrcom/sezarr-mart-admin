# Sezarr Mart Deployment Guide

## Digital Ocean Deployment - FIXED

### Prerequisites
- Node.js 18 or later
- npm or yarn package manager

### 🔧 CRITICAL: Environment Variables for Digital Ocean
Set these EXACTLY in your Digital Ocean App Platform environment variables:

```env
NODE_ENV=production
PORT=3000
```

**Optional (for future auth features):**
```env
NEXTAUTH_SECRET=your-super-secure-secret-key-minimum-32-characters
NEXTAUTH_URL=https://your-app-name.ondigitalocean.app
```

### Build Commands
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the application
npm start
```

### Port Configuration
The application runs on port 3000 by default. Make sure your Digital Ocean app is configured to use this port.

### Health Check
The application includes a health check endpoint at `/dashboard` which redirects from the root path.

### Troubleshooting

1. **Server Error 500**
   - Check environment variables are set correctly
   - Ensure Node.js version is 18+
   - Verify all dependencies are installed

2. **Build Failures**
   - Remove `.next` folder and rebuild
   - Check for TypeScript errors
   - Verify all imports are correct

3. **Redirect Issues**
   - The app uses client-side redirect from root to /dashboard
   - Ensure JavaScript is enabled in browser

### Digital Ocean Specific Settings

1. **Build Command**: `npm run build`
2. **Run Command**: `npm start`
3. **Node Version**: 18.x or later
4. **Port**: 3000 (default)

### Performance Tips
- The app is optimized with static generation
- Images are optimized by default
- Components are tree-shaken for smaller bundle size
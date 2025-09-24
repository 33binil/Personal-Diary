# Google Authentication Setup Guide

## Firebase Setup

To enable Google authentication for your Personal Diary app, you need to set up a Firebase project:

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name (e.g., "personal-diary")
4. Enable Google Analytics (optional)
5. Create the project

### 2. Enable Authentication

1. In your Firebase project, go to **Authentication** in the left sidebar
2. Click on the **Sign-in method** tab
3. Click on **Google** provider
4. Toggle **Enable** switch
5. Add your project support email
6. Click **Save**

### 3. Get Firebase Configuration

1. Go to **Project settings** (gear icon)
2. In the **General** tab, scroll down to **Your apps**
3. Click **Add app** and select **Web** (</> icon)
4. Register your app with a nickname (e.g., "diary-web")
5. Copy the Firebase configuration object

### 4. Update Configuration File

Replace the configuration in `src/config/firebase.js` with your Firebase config:

```javascript
const firebaseConfig = {
  apiKey: "your-actual-api-key",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789",
  appId: "your-actual-app-id"
};
```

### 5. Add Authorized Domains

1. In Firebase Console, go to **Authentication** > **Settings**
2. In the **Authorized domains** tab
3. Add your domain (e.g., `localhost` for development, your production domain for live app)

## Testing

After setup:
1. Run `npm run dev`
2. Navigate to `http://localhost:5174/login`
3. Click "Continue with Google"
4. Sign in with your Google account
5. You should be redirected to the home page with your user info displayed

## Security Notes

- Never commit your actual Firebase config to public repositories
- Consider using environment variables for sensitive config data
- Set up proper Firebase security rules for production use

## Features

✅ **Google OAuth Integration**: Secure sign-in with Google accounts
✅ **Protected Routes**: Only authenticated users can access the main app  
✅ **User Session Management**: Automatic login persistence
✅ **Responsive Design**: Beautiful UI on all device sizes
✅ **Error Handling**: Proper error messages and loading states
✅ **Logout Functionality**: Clean sign-out process
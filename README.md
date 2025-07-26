# BrewSpot - Coffee Location Sharing App

A React Native app built with Expo where users can check in at locations with their coffee and share photos.

## Features

- ✅ User authentication with Supabase
- ✅ Email/password sign up and sign in
- ✅ Coffee-themed UI with custom colors (browns, creams, sunset coral)
- ✅ Tab navigation for main app
- ✅ Profile management with sign out
- ✅ Platform-specific secure storage (SecureStore for native, AsyncStorage for web)
- ✅ Loading states and error handling
- ✅ Responsive keyboard handling
- ✅ Custom Inter font family

## Tech Stack

- Expo SDK 53
- React Native 0.79.5
- TypeScript with strict mode
- Expo Router for file-based navigation
- Supabase for authentication backend
- Expo Secure Store for secure token storage (native)
- AsyncStorage for web platform

## Setup Instructions

### 1. Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator

### 2. Clone and Install

```bash
# Clone the repository
git clone [your-repo-url]
cd keenan.molver-app

# Install dependencies
npm install
```

### 3. Configure Supabase

✅ **Note: Supabase credentials are already configured in this project.**

**Important**: Make sure Email Auth is enabled in your Supabase project:
- Go to Authentication → Providers in your Supabase dashboard
- Enable the Email provider

If you need to use your own Supabase instance:
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Go to Settings → API in your Supabase dashboard
4. Copy your Project URL and anon key
5. Update `src/services/supabase.ts` with your credentials
6. Enable Email Auth in Authentication → Providers

### 4. Run the App

```bash
# Start the development server
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android

# Run on web
npm run web
```

## Project Structure

```
app/
├── _layout.tsx         # Root layout with AuthProvider
├── index.tsx          # Entry point, handles auth routing
├── (auth)/            # Authentication screens
│   ├── _layout.tsx    # Auth stack navigator
│   ├── welcome.tsx    # Welcome screen with gradient
│   ├── sign-in.tsx    # Sign in screen
│   └── sign-up.tsx    # Sign up screen with validation
└── (tabs)/            # Main app screens
    ├── _layout.tsx    # Tab navigator
    ├── index.tsx      # Home feed (placeholder)
    └── profile.tsx    # User profile with sign out

src/
├── components/        # Reusable components
│   ├── auth/         # Auth-specific components
│   │   ├── AuthButton.tsx
│   │   └── AuthInput.tsx
│   └── common/       # Shared components
│       ├── LoadingScreen.tsx
│       └── ThemedView.tsx
├── services/         # External services
│   └── supabase.ts   # Supabase client with platform-specific storage
├── contexts/         # React contexts
│   └── AuthContext.tsx # Auth state management
├── constants/        # App constants
│   ├── Colors.ts     # Theme colors
│   └── Typography.ts # Font styles
└── types/           # TypeScript types
    └── auth.types.ts # Auth interfaces
```

## Available Scripts

- `npm start` - Start the Expo development server
- `npm run ios` - Run on iOS simulator
- `npm run android` - Run on Android emulator
- `npm run web` - Run in web browser
- `npm run lint` - Run ESLint

## Screens Preview

### Authentication Flow
1. **Welcome Screen** - Coffee-themed gradient background with sign in/sign up options
2. **Sign In Screen** - Email and password fields with forgot password link
3. **Sign Up Screen** - Registration with password confirmation and terms acceptance

### Main App
1. **Home Tab** - Feed placeholder (ready for coffee spot posts)
2. **Profile Tab** - User email display and sign out functionality

## Testing the App

1. **Create an Account**:
   - Tap "Create Account" on the welcome screen
   - Enter a valid email and password (min 6 characters)
   - Confirm your password
   - Check your email for verification link

2. **Sign In**:
   - Use your email and password
   - App remembers your session between launches
   - Automatic redirect to home tab after successful login

3. **Sign Out**:
   - Go to the Profile tab
   - Tap "Sign Out" button
   - Returns to welcome screen

## Known Issues & Solutions

- **Web Platform**: Uses AsyncStorage instead of SecureStore for compatibility
- **Email Verification**: Required by Supabase for new accounts
- **Session Persistence**: Works across app restarts on all platforms

## Next Steps

- [ ] Add password reset functionality
- [ ] Implement social login (Google, Apple)
- [ ] Create location check-in functionality
- [ ] Add photo upload capability
- [ ] Implement coffee spot feed
- [ ] Add location-based features
- [ ] Create user profiles with avatars
- [ ] Add favorites and ratings system
- [ ] Implement push notifications

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT

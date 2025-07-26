# BrewSpot Authentication Implementation Task

## Project Overview
Create a coffee location sharing app called "BrewSpot" where users can check in at locations with their coffee and share photos. This task covers the authentication setup with Supabase for an Expo TypeScript project using the app directory structure.

## Directory Structure
```
brewspot/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── (auth)/
│   │   ├── _layout.tsx
│   │   ├── welcome.tsx
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   └── (tabs)/
│       ├── _layout.tsx
│       ├── index.tsx
│       └── profile.tsx
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthInput.tsx
│   │   │   └── AuthButton.tsx
│   │   └── common/
│   │       ├── LoadingScreen.tsx
│   │       └── ThemedView.tsx
│   ├── services/
│   │   └── supabase.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── constants/
│   │   ├── Colors.ts
│   │   └── Typography.ts
│   └── types/
│       └── auth.types.ts
├── package.json
└── tsconfig.json
```

## Step 1: Initial Setup

```bash
# Install dependencies
npx expo install @supabase/supabase-js expo-secure-store @react-native-async-storage/async-storage expo-linear-gradient expo-font @expo-google-fonts/inter expo-router react-native-safe-area-context react-native-screens react-native-gesture-handler expo-status-bar
```

## Step 2: Configure TypeScript

**tsconfig.json**
```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Step 3: Create Constants

**src/constants/Colors.ts**
```typescript
export default {
  light: {
    primary: '#6F4E37',      // Coffee brown
    secondary: '#D4A574',    // Cream
    accent: '#FF6B6B',       // Sunset coral
    background: '#FFF8F3',   // Warm white
    surface: '#FFFFFF',
    text: '#2D2D2D',
    textLight: '#666666',
    border: '#E5E5E5',
    error: '#FF4444',
    success: '#4CAF50',
  },
  dark: {
    primary: '#8B6F47',
    secondary: '#D4A574',
    accent: '#FF6B6B',
    background: '#1A1A1A',
    surface: '#2D2D2D',
    text: '#FFFFFF',
    textLight: '#AAAAAA',
    border: '#3D3D3D',
    error: '#FF4444',
    success: '#4CAF50',
  }
}
```

**src/constants/Typography.ts**
```typescript
export default {
  h1: {
    fontSize: 32,
    fontWeight: '700' as const,
    fontFamily: 'Inter_700Bold',
  },
  h2: {
    fontSize: 24,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    fontFamily: 'Inter_400Regular',
  },
  button: {
    fontSize: 16,
    fontWeight: '600' as const,
    fontFamily: 'Inter_600SemiBold',
  },
}
```

## Step 4: Create Types

**src/types/auth.types.ts**
```typescript
export interface User {
  id: string;
  email: string;
  created_at?: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}
```

## Step 5: Setup Supabase

**src/services/supabase.ts**
```typescript
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const supabaseUrl = 'YOUR_SUPABASE_URL'
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
```

## Step 6: Create Auth Context

**src/contexts/AuthContext.tsx**
```typescript
import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { supabase } from '../services/supabase'
import { User, AuthContextType } from '../types/auth.types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user as User ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user as User ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({ email, password })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  const value = {
    user,
    loading,
    signUp,
    signIn,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
```

## Step 7: Create Components

**src/components/common/LoadingScreen.tsx**
```typescript
import { View, ActivityIndicator, StyleSheet } from 'react-native'
import Colors from '../../constants/Colors'

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.light.primary} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
  },
})
```

**src/components/common/ThemedView.tsx**
```typescript
import { View, ViewProps } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import Colors from '../../constants/Colors'

interface ThemedViewProps extends ViewProps {
  safe?: boolean
}

export default function ThemedView({ style, safe, ...props }: ThemedViewProps) {
  if (safe) {
    return (
      <SafeAreaView 
        style={[{ flex: 1, backgroundColor: Colors.light.background }, style]} 
        {...props} 
      />
    )
  }
  
  return (
    <View 
      style={[{ backgroundColor: Colors.light.background }, style]} 
      {...props} 
    />
  )
}
```

**src/components/auth/AuthInput.tsx**
```typescript
import { TextInput, View, Text, StyleSheet, TextInputProps } from 'react-native'
import Colors from '../../constants/Colors'
import Typography from '../../constants/Typography'

interface AuthInputProps extends TextInputProps {
  label: string
  error?: string
}

export default function AuthInput({ 
  label, 
  error,
  style,
  ...props 
}: AuthInputProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError, style]}
        placeholderTextColor={Colors.light.textLight}
        autoCapitalize="none"
        {...props}
      />
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    ...Typography.body,
    color: Colors.light.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    backgroundColor: Colors.light.surface,
    color: Colors.light.text,
  },
  inputError: {
    borderColor: Colors.light.error,
  },
  error: {
    color: Colors.light.error,
    fontSize: 12,
    marginTop: 4,
  },
})
```

**src/components/auth/AuthButton.tsx**
```typescript
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native'
import Colors from '../../constants/Colors'
import Typography from '../../constants/Typography'

interface AuthButtonProps extends TouchableOpacityProps {
  title: string
  loading?: boolean
  variant?: 'primary' | 'secondary'
}

export default function AuthButton({ 
  title, 
  loading, 
  variant = 'primary',
  style,
  ...props 
}: AuthButtonProps) {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        variant === 'secondary' && styles.secondaryButton,
        loading && styles.buttonDisabled,
        style
      ]}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? Colors.light.surface : Colors.light.primary} />
      ) : (
        <Text style={[styles.buttonText, variant === 'secondary' && styles.secondaryButtonText]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: Colors.light.primary,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    ...Typography.button,
    color: Colors.light.surface,
  },
  secondaryButtonText: {
    color: Colors.light.primary,
  },
})
```

## Step 8: Create App Layout

**app/_layout.tsx**
```typescript
import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import * as Font from 'expo-font'
import { 
  Inter_400Regular, 
  Inter_600SemiBold, 
  Inter_700Bold 
} from '@expo-google-fonts/inter'
import { AuthProvider } from '../src/contexts/AuthContext'
import LoadingScreen from '../src/components/common/LoadingScreen'

export default function RootLayout() {
  const [fontsLoaded, setFontsLoaded] = useState(false)

  useEffect(() => {
    async function loadFonts() {
      await Font.loadAsync({
        Inter_400Regular,
        Inter_600SemiBold,
        Inter_700Bold,
      })
      setFontsLoaded(true)
    }
    loadFonts()
  }, [])

  if (!fontsLoaded) {
    return <LoadingScreen />
  }

  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AuthProvider>
  )
}
```

**app/index.tsx**
```typescript
import { useEffect } from 'react'
import { useRouter } from 'expo-router'
import { useAuth } from '../src/contexts/AuthContext'
import LoadingScreen from '../src/components/common/LoadingScreen'

export default function Index() {
  const router = useRouter()
  const { user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace('/(tabs)')
      } else {
        router.replace('/(auth)/welcome')
      }
    }
  }, [user, loading])

  return <LoadingScreen />
}
```

## Step 9: Create Auth Screens

**app/(auth)/_layout.tsx**
```typescript
import { Stack } from 'expo-router'

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="welcome" />
      <Stack.Screen name="sign-in" />
      <Stack.Screen name="sign-up" />
    </Stack>
  )
}
```

**app/(auth)/welcome.tsx**
```typescript
import { View, Text, StyleSheet } from 'react-native'
import { Link } from 'expo-router'
import { LinearGradient } from 'expo-linear-gradient'
import ThemedView from '../../src/components/common/ThemedView'
import AuthButton from '../../src/components/auth/AuthButton'
import Colors from '../../src/constants/Colors'
import Typography from '../../src/constants/Typography'

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={[Colors.light.primary, Colors.light.secondary]}
      style={styles.gradient}
    >
      <ThemedView safe style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.logo}>☕</Text>
          <Text style={styles.title}>BrewSpot</Text>
          <Text style={styles.subtitle}>
            Share your coffee moments from anywhere
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Link href="/(auth)/sign-in" asChild>
            <AuthButton 
              title="Sign In" 
              style={styles.primaryButton}
            />
          </Link>

          <Link href="/(auth)/sign-up" asChild>
            <AuthButton 
              title="Create Account" 
              variant="secondary"
              style={styles.secondaryButton}
            />
          </Link>
        </View>
      </ThemedView>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    backgroundColor: 'transparent',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logo: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    ...Typography.h1,
    color: Colors.light.surface,
    marginBottom: 10,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.light.surface,
    textAlign: 'center',
    opacity: 0.9,
  },
  buttonContainer: {
    paddingHorizontal: 40,
    paddingBottom: 40,
  },
  primaryButton: {
    backgroundColor: Colors.light.surface,
    marginBottom: 16,
  },
  secondaryButton: {
    borderColor: Colors.light.surface,
  },
})
```

**app/(auth)/sign-in.tsx**
```typescript
import { useState } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import ThemedView from '../../src/components/common/ThemedView'
import AuthInput from '../../src/components/auth/AuthInput'
import AuthButton from '../../src/components/auth/AuthButton'
import { useAuth } from '../../src/contexts/AuthContext'
import Colors from '../../src/constants/Colors'
import Typography from '../../src/constants/Typography'

export default function SignInScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const router = useRouter()

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)

    if (error) {
      Alert.alert('Error', error.message)
    } else {
      router.replace('/(tabs)')
    }
  }

  return (
    <ThemedView safe style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.emoji}>☕</Text>
            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subtitle}>
              Sign in to share your coffee adventures
            </Text>
          </View>

          <View style={styles.form}>
            <AuthInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
            />

            <AuthInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              secureTextEntry
            />

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot password?</Text>
            </TouchableOpacity>

            <AuthButton
              title={loading ? 'Signing in...' : 'Sign In'}
              loading={loading}
              onPress={handleSignIn}
            />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/sign-up" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    ...Typography.h1,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.light.textLight,
    textAlign: 'center',
  },
  form: {
    marginBottom: 40,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    ...Typography.body,
    color: Colors.light.primary,
    fontSize: 14,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  footerText: {
    ...Typography.body,
    color: Colors.light.textLight,
  },
  footerLink: {
    ...Typography.body,
    color: Colors.light.primary,
    fontWeight: '600',
  },
})
```

**app/(auth)/sign-up.tsx**
```typescript
import { useState } from 'react'
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import ThemedView from '../../src/components/common/ThemedView'
import AuthInput from '../../src/components/auth/AuthInput'
import AuthButton from '../../src/components/auth/AuthButton'
import { useAuth } from '../../src/contexts/AuthContext'
import Colors from '../../src/constants/Colors'
import Typography from '../../src/constants/Typography'

export default function SignUpScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { signUp } = useAuth()
  const router = useRouter()

  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields')
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password)
    setLoading(false)

    if (error) {
      Alert.alert('Error', error.message)
    } else {
      Alert.alert(
        'Success!', 
        'Please check your email to verify your account',
        [{ text: 'OK', onPress: () => router.push('/(auth)/sign-in') }]
      )
    }
  }

  return (
    <ThemedView safe style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <Text style={styles.emoji}>🌟</Text>
            <Text style={styles.title}>Join BrewSpot</Text>
            <Text style={styles.subtitle}>
              Start sharing your coffee journey today
            </Text>
          </View>

          <View style={styles.form}>
            <AuthInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              keyboardType="email-address"
            />

            <AuthInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Create a password"
              secureTextEntry
            />

            <AuthInput
              label="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder="Confirm your password"
              secureTextEntry
            />

            <AuthButton
              title={loading ? 'Creating account...' : 'Create Account'}
              loading={loading}
              onPress={handleSignUp}
              style={styles.button}
            />

            <Text style={styles.terms}>
              By signing up, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Link href="/(auth)/sign-in" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  title: {
    ...Typography.h1,
    color: Colors.light.text,
    marginBottom: 8,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.light.textLight,
    textAlign: 'center',
  },
  form: {
    marginBottom: 40,
  },
  button: {
    marginTop: 24,
    marginBottom: 16,
  },
  terms: {
    ...Typography.body,
    fontSize: 12,
    color: Colors.light.textLight,
    textAlign: 'center',
    lineHeight: 18,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  footerText: {
    ...Typography.body,
    color: Colors.light.textLight,
  },
  footerLink: {
    ...Typography.body,
    color: Colors.light.primary,
    fontWeight: '600',
  },
})
```

## Step 10: Create Tab Screens

**app/(tabs)/_layout.tsx**
```typescript
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import Colors from '../../src/constants/Colors'

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.textLight,
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  )
}
```

**app/(tabs)/index.tsx**
```typescript
import { View, Text, StyleSheet } from 'react-native'
import ThemedView from '../../src/components/common/ThemedView'
import { useAuth } from '../../src/contexts/AuthContext'
import Colors from '../../src/constants/Colors'
import Typography from '../../src/constants/Typography'

export default function HomeScreen() {
  const { user } = useAuth()

  return (
    <ThemedView safe style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Good morning! ☕</Text>
        <Text style={styles.subtitle}>Ready to share your brew?</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.placeholder}>Feed coming soon...</Text>
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  greeting: {
    ...Typography.h2,
    color: Colors.light.text,
    marginBottom: 4,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.light.textLight,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    ...Typography.body,
    color: Colors.light.textLight,
  },
})
```

**app/(tabs)/profile.tsx**
```typescript
import { View, Text, StyleSheet } from 'react-native'
import ThemedView from '../../src/components/common/ThemedView'
import AuthButton from '../../src/components/auth/AuthButton'
import { useAuth } from '../../src/contexts/AuthContext'
import { useRouter } from 'expo-router'
import Colors from '../../src/constants/Colors'
import Typography from '../../src/constants/Typography'

export default function ProfileScreen() {
  const { user, signOut } = useAuth()
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut()
    router.replace('/(auth)/welcome')
  }

  return (
    <ThemedView safe style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>
      
      <View style={styles.content}>
        <View style={styles.profileSection}>
          <Text style={styles.emoji}>☕</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>
        
        <AuthButton
          title="Sign Out"
          variant="secondary"
          onPress={handleSignOut}
          style={styles.signOutButton}
        />
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
  },
  title: {
    ...Typography.h2,
    color: Colors.light.text,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 60,
  },
  emoji: {
    fontSize: 80,
    marginBottom: 20,
  },
  email: {
    ...Typography.body,
    color: Colors.light.textLight,
  },
  signOutButton: {
    marginTop: 'auto',
  },
})
```

## Setup Instructions

1. **Create Supabase Project**
    - Go to [supabase.com](https://supabase.com)
    - Create new project "brewspot"
    - Go to Settings → API
    - Copy Project URL and anon key
    - Enable Email Auth in Authentication → Providers

2. **Update Supabase Configuration**
    - Replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` in `src/services/supabase.ts`
    - Example:
      ```typescript
      const supabaseUrl = 'https://yourproject.supabase.co'
      const supabaseAnonKey = 'your-anon-key-here'
      ```

3. **Install dependencies** (if not already done)
   ```bash
   npm install
   ```

4. **Run the Project**
   ```bash
   npm start
   # or
   expo start
   ```

## Testing Checklist

- [ ] App loads with welcome screen
- [ ] Can navigate to sign in/sign up screens
- [ ] Sign up creates account and shows email verification message
- [ ] Sign in works with valid credentials
- [ ] Invalid credentials show error
- [ ] After sign in, redirects to home tab
- [ ] Profile tab shows user email
- [ ] Sign out returns to welcome screen
- [ ] App remembers login state on restart

## Design Features

- Coffee-themed color palette (browns, creams, sunset colors)
- Casual emoji usage (☕, 🌟)
- Smooth gradients on welcome screen
- Clean, modern input fields
- Responsive keyboard handling
- Loading states on all auth actions
- Error handling with user-friendly alerts
- Tab navigation for main app
- TypeScript for type safety

## Next Steps

1. Add password reset functionality
2. Implement social login (Google, Apple)
3. Add user profile setup after registration
4. Create location check-in functionality
5. Add photo upload capability
6. Implement coffee spot feed
7. Add location-based features
8. Create user profiles with avatars
9. Add favorites and ratings system
10. Implement push notifications
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
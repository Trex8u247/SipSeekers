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
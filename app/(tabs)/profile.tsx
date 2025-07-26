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
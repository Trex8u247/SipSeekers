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
  }, [user, loading, router])

  return <LoadingScreen />
}

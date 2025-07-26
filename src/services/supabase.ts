import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { Platform } from 'react-native'

const supabaseUrl = 'https://ytpauvgilyhbpogdxpqj.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl0cGF1dmdpbHloYnBvZ2R4cHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM1NTQ4MjgsImV4cCI6MjA2OTEzMDgyOH0.WH1K37zFWgXFNJvFQdWCtobfe_ksLcS6yTgaRfVkvd4'

// Use SecureStore for native platforms and AsyncStorage for web
const ExpoSecureStoreAdapter = {
  getItem: async (key: string) => {
    if (Platform.OS === 'web') {
      try {
        const item = await AsyncStorage.getItem(key)
        return item
      } catch (error) {
        console.error('Error getting item:', error)
        return null
      }
    } else {
      try {
        const item = await SecureStore.getItemAsync(key)
        return item
      } catch (error) {
        console.error('Error getting item:', error)
        return null
      }
    }
  },
  setItem: async (key: string, value: string) => {
    if (Platform.OS === 'web') {
      try {
        await AsyncStorage.setItem(key, value)
      } catch (error) {
        console.error('Error setting item:', error)
      }
    } else {
      try {
        await SecureStore.setItemAsync(key, value)
      } catch (error) {
        console.error('Error setting item:', error)
      }
    }
  },
  removeItem: async (key: string) => {
    if (Platform.OS === 'web') {
      try {
        await AsyncStorage.removeItem(key)
      } catch (error) {
        console.error('Error removing item:', error)
      }
    } else {
      try {
        await SecureStore.deleteItemAsync(key)
      } catch (error) {
        console.error('Error removing item:', error)
      }
    }
  },
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: ExpoSecureStoreAdapter,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
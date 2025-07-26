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
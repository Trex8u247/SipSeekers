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
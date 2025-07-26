// index.tsx
import React, { useState } from "react";
import { registerRootComponent } from "expo";
import {
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

const HomeScreen: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      Alert.alert("Login Successful", `Welcome back, ${email}`);
      // You could navigate or trigger more logic here
    } else {
      Alert.alert("Login Error", "Please fill in both fields");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <Text style={styles.title}>Welcome to Sip Seekers ☕🌍</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button title="Login" onPress={handleLogin} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fdfdfd",
  },
  title: {
    fontSize: 22,
    textAlign: "center",
    marginBottom: 30,
    fontWeight: "600",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
});

registerRootComponent(HomeScreen);

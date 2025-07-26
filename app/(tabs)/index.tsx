import { View, Text, StyleSheet } from "react-native";
import ThemedView from "../../src/components/common/ThemedView";
import Colors from "../../src/constants/Colors";
import Typography from "../../src/constants/Typography";

export default function HomeScreen() {
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.light.border,
    justifyContent: "center",
    alignItems: "center",
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
    justifyContent: "center",
    alignItems: "center",
  },
  placeholder: {
    ...Typography.body,
    color: Colors.light.textLight,
  },
});


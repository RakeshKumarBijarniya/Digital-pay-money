import { Stack } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

const History = () => {
  return (
    <View style={styles.container}>
      {/* This ensures no header is shown */}
      <Stack.Screen options={{ headerShown: false }} />

      <Text style={styles.text}>📜 History Screen</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "yellow",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
  },
});

export default History;

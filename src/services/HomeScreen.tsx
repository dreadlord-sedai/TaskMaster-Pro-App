import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface HomeScreenProps {
  navigation: any;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TaskTarget</Text>
      <Text style={styles.subtitle}>Aim, plan, and finish with clarity</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("TodoList")}
      >
        <Text style={styles.buttonText}>View My Tasks</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F1E9",
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#0F4C5C",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#5C7A89",
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#E36414",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "600",
  },
});

export default HomeScreen;

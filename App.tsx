import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import TodoListScreen from "./src/screens/TodoList";
import AddEditTaskScreen from "./src/screens/AddEditTaskScreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "TaskTarget" }}
        />
        <Stack.Screen
          name="TodoList"
          component={TodoListScreen}
          options={{ title: "My Tasks" }}
        />
        <Stack.Screen
          name="AddEditTask"
          component={AddEditTaskScreen}
          options={{ title: "Task Details" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from "react-native";
import { Task } from "../types/task";
import { fetchAllTasks, deleteTask, updateTaskStatus } from "../services/api";

interface TodoListScreenProps {
  navigation: any; // Replace with proper NavigationProp type
}

/**
 * TodoList Screen Component
 *
 * Displays all tasks in a FlatList with the following features:
 * - Pull-to-refresh functionality
 * - Delete task action
 * - Toggle task completion status
 * - Navigate to Add/Edit screen
 *
 * Uses React Hooks:
 * - useState: Manage tasks list, loading state, and refreshing state
 * - useEffect: Fetch tasks when component mounts
 */
const TodoListScreen: React.FC<TodoListScreenProps> = ({ navigation }) => {
  // State management using useState hook
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  /**
   * useEffect hook to fetch tasks when component mounts.
   * Dependency array is empty [], so this runs only once on mount.
   */
  useEffect(() => {
    loadTasks();
  }, []);

  /**
   * Function to fetch all tasks from the backend API.
   * Sets loading state while fetching.
   */
  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await fetchAllTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error loading tasks:", error);
      Alert.alert("Error", "Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Pull-to-refresh handler.
   * Called when user pulls down the FlatList.
   */
  const onRefresh = async () => {
    setRefreshing(true);
    await loadTasks();
    setRefreshing(false);
  };

  /**
   * Handle task deletion with confirmation dialog.
   *
   * @param taskId - ID of the task to delete
   */
  const handleDeleteTask = (taskId: number | undefined) => {
    if (!taskId) return;

    Alert.alert("Delete Task", "Are you sure you want to delete this task?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const success = await deleteTask(taskId);
            if (success) {
              // Remove task from local state
              setTasks((prevTasks) =>
                prevTasks.filter((task) => task.id !== taskId),
              );
              Alert.alert("Success", "Task deleted successfully");
            } else {
              Alert.alert("Error", "Failed to delete task");
            }
          } catch (error) {
            console.error("Error deleting task:", error);
            Alert.alert("Error", "An error occurred while deleting the task");
          }
        },
      },
    ]);
  };

  /**
   * Toggle task completion status.
   *
   * @param task - Task object to toggle
   */
  const handleToggleComplete = async (task: Task) => {
    if (!task.id) return;

    try {
      const newStatus = !task.is_completed;
      const success = await updateTaskStatus(task.id, newStatus);

      if (success) {
        // Update task in local state
        setTasks((prevTasks) =>
          prevTasks.map((t) =>
            t.id === task.id ? { ...t, is_completed: newStatus } : t,
          ),
        );
      } else {
        Alert.alert("Error", "Failed to update task status");
      }
    } catch (error) {
      console.error("Error updating task:", error);
      Alert.alert("Error", "An error occurred while updating the task");
    }
  };

  /**
   * Navigate to Add/Edit Task Screen.
   *
   * @param task - Optional task to edit (undefined for new task)
   */
  const navigateToAddEdit = (task?: Task) => {
    navigation.navigate("AddEditTask", {
      task,
      onTaskSaved: loadTasks, // Callback to refresh list after save
    });
  };

  /**
   * Render individual task item.
   * This function is passed to FlatList's renderItem prop.
   *
   * @param item - Task object
   */
  const renderTaskItem = ({ item }: { item: Task }) => (
    <View style={styles.taskItem}>
      {/* Left section: Checkbox and task details */}
      <View style={styles.taskContent}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => handleToggleComplete(item)}
        >
          <View
            style={[
              styles.checkboxInner,
              item.is_completed && styles.checkboxChecked,
            ]}
          >
            {item.is_completed && <Text style={styles.checkmark}>✓</Text>}
          </View>
        </TouchableOpacity>

        <View style={styles.taskDetails}>
          <Text
            style={[
              styles.taskTitle,
              item.is_completed && styles.taskTitleCompleted,
            ]}
          >
            {item.title}
          </Text>
          <Text style={styles.taskDate}>
            Created: {formatDate(item.created_date)}
          </Text>
        </View>
      </View>

      {/* Right section: Action buttons */}
      <View style={styles.taskActions}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigateToAddEdit(item)}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteTask(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  /**
   * Format date string to readable format.
   *
   * @param dateString - ISO date string (YYYY-MM-DD)
   * @returns Formatted date string (MMM DD, YYYY)
   */
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  /**
   * Render empty list component when no tasks exist.
   */
  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>No tasks yet!</Text>
      <Text style={styles.emptySubtext}>
        Tap the + button to create your first task
      </Text>
    </View>
  );

  /**
   * Show loading indicator while fetching tasks.
   */
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#E36414" />
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Tasks</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigateToAddEdit()}
        >
          <Text style={styles.addButtonText}>+ Add Task</Text>
        </TouchableOpacity>
      </View>

      {/* Task List using FlatList */}
      <FlatList
        data={tasks}
        renderItem={renderTaskItem}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyList}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#007AFF"
          />
        }
      />
    </View>
  );
};

/**
 * StyleSheet for TodoListScreen component.
 * Using ONLY built-in StyleSheet API - NO third-party libraries.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F1E9",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#FFF8F2",
    borderBottomWidth: 1,
    borderBottomColor: "#E7DFD6",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#0F4C5C",
  },
  addButton: {
    backgroundColor: "#E36414",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  listContent: {
    paddingVertical: 8,
    flexGrow: 1,
  },
  taskItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxInner: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#0F4C5C",
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#0F4C5C",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  taskDetails: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1F2A33",
    marginBottom: 4,
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: "#999999",
  },
  taskDate: {
    fontSize: 12,
    color: "#5C7A89",
  },
  taskActions: {
    flexDirection: "row",
    gap: 8,
  },
  editButton: {
    backgroundColor: "#2A9D8F",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  editButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  deleteButton: {
    backgroundColor: "#D1495B",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#5C7A89",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#B7AFA6",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F6F1E9",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#5C7A89",
  },
});

export default TodoListScreen;

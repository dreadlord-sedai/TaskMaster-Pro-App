import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Task } from "../types/task";
import { saveTask, updateTask } from "../services/api";

interface AddEditTaskScreenProps {
  navigation: any;
  route: any;
}

/**
 * Add/Edit Task Screen Component
 *
 * Handles both creating new tasks and editing existing tasks.
 * Demonstrates form validation and API integration.
 */
const AddEditTaskScreen: React.FC<AddEditTaskScreenProps> = ({
  navigation,
  route,
}) => {
  // Get task from navigation params (undefined for new task)
  const { task, onTaskSaved } = route.params || {};
  const isEditMode = !!task;

  /**
   * useState hooks for form fields.
   * Initialize with existing task data if editing, empty strings if creating.
   */
  const [title, setTitle] = useState<string>(task?.title || "");
  const [description, setDescription] = useState<string>(
    task?.description || "",
  );
  const [saving, setSaving] = useState<boolean>(false);

  /**
   * Set navigation header title based on mode.
   */
  useEffect(() => {
    navigation.setOptions({
      title: isEditMode ? "Edit Task" : "Add New Task",
    });
  }, [isEditMode, navigation]);

  /**
   * Validate form inputs.
   *
   * @returns boolean - true if all validations pass
   */
  const validateForm = (): boolean => {
    if (title.trim().length === 0) {
      Alert.alert("Validation Error", "Please enter a task title");
      return false;
    }

    if (title.trim().length > 255) {
      Alert.alert("Validation Error", "Title must be less than 255 characters");
      return false;
    }

    return true;
  };

  /**
   * Handle save button press.
   * Demonstrates complete save workflow with fetch API.
   */
  const handleSave = async () => {
    // Validate form first
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);

      const taskToSave: Task = {
        id: task?.id,
        title: title.trim(),
        description: description.trim(),
        created_date:
          task?.created_date || new Date().toISOString().split("T")[0],
        is_completed: task?.is_completed ?? false,
      };

      const savedTask = isEditMode
        ? await updateTask(taskToSave)
        : await saveTask({
            title: taskToSave.title,
            description: taskToSave.description,
            created_date: taskToSave.created_date,
            is_completed: taskToSave.is_completed,
          });

      console.log("Task saved with ID:", savedTask.id);

      // Show success message
      Alert.alert("Success", "Task saved successfully!", [
        {
          text: "OK",
          onPress: () => {
            // Refresh the task list
            if (onTaskSaved) {
              onTaskSaved();
            }
            // Navigate back to list
            navigation.goBack();
          },
        },
      ]);
    } catch (error) {
      console.error("Error saving task:", error);
      Alert.alert(
        "Error",
        "Failed to save task. Please check your connection and try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Title Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Title <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter task title"
            placeholderTextColor="#999999"
            value={title}
            onChangeText={setTitle}
            maxLength={255}
            autoCapitalize="sentences"
            returnKeyType="next"
          />
          <Text style={styles.charCount}>{title.length}/255</Text>
        </View>

        {/* Description Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Enter task description (optional)"
            placeholderTextColor="#999999"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            autoCapitalize="sentences"
          />
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton]}
            onPress={() => navigation.goBack()}
            disabled={saving}
          >
            <Text style={styles.cancelButtonText}>Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.saveButton,
              saving && styles.buttonDisabled,
            ]}
            onPress={handleSave}
            disabled={saving}
          >
            <Text style={styles.saveButtonText}>
              {saving ? "Saving..." : "Save Task"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

/**
 * StyleSheet for AddEditTaskScreen component.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F1E9",
  },
  scrollContent: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0F4C5C",
    marginBottom: 8,
  },
  required: {
    color: "#D1495B",
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7DFD6",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2A33",
  },
  textArea: {
    minHeight: 120,
    paddingTop: 12,
  },
  charCount: {
    fontSize: 12,
    color: "#8C8379",
    textAlign: "right",
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 32,
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E7DFD6",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#5C7A89",
  },
  saveButton: {
    backgroundColor: "#E36414",
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#FFFFFF",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});

export default AddEditTaskScreen;

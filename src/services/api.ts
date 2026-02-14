import { Task } from "../types/task";

// IMPORTANT: Replace with your computer's IP address
// Find it using: ipconfig (Windows) or ifconfig (Mac/Linux)
const API_BASE_URL = "http://192.168.56.1:8080/api"; // Change this IP!

const normalizeTask = (task: any): Task => {
  return {
    id: task.id,
    title: task.title ?? "",
    description: task.description ?? "",
    created_date: task.created_date ?? task.createdDate ?? "",
    is_completed: task.is_completed ?? task.isCompleted ?? false,
  };
};

export const fetchAllTasks = async (): Promise<Task[]> => {
  try {
    console.log("Fetching tasks from:", API_BASE_URL);
    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawTasks: any[] = await response.json();
    const tasks: Task[] = rawTasks.map(normalizeTask);
    console.log("Fetched tasks:", tasks);
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const saveTask = async (task: Omit<Task, "id">): Promise<Task> => {
  try {
    console.log("Saving task:", task);
    const response = await fetch(`${API_BASE_URL}/tasks/save`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawTask = await response.json();
    const savedTask: Task = normalizeTask(rawTask);
    console.log("Task saved:", savedTask);
    return savedTask;
  } catch (error) {
    console.error("Error saving task:", error);
    throw error;
  }
};

export const updateTaskStatus = async (
  taskId: number,
  isCompleted: boolean,
): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: taskId,
        is_completed: isCompleted,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const updateTask = async (task: Task): Promise<Task> => {
  try {
    console.log("Updating task:", task);
    const response = await fetch(`${API_BASE_URL}/tasks/edit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const rawTask = await response.json();
    const savedTask: Task = normalizeTask(rawTask);
    console.log("Task updated:", savedTask);
    return savedTask;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTask = async (taskId: number): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/tasks/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: taskId,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.success === true;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

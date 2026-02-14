package com.taskmaster.server;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.JsonObject;
import com.taskmaster.dao.TaskDAO;
import com.taskmaster.model.Task;
import com.taskmaster.util.HibernateUtil;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;

/**
 * Simple HTTP Server for TaskMaster Pro API.
 * Uses Java SE HttpServer to handle REST API requests.
 */
public class TaskServer {
    
    private static final Gson gson = new GsonBuilder()
            .registerTypeAdapter(LocalDate.class, new LocalDateAdapter())
            .create();
    
    private static final TaskDAO taskDAO = new TaskDAO();
    
    public static void main(String[] args) throws IOException {
        // Create HTTP server on port 8080
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        // Define endpoints
        server.createContext("/api/tasks", TaskServer::handleTasks);
        server.createContext("/api/tasks/save", TaskServer::handleSaveTask);
        server.createContext("/api/tasks/update", TaskServer::handleUpdateTask);
        server.createContext("/api/tasks/delete", TaskServer::handleDeleteTask);
        
        // Set executor and start server
        server.setExecutor(null);
        server.start();
        
        System.out.println("TaskMaster Pro Server started on port 8080");
        System.out.println("Available endpoints:");
        System.out.println("  GET  /api/tasks - Fetch all tasks");
        System.out.println("  POST /api/tasks/save - Save a new task");
        System.out.println("  POST /api/tasks/update - Update task status");
        System.out.println("  POST /api/tasks/delete - Delete a task");
        
        // Add shutdown hook
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            System.out.println("\nShutting down server...");
            server.stop(0);
            HibernateUtil.shutdown();
        }));
    }
    
    /**
     * Handle GET request to fetch all tasks.
     */
    private static void handleTasks(HttpExchange exchange) throws IOException {
        if ("GET".equals(exchange.getRequestMethod())) {
            // Fetch all tasks
            List<Task> tasks = taskDAO.getAllTasks();
            
            // Convert to JSON
            String jsonResponse = gson.toJson(tasks);
            
            // Send response
            sendJsonResponse(exchange, 200, jsonResponse);
        } else {
            sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
        }
    }
    
    /**
     * Handle POST request to save a new task.
     */
    private static void handleSaveTask(HttpExchange exchange) throws IOException {
        if ("POST".equals(exchange.getRequestMethod())) {
            // Read request body
            String requestBody = readRequestBody(exchange);
            
            // Parse JSON to Task object
            Task task = gson.fromJson(requestBody, Task.class);
            
            // Ensure created_date is set
            if (task.getCreatedDate() == null) {
                task.setCreatedDate(LocalDate.now());
            }
            
            // Save task
            Task savedTask = taskDAO.saveTask(task);
            
            // Send response
            String jsonResponse = gson.toJson(savedTask);
            sendJsonResponse(exchange, 201, jsonResponse);
        } else {
            sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
        }
    }
    
    /**
     * Handle POST request to update task status.
     */
    private static void handleUpdateTask(HttpExchange exchange) throws IOException {
        if ("POST".equals(exchange.getRequestMethod())) {
            // Read request body
            String requestBody = readRequestBody(exchange);
            JsonObject jsonObject = gson.fromJson(requestBody, JsonObject.class);
            
            Integer taskId = jsonObject.get("id").getAsInt();
            Boolean isCompleted = jsonObject.get("is_completed").getAsBoolean();
            
            // Update task
            boolean success = taskDAO.updateTaskStatus(taskId, isCompleted);
            
            // Send response
            String jsonResponse = success 
                ? "{\"success\":true,\"message\":\"Task updated successfully\"}"
                : "{\"success\":false,\"message\":\"Task not found\"}";
            
            sendJsonResponse(exchange, success ? 200 : 404, jsonResponse);
        } else {
            sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
        }
    }
    
    /**
     * Handle POST request to delete a task.
     */
    private static void handleDeleteTask(HttpExchange exchange) throws IOException {
        if ("POST".equals(exchange.getRequestMethod())) {
            // Read request body
            String requestBody = readRequestBody(exchange);
            JsonObject jsonObject = gson.fromJson(requestBody, JsonObject.class);
            
            Integer taskId = jsonObject.get("id").getAsInt();
            
            // Delete task
            boolean success = taskDAO.deleteTask(taskId);
            
            // Send response
            String jsonResponse = success 
                ? "{\"success\":true,\"message\":\"Task deleted successfully\"}"
                : "{\"success\":false,\"message\":\"Task not found\"}";
            
            sendJsonResponse(exchange, success ? 200 : 404, jsonResponse);
        } else {
            sendJsonResponse(exchange, 405, "{\"error\":\"Method not allowed\"}");
        }
    }
    
    /**
     * Helper method to read request body.
     */
    private static String readRequestBody(HttpExchange exchange) throws IOException {
        InputStream inputStream = exchange.getRequestBody();
        BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, StandardCharsets.UTF_8));
        StringBuilder requestBody = new StringBuilder();
        String line;
        
        while ((line = reader.readLine()) != null) {
            requestBody.append(line);
        }
        
        return requestBody.toString();
    }
    
    /**
     * Helper method to send JSON response.
     */
    private static void sendJsonResponse(HttpExchange exchange, int statusCode, String response) throws IOException {
        // Set CORS headers
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
        
        byte[] responseBytes = response.getBytes(StandardCharsets.UTF_8);
        exchange.sendResponseHeaders(statusCode, responseBytes.length);
        
        OutputStream outputStream = exchange.getResponseBody();
        outputStream.write(responseBytes);
        outputStream.close();
    }
}
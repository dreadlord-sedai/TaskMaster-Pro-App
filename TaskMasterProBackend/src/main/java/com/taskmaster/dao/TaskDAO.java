package com.taskmaster.dao;

import com.taskmaster.model.Task;
import com.taskmaster.util.HibernateUtil;
import org.hibernate.Session;
import org.hibernate.Transaction;
import org.hibernate.query.Query;

import java.util.ArrayList;
import java.util.List;

/**
 * Data Access Object for Task entity.
 * Handles all database operations using Hibernate.
 */
public class TaskDAO {
    
    /**
     * Fetch all tasks from the database.
     * 
     * @return List of all tasks
     */
    public List<Task> getAllTasks() {
        List<Task> tasks = new ArrayList<>();
        Transaction transaction = null;
        
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            // Start transaction
            transaction = session.beginTransaction();
            
            // HQL query to fetch all tasks
            Query<Task> query = session.createQuery("FROM Task ORDER BY createdDate DESC", Task.class);
            tasks = query.list();
            
            // Commit transaction
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
        
        return tasks;
    }
    
    /**
     * Save a new task to the database.
     * 
     * @param task Task object to save
     * @return Saved task with generated ID
     */
    public Task saveTask(Task task) {
        Transaction transaction = null;
        
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            
            // Save the task (Hibernate generates ID automatically)
            session.save(task);
            
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
        
        return task;
    }
    
    /**
     * Update an existing task's status.
     * 
     * @param taskId ID of the task to update
     * @param isCompleted New completion status
     * @return true if update was successful
     */
    public boolean updateTaskStatus(Integer taskId, Boolean isCompleted) {
        Transaction transaction = null;
        boolean success = false;
        
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            
            // Fetch the task by ID
            Task task = session.get(Task.class, taskId);
            
            if (task != null) {
                task.setIsCompleted(isCompleted);
                session.update(task);
                success = true;
            }
            
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
        
        return success;
    }

    /**
     * Update an existing task's details (title/description/date/completion).
     *
     * @param updatedTask Task object containing updated fields and an id
     * @return Updated task, or null if not found
     */
    public Task updateTask(Task updatedTask) {
        if (updatedTask == null || updatedTask.getId() == null) {
            return null;
        }

        Transaction transaction = null;
        Task existingTask = null;

        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();

            existingTask = session.get(Task.class, updatedTask.getId());

            if (existingTask != null) {
                existingTask.setTitle(updatedTask.getTitle());
                existingTask.setDescription(updatedTask.getDescription());

                if (updatedTask.getCreatedDate() != null) {
                    existingTask.setCreatedDate(updatedTask.getCreatedDate());
                }

                if (updatedTask.getIsCompleted() != null) {
                    existingTask.setIsCompleted(updatedTask.getIsCompleted());
                }

                session.update(existingTask);
            }

            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
            return null;
        }

        return existingTask;
    }
    
    /**
     * Delete a task from the database.
     * 
     * @param taskId ID of the task to delete
     * @return true if deletion was successful
     */
    public boolean deleteTask(Integer taskId) {
        Transaction transaction = null;
        boolean success = false;
        
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            transaction = session.beginTransaction();
            
            // Fetch and delete the task
            Task task = session.get(Task.class, taskId);
            
            if (task != null) {
                session.delete(task);
                success = true;
            }
            
            transaction.commit();
        } catch (Exception e) {
            if (transaction != null) {
                transaction.rollback();
            }
            e.printStackTrace();
        }
        
        return success;
    }
    
    /**
     * Get a single task by ID.
     * 
     * @param taskId ID of the task
     * @return Task object or null if not found
     */
    public Task getTaskById(Integer taskId) {
        Task task = null;
        
        try (Session session = HibernateUtil.getSessionFactory().openSession()) {
            task = session.get(Task.class, taskId);
        } catch (Exception e) {
            e.printStackTrace();
        }
        
        return task;
    }
}
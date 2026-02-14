package com.taskmaster.model;

import javax.persistence.*;
import java.time.LocalDate;

/**
 * Task Entity representing the tasks table in MySQL database.
 * This class uses Hibernate annotations to map Java objects to database records.
 */
@Entity
@Table(name = "tasks")
public class Task {
    
    /**
     * Primary key field with auto-increment strategy.
     * GenerationType.IDENTITY is used for MySQL AUTO_INCREMENT columns.
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    
    /**
     * Task title field - required, max 255 characters.
     */
    @Column(name = "title", nullable = false, length = 255)
    private String title;
    
    /**
     * Task description field - optional, can store large text.
     * @Lob annotation indicates this is a Large Object (TEXT in MySQL).
     */
    @Lob
    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
    
    /**
     * Date when the task was created.
     * Uses LocalDate to match MySQL DATE type.
     */
    @Column(name = "created_date", nullable = false)
    private LocalDate createdDate;
    
    /**
     * Boolean flag indicating if task is completed.
     * Defaults to false in database schema.
     */
    @Column(name = "is_completed", nullable = false)
    private Boolean isCompleted;
    
    // Constructors
    
    /**
     * Default no-argument constructor required by Hibernate.
     */
    public Task() {
        this.isCompleted = false;
        this.createdDate = LocalDate.now();
    }
    
    /**
     * Parameterized constructor for easy object creation.
     */
    public Task(String title, String description, LocalDate createdDate, Boolean isCompleted) {
        this.title = title;
        this.description = description;
        this.createdDate = createdDate;
        this.isCompleted = isCompleted;
    }
    
    // Getters and Setters
    
    public Integer getId() {
        return id;
    }
    
    public void setId(Integer id) {
        this.id = id;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public LocalDate getCreatedDate() {
        return createdDate;
    }
    
    public void setCreatedDate(LocalDate createdDate) {
        this.createdDate = createdDate;
    }
    
    public Boolean getIsCompleted() {
        return isCompleted;
    }
    
    public void setIsCompleted(Boolean isCompleted) {
        this.isCompleted = isCompleted;
    }
    
    // toString method for debugging
    @Override
    public String toString() {
        return "Task{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", description='" + description + '\'' +
                ", createdDate=" + createdDate +
                ", isCompleted=" + isCompleted +
                '}';
    }
}
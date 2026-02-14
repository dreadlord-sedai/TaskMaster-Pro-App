package com.taskmaster.util;

import org.hibernate.SessionFactory;
import org.hibernate.cfg.Configuration;

/**
 * Utility class to manage Hibernate SessionFactory.
 * Implements Singleton pattern to ensure only one SessionFactory exists.
 */
public class HibernateUtil {
    
    private static SessionFactory sessionFactory;
    
    /**
     * Private constructor to prevent instantiation.
     */
    private HibernateUtil() {}
    
    /**
     * Get the SessionFactory instance.
     * Creates it if it doesn't exist (lazy initialization).
     * 
     * @return SessionFactory instance
     */
    public static SessionFactory getSessionFactory() {
        if (sessionFactory == null) {
            try {
                // Create SessionFactory from hibernate.cfg.xml
                Configuration configuration = new Configuration();
                configuration.configure("hibernate.cfg.xml");
                sessionFactory = configuration.buildSessionFactory();
                
                System.out.println("SessionFactory created successfully!");
            } catch (Exception e) {
                System.err.println("Failed to create SessionFactory: " + e.getMessage());
                e.printStackTrace();
                throw new ExceptionInInitializerError(e);
            }
        }
        return sessionFactory;
    }
    
    /**
     * Close the SessionFactory when application shuts down.
     * Call this method during application cleanup.
     */
    public static void shutdown() {
        if (sessionFactory != null && !sessionFactory.isClosed()) {
            sessionFactory.close();
            System.out.println("SessionFactory closed successfully!");
        }
    }
}
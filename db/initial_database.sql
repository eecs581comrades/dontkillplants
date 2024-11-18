-- Name of code artifact: All of them
-- Description: Initial database definition in SQL for the dontkillplants database.
-- Name(s): William Johnson, Matthew Petillo
-- Date Created: 10-23-24
-- Dates Revised: 10-27-24
-- Brief description of each revision & author:
-- -- Revision: Added user and simulations tables; Author: Matthew Petillo


-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS dontkillplants;

-- Use the database
USE dontkillplants;

-- Drop the tables if they exist to avoid conflicts during creation
DROP TABLE IF EXISTS `plants`;
DROP TABLE IF EXISTS `simulations`;
DROP TABLE IF EXISTS `user_pass_combo`;

-- Create the `plants` table with FULLTEXT indexes on searchable fields
CREATE TABLE `plants` (
  `plant_id` int NOT NULL AUTO_INCREMENT,
  `plant_common_name` text DEFAULT NULL,
  `plant_scientific_name` text DEFAULT NULL,
  `watering_frequency` text DEFAULT NULL,
  `watering_frequency_int` int DEFAULT NULL,
  `watering_amount` text DEFAULT NULL,
  `watering_amount_int` int DEFAULT NULL,
  `sunlight_type` text DEFAULT NULL,
  `sunlight_duration` text DEFAULT NULL,
  `sunlight_duration_top` int DEFAULT NULL,
  `sunlight_duration_bottom` int DEFAULT NULL,
  `soil_conditions` text DEFAULT NULL,
  `lifecycle_stage` text DEFAULT NULL,
  `average_lifespan` text DEFAULT NULL,
  `average_lifespan_int` int DEFAULT NULL,
  `growth_rate` text DEFAULT NULL,
  `temperature_optimal_range` text DEFAULT NULL,
  `temperature_tolerance` text DEFAULT NULL,
  `humidity_optimal` text DEFAULT NULL,
  `humidity_tolerance` text DEFAULT NULL,
  `soil_image` text DEFAULT NULL,
  `lighting_image` text DEFAULT NULL,
  `watering_image` text DEFAULT NULL,
  `important_info` text,
  PRIMARY KEY (`plant_id`),
  FULLTEXT (`plant_common_name`, `plant_scientific_name`, `watering_frequency`, `sunlight_type`, `soil_conditions`, 
            `lifecycle_stage`, `growth_rate`, `temperature_optimal_range`, `humidity_optimal`, `important_info`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create `user_pass_combo` table
CREATE TABLE `user_pass_combo` (
  `username` text,
  `password` text,
  `user_id` int NOT NULL AUTO_INCREMENT,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create `simulations` table with foreign key referencing `user_pass_combo`
CREATE TABLE `simulations` (
  `simulation_id` int NOT NULL AUTO_INCREMENT,
  `date_created` timestamp DEFAULT CURRENT_TIMESTAMP,
  `plant_id` int DEFAULT NULL,
  `plant_log` text,
  `user_id` int NOT NULL,
  `dead` int DEFAULT NULL,
  `log_day` int DEFAULT NULL,
  PRIMARY KEY (`simulation_id`),
  FOREIGN KEY (`user_id`) REFERENCES `user_pass_combo`(`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS dontkillplants;

-- Use the database
USE dontkillplants;

-- Drop the table if it exists to avoid conflicts during creation
DROP TABLE IF EXISTS `plants`;
DROP TABLE IF EXISTS `simulations`;
DROP TABLE IF EXISTS `user_pass_combo`;

-- Create the `plants` table
CREATE TABLE `plants` (
  `plant_id` int NOT NULL AUTO_INCREMENT,
  `plant_common_name` varchar(100) DEFAULT NULL,
  `plant_scientific_name` varchar(100) DEFAULT NULL,
  `watering_frequency` varchar(100) DEFAULT NULL,
  `watering_amount` varchar(100) DEFAULT NULL,
  `sunlight_type` varchar(100) DEFAULT NULL,
  `sunlight_duration` varchar(100) DEFAULT NULL,
  `soil_conditions` text,
  `lifecycle_stage` varchar(100) DEFAULT NULL,
  `average_lifespan` varchar(100) DEFAULT NULL,
  `growth_rate` varchar(100) DEFAULT NULL,
  `temperature_optimal_range` varchar(100) DEFAULT NULL,
  `temperature_tolerance` varchar(100) DEFAULT NULL,
  `humidity_optimal` varchar(100) DEFAULT NULL,
  `humidity_tolerance` varchar(100) DEFAULT NULL,
  `important_info` text,
  PRIMARY KEY (`plant_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `simulations` (
  'user_id' int,
  'simulation_id' int NOT NULL AUTO_INCREMENT,
  'date_created' DEFAULT CURRENT_TIMESTAMP,
  'plant_id' int DEFAULT NULL,
  'plant_log' text,
  PRIMARY KEY ('simulation_id'),
  FOREIGN KEY ('user_id') REFERENCES user_pass_combo('user_id')
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `user_pass_combo` (
  'username' text,
  'password' text,
  'user_id' int NOT NULL AUTO_INCREMENT,
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
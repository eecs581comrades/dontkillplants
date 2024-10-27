-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS dontkillplants;

-- Use the database
USE dontkillplants;

-- Drop the table if it exists to avoid conflicts during creation
DROP TABLE IF EXISTS `plants`;

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

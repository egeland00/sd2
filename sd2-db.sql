-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db
-- Generation Time: Mar 23, 2023 at 09:21 PM
-- Server version: 8.0.32
-- PHP Version: 8.1.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sd2-db`
--

-- --------------------------------------------------------

--
-- Table structure for table `Reminder`
--

CREATE TABLE `Reminder` (
  `id` int NOT NULL,
  `task_id` int NOT NULL,
  `reminder_date` datetime NOT NULL,
  `reminder_method` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Task`
--

CREATE TABLE `Task` (
  `id` int NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text,
  `completed` tinyint(1) NOT NULL DEFAULT '0',
  `category` varchar(255) DEFAULT NULL,
  `due_date` date DEFAULT NULL,
  `notes` text,
  `user_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Task`
--

INSERT INTO `Task` (`id`, `title`, `description`, `completed`, `category`, `due_date`, `notes`, `user_id`) VALUES
(1, 'Task 1', 'Pavi is awzm', 1, NULL, '2023-03-21', NULL, 1),
(2, 'Task 2', 'This is the description for Task 2', 1, 'test', '2023-03-24', NULL, 1),
(3, 'Task 3', 'This is the description for Task 3', 0, NULL, '2023-03-25', NULL, 2),
(4, 'Task 4', 'This is the description for Task 4', 0, NULL, '2023-04-05', NULL, 1),
(5,'CW submission','Description for Task',1,'Coursework','2022-11-24', NULL,3),
(6, ' Dummy Task', 'This is the description for Task', 1, 'test', '2023-03-24', NULL, 4),
(7, 'Dummy Task', 'This is the description for Task', 0, NULL, '2023-03-25', NULL, 5),
(8, 'Dummy Task', 'This is the description for Task', 0, NULL, '2023-04-05', NULL, 6);

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `id` int NOT NULL,
  `firstname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `lastname` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `points` int NOT NULL DEFAULT '0',
  `level` int NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`id`, `firstname`, `lastname`, `password`, `email`, `points`, `level`) VALUES
(1, 'John', 'Wick', 'demo_password', 'demo_user@example.com', 4, 1),
(2, 'John', 'Doe', 'password123', 'johndoe@example.com', 0, 1),
(3, 'Prime', 'Pavi', 'sdfsfsdfds', 'Paviprime@omni.com', 5, 2),
(4, 'Ørjan', 'Egeland', '2343242d', 'Ørjan@Egeland.com', 3, 7),
(5, 'ella', 'bella', 'lendaf', 'bella@ella.com', 5, 3),
(6, 'ollie', 'anup', 'adfahasa', 'dasdada@231.com', 2, 8),
(7, 'Ørjan', 'Egeland', 'vjhvjjyfjy', 'demo_user2@example.com', 6, 7);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Reminder`
--
ALTER TABLE `Reminder`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_id` (`task_id`);

--
-- Indexes for table `Task`
--
ALTER TABLE `Task`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Reminder`
--
ALTER TABLE `Reminder`
  MODIFY `id` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Task`
--
ALTER TABLE `Task`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Reminder`
--
ALTER TABLE `Reminder`
  ADD CONSTRAINT `reminder_ibfk_1` FOREIGN KEY (`task_id`) REFERENCES `Task` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Task`
--
ALTER TABLE `Task`
  ADD CONSTRAINT `task_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `User` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

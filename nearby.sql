--
-- Database
--
CREATE DATABASE `nearby`;
USE `nearby`;

--
-- Table `users`
--

DROP TABLE IF EXISTS `users`;

CREATE TABLE IF NOT EXISTS `users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `public_id` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone_number` VARCHAR(16) NOT NULL,
  `username` VARCHAR(30) NOT NULL,
  `name` VARCHAR(50) NOT NULL DEFAULT '',
  `picture_url` VARCHAR(255) NOT NULL DEFAULT '',
  `gender` ENUM('male', 'female', 'none') NOT NULL DEFAULT 'none',
  `biography` VARCHAR(255) NOT NULL DEFAULT '',
  `birthday` DATE NOT NULL,
  `lang` varchar(10) NOT NULL DEFAULT 'en',
  `score` INT NOT NULL DEFAULT 0,
  `is_private` TINYINT(1) NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 0,
  `is_banned` TINYINT(1) NOT NULL DEFAULT 0,
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

CREATE UNIQUE INDEX `user_id` ON `users` (`public_id` ASC);
CREATE UNIQUE INDEX `email` ON `users` (`email` ASC);
CREATE UNIQUE INDEX `phone_number` ON `users` (`phone_number` ASC);

--
-- Table `user_follows`
--

CREATE TABLE `user_follows` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `from_id` INT(11) NOT NULL,
  `to_id` INT(11) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`)
);

--
-- Table `channels`
--

DROP TABLE IF EXISTS `channels`;

CREATE TABLE IF NOT EXISTS `channels` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `public_id` VARCHAR(255) NOT NULL,
  `identifier` VARCHAR(30) NOT NULL,
  `name` VARCHAR(50) NOT NULL DEFAULT '',
  `channel_type` ENUM('public', 'private', 'direct') NOT NULL,
  `capacity` INT(5) NOT NULL DEFAULT 20,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` DATETIME,
  PRIMARY KEY (`id`)
);

CREATE UNIQUE INDEX `channel_id` ON `channels` (`public_id` ASC);
CREATE UNIQUE INDEX `channel_identifier` ON `channels` (`identifier` ASC);

--
-- Table `channel_users`
--

DROP TABLE IF EXISTS `channel_users`;

CREATE TABLE IF NOT EXISTS `channel_users` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `channel_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `is_banned` TINYINT(1) NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

--
-- Table `messages`
--

CREATE TABLE `messages` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `public_id` VARCHAR(255) NOT NULL,
  `channel_id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `message_type` ENUM('text', 'image', 'video', 'audio') NOT NULL,
  `message` VARCHAR(255) NOT NULL DEFAULT '',
  `attachment_url` VARCHAR(255) NOT NULL DEFAULT '',
  `attachment_thumb_url` VARCHAR(255) NOT NULL DEFAULT '',
  `is_destructed` TINYINT(1) NOT NULL DEFAULT 0,
  `duration` INT(5) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `deleted_at` DATETIME,
  `is_deleted` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY  (`id`)
);

CREATE UNIQUE INDEX `message_id` ON `messages` (`public_id` ASC);

--
-- Table `user_locations`
--

CREATE TABLE `user_locations` (
  `id` INT(11) NOT NULL AUTO_INCREMENT,
  `user_id` INT(11) NOT NULL,
  `latitude` DECIMAL(10, 8) NOT NULL,
  `longitude` DECIMAL(11, 8) NOT NULL,
  `velocity` INT(5) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY  (`id`)
);

-- -----------------------------------------------------
-- Table `access`
-- -----------------------------------------------------

DROP TABLE IF EXISTS `access` ;

CREATE TABLE IF NOT EXISTS `access` (
  `id` INT(11) NOT NULL,
  `user_id` INT(11) NOT NULL,
  `access_token` VARCHAR(60) NOT NULL,
  `ip` VARCHAR(30) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
);

-- create database inflean;
use inflean;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(50) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `nickname` varchar(50) NOT NULL,
  `authority` int(11) NOT NULL,
  `provider` varchar(45) DEFAULT NULL,
  `snsId` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `lectures` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `price` int(11) NOT NULL,
  `descript` text,
  `user_id` int(11) NOT NULL,
  `createdTime` date NOT NULL,
  `updatedTime` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_lecture_idx` (`user_id`),
  CONSTRAINT `user_lecture` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ;

CREATE TABLE `sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `index` int(11) NOT NULL,
  `lectures_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `lectures_sections_idx` (`lectures_id`),
  CONSTRAINT `lectures_sections` FOREIGN KEY (`lectures_id`) REFERENCES `lectures` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ;

CREATE TABLE `chapters` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `index` int(11) NOT NULL,
  `sections_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sections_chapters_idx` (`sections_id`),
  CONSTRAINT `sections_chapters` FOREIGN KEY (`sections_id`) REFERENCES `sections` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4 ;

CREATE TABLE `questions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `descript` text NOT NULL,
  `user_id` int(11) NOT NULL,
  `createdTime` datetime NOT NULL,
  `lecture_id` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `questions_lectureId_idx` (`lecture_id`),
  CONSTRAINT `questions_lectureId` FOREIGN KEY (`lecture_id`) REFERENCES `lectures` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

CREATE TABLE `questions_comments` (
  `question_id` int NOT NULL,
  `commentId` int NOT NULL,
  PRIMARY KEY (`commentId`),
  KEY `comment_questionId_idx` (`question_id`),
  CONSTRAINT `comment_commentId` FOREIGN KEY (`commentId`) REFERENCES `questions` (`id`),
  CONSTRAINT `comment_questionId` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

CREATE TABLE `likes` (
  `users_id` int(11) NOT NULL,
  `lectures_id` int(11) NOT NULL,
  `createdTime` datetime NOT NULL,
  PRIMARY KEY (`users_id`),
  KEY `lectures_idx` (`lectures_id`),
  CONSTRAINT `lectures_like` FOREIGN KEY (`lectures_id`) REFERENCES `lectures` (`id`),
  CONSTRAINT `users_like` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 ;

CREATE TABLE `resistations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `price` int(11) NOT NULL,
  `lectures_id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `createdTime` datetime NOT NULL,
  PRIMARY KEY (`id`),
  KEY `resistations_lecturesId_idx` (`lectures_id`),
  KEY `resistaions_userId_idx` (`users_id`),
  CONSTRAINT `resistaions_userId` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`),
  CONSTRAINT `resistations_lecturesId` FOREIGN KEY (`lectures_id`) REFERENCES `lectures` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8mb4;
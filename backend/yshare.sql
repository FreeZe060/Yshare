-- --------------------------------------------------------
-- Hôte:                         localhost
-- Version du serveur:           8.0.30 - MySQL Community Server - GPL
-- SE du serveur:                Win64
-- HeidiSQL Version:             12.1.0.6537
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Listage de la structure de la base pour yshare
CREATE DATABASE IF NOT EXISTS `yshare` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `yshare`;

-- Listage de la structure de table yshare. categories
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text,
  `parent_id` int DEFAULT NULL,
  `display_order` int DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `parent_id` (`parent_id`),
  CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.categories : ~0 rows (environ)
DELETE FROM `categories`;
INSERT INTO `categories` (`id`, `name`, `parent_id`, `display_order`) VALUES
	(1, 'sport', NULL, 0);

-- Listage de la structure de table yshare. comments
CREATE TABLE IF NOT EXISTS `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_event` int NOT NULL,
  `id_user` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `id_comment` int DEFAULT NULL,
  `date_posted` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `FK_comments_events` (`id_event`),
  KEY `FK_comments_parent` (`id_comment`),
  KEY `FK_comments_users` (`id_user`),
  CONSTRAINT `FK_comments_events` FOREIGN KEY (`id_event`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_comments_parent` FOREIGN KEY (`id_comment`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_comments_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.comments : ~5 rows (environ)
DELETE FROM `comments`;
INSERT INTO `comments` (`id`, `id_event`, `id_user`, `title`, `message`, `id_comment`, `date_posted`) VALUES
	(1, 2, 13, NULL, 'Ceci est le contenu du commen.', NULL, '2025-03-13 14:32:12'),
	(3, 14, 15, 'Mon avis sur cet événement', 'C\'était génial, très bien organisé !', NULL, '2025-03-17 16:12:57'),
	(4, 14, 15, 'Nouveau titre', 'J\'ai changé mon avis, c\'était encore mieux que prévu !', NULL, '2025-03-17 16:13:10'),
	(6, 14, 15, 'Réponse au commentaire', 'Je suis d\'accord avec vous !', 4, '2025-03-17 16:14:01');

-- Listage de la structure de table yshare. events
CREATE TABLE IF NOT EXISTS `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_org` int DEFAULT NULL,
  `title` text,
  `desc` text,
  `price` int DEFAULT NULL,
  `date` date DEFAULT NULL,
  `max_participants` int DEFAULT NULL,
  `status` enum('En Cours','Terminé','Annulé') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'En Cours',
  `street` varchar(255) DEFAULT NULL,
  `street_number` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `start_time` time DEFAULT NULL,
  `end_time` time DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_org`) USING BTREE,
  CONSTRAINT `FK_event_user` FOREIGN KEY (`id_org`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.events : ~12 rows (environ)
DELETE FROM `events`;
INSERT INTO `events` (`id`, `id_org`, `title`, `desc`, `price`, `date`, `max_participants`, `status`, `street`, `street_number`, `city`, `postal_code`, `start_time`, `end_time`) VALUES
	(2, 13, 'tergum deficio utrum', 'Tero temporibus autus asper autem curo summa avarus aestus. Utilis vulnero sollicito tumultus civitas succurro.', NULL, '2025-03-23', NULL, 'En Cours', NULL, NULL, NULL, NULL, NULL, NULL),
	(3, NULL, 'vinculum sub nobis', 'Super capitulus corpus suscipio. Ambitus commodo volva.', 10, '2025-02-10', 10, 'En Cours', NULL, NULL, NULL, NULL, NULL, NULL),
	(4, NULL, 'spectaculum autus pauper', 'Dolore pecus tyrannus accusantium argentum torqueo coruscus provident. Cresco verus tempora adopto.', NULL, '2024-12-09', NULL, 'En Cours', NULL, NULL, NULL, NULL, NULL, NULL),
	(5, 13, 'sustineo culpa laboriosam', 'Pecus amissio alter tredecim vinculum. Supplanto crastinus bellum.', 0, '2024-12-21', 5, 'En Cours', NULL, NULL, NULL, NULL, NULL, NULL),
	(6, NULL, 'amplexus adulatio amaritudo', 'Baiulus clibanus curtus socius victoria thymbra consequatur bis aspernatur adiuvo. Abscido umbra quod deleniti titulus defungo accusator.', NULL, '2025-01-24', NULL, 'En Cours', NULL, NULL, NULL, NULL, NULL, NULL),
	(7, NULL, 'cubicularis ciminatio depromo', 'Cubo tres praesentium comprehendo color adhaero aestivus comes. Vicissitudo celebrer carmen tonsor ex.', NULL, '2025-01-12', NULL, 'En Cours', NULL, NULL, NULL, NULL, NULL, NULL),
	(8, NULL, 'argumentum carbo blanditiis', 'Defaeco reiciendis creta tyrannus. Antea spectaculum admoneo terga despecto desino bibo laboriosam solio utrum.', NULL, '2025-03-29', NULL, 'En Cours', NULL, NULL, NULL, NULL, NULL, NULL),
	(9, NULL, 'sponte veritatis consectetur', 'Cui templum talis teres causa clementia iusto. Theca conor velit temperantia.', NULL, '2025-07-24', NULL, 'En Cours', NULL, NULL, NULL, NULL, NULL, NULL),
	(10, NULL, 'tener tardus candidus', 'Porro repellat accusantium arceo tibi pectus addo atrox. Ocer clarus sophismata vulnero subseco contabesco clarus ulciscor volubilis.', NULL, '2025-06-26', NULL, 'En Cours', NULL, NULL, NULL, NULL, NULL, NULL),
	(11, 13, 'Mon Événement Test', 'Ceci est une description détaillée de l\'événement.', 100, '2025-12-31', NULL, 'En Cours', NULL, NULL, NULL, NULL, NULL, NULL),
	(12, 13, 'Mon Événement Test', 'Ceci est une description détaillée de l\'événement.', 100, '2025-12-31', NULL, 'En Cours', NULL, NULL, NULL, NULL, NULL, NULL),
	(13, 13, 'Mon Événement Test', 'Ceci est une description détaillée de l\'événement.', 100, '2025-12-31', NULL, 'En Cours', NULL, NULL, NULL, NULL, NULL, NULL),
	(14, 15, 'Conférence Tech 2025 - Mise à Jour', 'Un événement sur les nouvelles technologies', 50, '2025-06-15', 200, 'En Cours', NULL, NULL, NULL, NULL, NULL, NULL),
	(15, 15, 'Conférence Tech 2025', 'Un événement sur les nouvelles technologies', 50, '2025-06-15', 100, 'Annulé', NULL, NULL, NULL, NULL, NULL, NULL),
	(16, NULL, 'My event de fou', 'encore un evenement incroyable a mon actif', 50, '2025-06-15', 10, 'En Cours', NULL, NULL, NULL, NULL, NULL, NULL),
	(17, NULL, 'My event de fou', 'encore un evenement incroyable a mon actif', 50, '2025-06-15', 10, 'En Cours', NULL, NULL, NULL, NULL, NULL, NULL);

-- Listage de la structure de table yshare. event_categories
CREATE TABLE IF NOT EXISTS `event_categories` (
  `id_event` int DEFAULT NULL,
  `id_category` int DEFAULT NULL,
  KEY `id_event` (`id_event`),
  KEY `id_category` (`id_category`),
  CONSTRAINT `FK_event_categories_categories` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id`),
  CONSTRAINT `FK_event_categories_events` FOREIGN KEY (`id_event`) REFERENCES `events` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.event_categories : ~0 rows (environ)
DELETE FROM `event_categories`;

-- Listage de la structure de table yshare. event_images
CREATE TABLE IF NOT EXISTS `event_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `image_url` text NOT NULL,
  `is_main` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_images_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.event_images : ~0 rows (environ)
DELETE FROM `event_images`;

-- Listage de la structure de table yshare. favoris
CREATE TABLE IF NOT EXISTS `favoris` (
  `id_user` int NOT NULL,
  `id_event` int NOT NULL,
  PRIMARY KEY (`id_user`,`id_event`),
  KEY `id_event` (`id_event`),
  CONSTRAINT `favoris_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favoris_ibfk_2` FOREIGN KEY (`id_event`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.favoris : ~0 rows (environ)
DELETE FROM `favoris`;
INSERT INTO `favoris` (`id_user`, `id_event`) VALUES
	(17, 3);

-- Listage de la structure de table yshare. news
CREATE TABLE IF NOT EXISTS `news` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `image_url` text,
  `date_posted` datetime DEFAULT CURRENT_TIMESTAMP,
  `user_id` int DEFAULT NULL,
  `event_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `news_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  CONSTRAINT `news_ibfk_2` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.news : ~0 rows (environ)
DELETE FROM `news`;

-- Listage de la structure de table yshare. notifications
CREATE TABLE IF NOT EXISTS `notifications` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `title` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `date_sent` datetime DEFAULT CURRENT_TIMESTAMP,
  `read_status` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.notifications : ~4 rows (environ)
DELETE FROM `notifications`;
INSERT INTO `notifications` (`id`, `id_user`, `title`, `message`, `date_sent`, `read_status`) VALUES
	(2, 13, 'Nouvelle demande - sustineo culpa laboriosam', 'Johnny souhaite rejoindre votre événement "sustineo culpa laboriosam".', '2025-03-17 16:15:51', 0),
	(3, 15, 'Statut mis à jour - sustineo culpa laboriosam', 'Bonjour Johnny,\n\nVotre statut pour l\'événement "sustineo culpa laboriosam" a été mis à jour : Inscrit.\n\nMerci de votre participation !', '2025-03-17 16:42:07', 1),
	(4, 13, 'Retrait de l\'événement - sustineo culpa laboriosam', 'Bonjour John,\n\nVous avez été retiré de l\'événement "sustineo culpa laboriosam".\n\nSi vous pensez qu\'il s\'agit d\'une erreur, veuillez contacter l\'organisateur.', '2025-03-17 16:45:37', 0);

-- Listage de la structure de table yshare. participants
CREATE TABLE IF NOT EXISTS `participants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int DEFAULT NULL,
  `id_event` int DEFAULT NULL,
  `status` enum('En Attente','Inscrit','Annulé','Refusé') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_event` (`id_event`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `FK_participants_events` FOREIGN KEY (`id_event`) REFERENCES `events` (`id`),
  CONSTRAINT `FK_participants_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.participants : ~8 rows (environ)
DELETE FROM `participants`;
INSERT INTO `participants` (`id`, `id_user`, `id_event`, `status`) VALUES
	(3, 13, 9, 'En Attente'),
	(4, 13, 6, 'En Attente'),
	(5, 13, 7, 'En Attente'),
	(6, 13, 8, 'En Attente'),
	(7, 13, 3, 'En Attente'),
	(10, NULL, 5, 'En Attente'),
	(11, 15, 5, 'Inscrit');

-- Listage de la structure de table yshare. ratings
CREATE TABLE IF NOT EXISTS `ratings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_event` int NOT NULL,
  `id_user` int NOT NULL,
  `rating` decimal(3,2) NOT NULL,
  `message` text,
  `date_rated` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_rating` (`id_event`,`id_user`),
  KEY `FK_ratings_user` (`id_user`),
  CONSTRAINT `FK_ratings_event` FOREIGN KEY (`id_event`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_ratings_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_rating_range` CHECK (((`rating` >= 0) and (`rating` <= 5)))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.ratings : ~0 rows (environ)
DELETE FROM `ratings`;
INSERT INTO `ratings` (`id`, `id_event`, `id_user`, `rating`, `message`, `date_rated`) VALUES
	(1, 5, 15, 4.50, 'Très bon événemen !', '2025-03-18 10:22:25');

-- Listage de la structure de table yshare. reports
CREATE TABLE IF NOT EXISTS `reports` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_event` int DEFAULT NULL,
  `id_reported_user` int DEFAULT NULL,
  `id_comment` int DEFAULT NULL,
  `message` text NOT NULL,
  `status` enum('En Attente','Rejeté','Validé') DEFAULT 'En Attente',
  `date_reported` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_user`),
  KEY `id_event` (`id_event`),
  KEY `id_reported_user` (`id_reported_user`),
  KEY `FK_reports_comments` (`id_comment`),
  CONSTRAINT `FK_reports_comments` FOREIGN KEY (`id_comment`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reports_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reports_ibfk_2` FOREIGN KEY (`id_event`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `reports_ibfk_3` FOREIGN KEY (`id_reported_user`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `chk_one_target` CHECK ((((`id_event` is not null) and (`id_reported_user` is null)) or ((`id_event` is null) and (`id_reported_user` is not null))))
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.reports : ~0 rows (environ)
DELETE FROM `reports`;
INSERT INTO `reports` (`id`, `id_user`, `id_event`, `id_reported_user`, `id_comment`, `message`, `status`, `date_reported`) VALUES
	(1, 13, 10, NULL, NULL, 'Cet événement contient du contenu inapproprié.', 'En Attente', '2025-03-17 16:38:10');

-- Listage de la structure de table yshare. users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` text NOT NULL,
  `lastname` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` text NOT NULL,
  `role` enum('Utilisateur','Administrateur') DEFAULT 'Utilisateur',
  `profile_image` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.users : ~5 rows (environ)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `name`, `email`, `lastname`, `password`, `role`, `profile_image`) VALUES
	(13, 'John', 'johndoe@example.com', 'Doe', '$2a$10$bOUc3pez25HnLJ514XI2ruQCmqxi92j8bQa/48Wj4z.3ijoWj/2OO', 'Utilisateur', NULL),
	(14, 'Admin', 'admin@example.com', 'Master', '$2a$10$8rhd4a8O1l4aB1zty8FXV.d4RCzKmVGvXGwdhR9luJw0SQRq7WVUq', 'Administrateur', NULL),
	(15, 'Johnny', 'user@example.com', 'Doe', '$2a$10$.uBsQluiOs8o58tj5K.m8exfzfu9ilpnoMm7tsIcJQfR/Zs35UZZu', 'Utilisateur', NULL),
	(16, 'User', 'user@exampdddle.com', 'Test', '$2a$10$fpMIJMeb7ZZdI1TpyQDQYO6WPAGYaCzwE/NUdxDst6eCkZZ/7vS9G', 'Utilisateur', NULL),
	(17, 'alexandre', 'a@gmail.com', 'alex', '$2a$10$5OUB40.XvQOMIjdEqSfB5OdxZDvHW9beT6Bfd/m0TCdOtAW0iv3mK', 'Utilisateur', '/profile-images/1742984852871-722505095.jpg'),
	(28, 'Alexandre', 'alex.perezab470@gmail.com', 'Perez', '$2a$10$IlcXn/mzK9Xvk6Of8N8OR.FPsgST7JP1yLPn5ZdJVv6Xjas6ELzcO', 'Utilisateur', '/profile-images/1743171049352-327821772.jpg');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

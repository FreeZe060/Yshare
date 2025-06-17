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
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.categories : ~4 rows (environ)
DELETE FROM `categories`;
INSERT INTO `categories` (`id`, `name`, `parent_id`, `display_order`) VALUES
	(1, 'Sport', NULL, 0),
	(2, 'Musique', NULL, 0),
	(3, 'Fête', NULL, 0),
	(4, 'Foot', 1, 0);

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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.comments : ~12 rows (environ)
DELETE FROM `comments`;
INSERT INTO `comments` (`id`, `id_event`, `id_user`, `title`, `message`, `id_comment`, `date_posted`) VALUES
	(1, 2, 13, NULL, 'Ceci est le contenu du commen.', NULL, '2025-03-13 14:32:12'),
	(3, 14, 15, 'Mon avis sur cet événement', 'C\'était génial, très bien organisé !', NULL, '2025-03-17 16:12:57'),
	(4, 14, 15, 'Nouveau titre', 'J\'ai changé mon avis, c\'était encore mieux que prévu !', NULL, '2025-03-17 16:13:10'),
	(6, 14, 28, 'Réponse au commentaire', 'Je suis d\'accord avec vous !', 4, '2025-03-17 16:14:01'),
	(8, 2, 30, NULL, 'tu dis n\'importe quoi toi zbi', 1, '2025-05-05 13:49:17'),
	(10, 18, 17, 'Cest quoi encore cet event', 'wow levent aberrant woke et tous je vais en parler longtempsssssss de cetttteeeeeee evenementtttttttttttt', NULL, '2025-05-07 11:31:42'),
	(11, 18, 16, '', 'Parle mieux de cette evenement si tu veux pas que ca parte en couille on va se pt toi et moi', 10, '2025-05-07 11:32:26'),
	(12, 18, 28, 'Nouveau commentaire', 'dazddadadaadada', NULL, '2025-05-07 12:28:43'),
	(13, 18, 28, 'Réponse', 'sazsazsazsazssa', 12, '2025-05-07 12:31:05'),
	(14, 18, 28, 'Réponse', 'sazsazsazsazs', 13, '2025-05-07 12:31:24'),
	(15, 18, 30, 'Nouveau commentaire', 'dzdazdzadazdazdaz', NULL, '2025-05-07 14:38:50'),
	(16, 18, 30, 'Réponse', 'dzadadadazda', 15, '2025-05-07 14:38:55');

-- Listage de la structure de table yshare. comment_reactions
CREATE TABLE IF NOT EXISTS `comment_reactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_comment` int NOT NULL,
  `id_user` int NOT NULL,
  `emoji` varchar(50) NOT NULL,
  `date_reacted` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_user_comment_emoji` (`id_comment`,`id_user`,`emoji`),
  KEY `FK_reaction_user` (`id_user`),
  CONSTRAINT `FK_reaction_comment` FOREIGN KEY (`id_comment`) REFERENCES `comments` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_reaction_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.comment_reactions : ~3 rows (environ)
DELETE FROM `comment_reactions`;
INSERT INTO `comment_reactions` (`id`, `id_comment`, `id_user`, `emoji`, `date_reacted`) VALUES
	(1, 12, 30, '🔥', '2025-05-07 13:56:06'),
	(4, 15, 28, '😋', '2025-05-07 14:50:42'),
	(7, 15, 28, '👎🏿', '2025-05-14 07:36:18');

-- Listage de la structure de table yshare. conversations
CREATE TABLE IF NOT EXISTS `conversations` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user1_id` int NOT NULL,
  `user2_id` int NOT NULL,
  `normalized_user1_id` int NOT NULL,
  `normalized_user2_id` int NOT NULL,
  `event_id` int DEFAULT NULL,
  `news_id` int DEFAULT NULL,
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_conversation` (`normalized_user1_id`,`normalized_user2_id`,`event_id`,`news_id`),
  KEY `user1_id` (`user1_id`),
  KEY `user2_id` (`user2_id`),
  KEY `event_id` (`event_id`),
  KEY `news_id` (`news_id`),
  CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`user1_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`user2_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `conversations_ibfk_3` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE,
  CONSTRAINT `conversations_ibfk_4` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.conversations : ~0 rows (environ)
DELETE FROM `conversations`;

-- Listage de la structure de table yshare. events
CREATE TABLE IF NOT EXISTS `events` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_org` int DEFAULT NULL,
  `title` text,
  `desc` text,
  `price` int DEFAULT NULL,
  `date_created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `max_participants` int DEFAULT NULL,
  `status` enum('En Cours','Terminé','Annulé','Planifié') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'En Cours',
  `street` varchar(255) DEFAULT NULL,
  `street_number` varchar(10) DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `postal_code` varchar(20) DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_user` (`id_org`) USING BTREE,
  CONSTRAINT `FK_event_user` FOREIGN KEY (`id_org`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=33 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.events : ~23 rows (environ)
DELETE FROM `events`;
INSERT INTO `events` (`id`, `id_org`, `title`, `desc`, `price`, `date_created`, `max_participants`, `status`, `street`, `street_number`, `city`, `postal_code`, `start_time`, `end_time`) VALUES
	(2, 13, 'tergum deficio utrum', 'Tero temporibus autus asper autem curo summa avarus aestus. Utilis vulnero sollicito tumultus civitas succurro.', 0, '2025-03-23 00:00:00', 30, 'Terminé', 'place du marche', '3', 'Argenteuil', '95100', '2025-05-09 13:00:00', '2025-05-11 15:00:00'),
	(3, 30, 'vinculum sub nobis', 'Super capitulus corpus suscipio. Ambitus commodo volva.', 10, '2025-02-10 00:00:00', 10, 'Planifié', 'avenue de la paix', '15', 'Paris', '75000', '2025-06-15 10:00:00', '2025-06-20 15:00:00'),
	(4, 15, 'spectaculum autus pauper', 'Dolore pecus tyrannus accusantium argentum torqueo coruscus provident. Cresco verus tempora adopto.', 15, '2024-12-09 00:00:00', 80, 'Terminé', 'place du marche', '8', 'Argenteuil', '95100', '2025-05-18 10:00:00', '2025-05-19 10:00:00'),
	(5, 13, 'sustineo culpa laboriosam', 'Pecus amissio alter tredecim vinculum. Supplanto crastinus bellum.', 0, '2024-12-21 00:00:00', 5, 'Terminé', 'avenue de la paix', '3', 'Paris', '75000', '2025-05-10 14:00:00', '2025-05-20 14:00:00'),
	(6, 14, 'amplexus adulatio amaritudo', 'Baiulus clibanus curtus socius victoria thymbra consequatur bis aspernatur adiuvo. Abscido umbra quod deleniti titulus defungo accusator.', 0, '2025-01-24 00:00:00', 50, 'Terminé', 'rue du velodrome', '1', 'Marseille', '13000', '2025-05-30 12:00:00', '2025-05-30 14:00:00'),
	(7, 16, 'cubicularis ciminatio depromo', 'Cubo tres praesentium comprehendo color adhaero aestivus comes. Vicissitudo celebrer carmen tonsor ex.', 5, '2025-01-12 00:00:00', 100, 'Planifié', 'rue de la plage', '8', 'Antibes', '06650', '2025-06-22 09:00:00', '2025-06-22 12:00:00'),
	(8, 29, 'argumentum carbo blanditiis', 'Defaeco reiciendis creta tyrannus. Antea spectaculum admoneo terga despecto desino bibo laboriosam solio utrum.', 0, '2025-03-29 00:00:00', 20, 'Terminé', 'avenue de la paix', '9', 'Paris', '75000', '2025-05-06 10:00:00', '2025-05-06 20:00:00'),
	(9, 29, 'sponte veritatis consectetur', 'Cui templum talis teres causa clementia iusto. Theca conor velit temperantia.', 0, '2025-07-24 00:00:00', 50, 'En Cours', 'place sophie-laffite', '5', 'Sophia-Antipolis', '06560', '2025-06-02 15:00:00', '2025-06-03 15:00:00'),
	(10, 28, 'tener tardus candidus', 'Porro repellat accusantium arceo tibi pectus addo atrox. Ocer clarus sophismata vulnero subseco contabesco clarus ulciscor volubilis.', 35, '2025-06-26 00:00:00', 30, 'Terminé', 'place massena', '5', 'Nice', NULL, '2025-05-20 14:00:00', '2025-05-20 18:00:00'),
	(11, 13, 'Mon Événement Test', 'Ceci est une description détaillée de l\'événement.', 100, '2025-12-31 00:00:00', 15, 'Planifié', 'place du marche', '10', 'Argenteuil', '95100', '2025-07-14 18:00:00', '2025-07-15 05:00:00'),
	(12, 13, 'Mon Événement Test', 'Ceci est une description détaillée de l\'événement.', 100, '2025-12-31 00:00:00', 50, 'Planifié', 'place massena', '5', 'Nice', NULL, '2025-06-08 15:00:00', '2025-06-09 15:00:00'),
	(13, 13, 'Mon Événement Test', 'Ceci est une description détaillée de l\'événement.', 100, '2025-12-31 00:00:00', 10, 'Terminé', 'avenue de la paix', '9', 'Paris', '75000', '2025-05-13 10:00:00', '2025-05-14 10:04:09'),
	(14, 15, 'Conférence Tech 2025 - Mise à Jour', 'Un événement sur les nouvelles technologies', 50, '2025-06-15 00:00:00', 200, 'Terminé', 'rue de la plage', '6', 'Antibes', '06650', '2025-05-14 12:00:00', '2025-05-14 16:00:00'),
	(15, 15, 'Conférence Tech 2025', 'Un événement sur les nouvelles technologies', 50, '2025-06-15 00:00:00', 100, 'Terminé', 'place massena', '5', 'Nice', NULL, '2025-05-12 11:00:00', '2025-05-14 11:00:00'),
	(16, 28, 'My event de fou', 'encore un evenement incroyable a mon actif', 50, '2025-06-15 00:00:00', 10, 'Terminé', 'velodrome', '1', 'Marseille', '13000', '2025-05-07 09:00:00', '2025-05-07 23:00:00'),
	(17, 17, 'My event de fou', 'encore un evenement incroyable a mon actif', 50, '2025-06-15 00:00:00', 10, 'Terminé', 'place sophie-laffite', '1', 'Sophia-Antipolis', '06560', '2025-05-06 20:00:00', '2025-05-07 03:00:00'),
	(18, 15, 'Concert Open Air', 'Un concert en plein air exceptionnel.', 25, '2025-07-20 00:00:00', 10, 'Planifié', 'Avenue de la Musique', '19', 'Lyon', '69000', '2025-07-20 19:00:00', '2025-07-20 23:00:00'),
	(27, 28, 'dzdadadada', NULL, 0, '2025-04-12 00:00:00', 0, 'Terminé', 'Avenue Maria', '6', 'ARGENTEUIL', '95100', '2025-04-12 13:25:00', '2025-04-13 13:25:00'),
	(28, 31, 'effefz', NULL, 0, '2025-04-21 00:00:00', 0, 'Terminé', 'Avenue Maria', '6', 'ARGENTEUIL', '95100', '2025-04-20 10:00:00', '2025-04-22 13:18:00'),
	(29, 28, 'fezffzfzf', NULL, 0, '2025-05-15 13:37:28', 0, 'Terminé', 'Avenue Maria', '6', 'ARGENTEUIL', '95100', '2025-05-15 14:32:00', '2025-05-16 13:32:00'),
	(30, 28, 'ddzdadad', NULL, 0, '2025-05-15 13:38:15', 0, 'Terminé', 'Avenue Maria', '6', 'ARGENTEUIL', '95100', '2025-05-15 14:37:00', '2025-05-16 13:38:00'),
	(31, 28, 'dzadada', NULL, 0, '2025-05-15 13:40:54', 0, 'Terminé', 'Avenue Maria', '6', 'ARGENTEUIL', '95100', '2025-05-15 14:40:00', '2025-05-16 14:40:00'),
	(32, 28, 'dzdadada', NULL, 0, '2025-05-15 13:43:21', 0, 'Terminé', 'Avenue Maria', '6', 'ARGENTEUIL', '95100', '2025-05-15 14:43:00', '2025-05-16 13:43:00');

-- Listage de la structure de table yshare. event_categories
CREATE TABLE IF NOT EXISTS `event_categories` (
  `id_event` int DEFAULT NULL,
  `id_category` int DEFAULT NULL,
  KEY `id_event` (`id_event`),
  KEY `id_category` (`id_category`),
  CONSTRAINT `FK_event_categories_categories` FOREIGN KEY (`id_category`) REFERENCES `categories` (`id`),
  CONSTRAINT `FK_event_categories_events` FOREIGN KEY (`id_event`) REFERENCES `events` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.event_categories : ~24 rows (environ)
DELETE FROM `event_categories`;
INSERT INTO `event_categories` (`id_event`, `id_category`) VALUES
	(3, 2),
	(2, 2),
	(6, 3),
	(18, 3),
	(8, 1),
	(15, 3),
	(14, 2),
	(11, 2),
	(7, 2),
	(12, 2),
	(13, 2),
	(16, 3),
	(17, 1),
	(4, 1),
	(4, 4),
	(9, 3),
	(5, 2),
	(10, 2),
	(27, 1),
	(28, 1),
	(29, 1),
	(30, 1),
	(31, 1),
	(32, 1);

-- Listage de la structure de table yshare. event_guests
CREATE TABLE IF NOT EXISTS `event_guests` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_participant` int NOT NULL,
  `firstname` varchar(100) DEFAULT NULL,
  `lastname` varchar(100) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `id_participant` (`id_participant`),
  CONSTRAINT `event_guests_ibfk_1` FOREIGN KEY (`id_participant`) REFERENCES `participants` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.event_guests : ~2 rows (environ)
DELETE FROM `event_guests`;
INSERT INTO `event_guests` (`id`, `id_participant`, `firstname`, `lastname`, `email`) VALUES
	(1, 18, 'Alexandre', 'Perez', 'alex.perezap460@gmail.com'),
	(2, 18, 'Xav', 'Perez', 'alex.perezac490@gmail.com');

-- Listage de la structure de table yshare. event_images
CREATE TABLE IF NOT EXISTS `event_images` (
  `id` int NOT NULL AUTO_INCREMENT,
  `event_id` int NOT NULL,
  `image_url` text NOT NULL,
  `is_main` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `event_id` (`event_id`),
  CONSTRAINT `event_images_ibfk_1` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.event_images : ~24 rows (environ)
DELETE FROM `event_images`;
INSERT INTO `event_images` (`id`, `event_id`, `image_url`, `is_main`) VALUES
	(1, 3, '/event-images/1743067245365-575734556.png', 1),
	(2, 11, '/event-images/1744018474927-631654287.jpg', 1),
	(3, 12, '/event-images/1744018474927-631654287.jpg', 1),
	(4, 13, '/event-images/1744018853425-34622827.jpg', 1),
	(5, 14, '/event-images/1744018853425-34622827.jpg', 1),
	(6, 15, '/event-images/1744018474927-631654287.jpg', 1),
	(7, 16, '/event-images/1743067245365-575734556.png', 1),
	(8, 17, '/event-images/1743067245365-575734556.png', 1),
	(9, 18, '/event-images/1744018849512-657157196.jpg', 1),
	(10, 18, '/event-images/1744018849514-268068843.jpg', 0),
	(11, 18, '/event-images/1744018849516-824274093.png', 0),
	(18, 6, '/event-images/1744018853425-34622827.jpg', 1),
	(19, 4, '/event-images/1744018853425-34622827.jpg', 1),
	(20, 2, '/event-images/1744018849512-657157196.jpg', 1),
	(21, 5, '/event-images/1744018849512-657157196.jpg', 1),
	(22, 8, '/event-images/1744018849512-657157196.jpg', 1),
	(23, 9, '/event-images/1744018849512-657157196.jpg', 1),
	(24, 10, '/event-images/1744018849512-657157196.jpg', 1),
	(25, 7, '/event-images/1744018849512-657157196.jpg', 1),
	(32, 27, '/event-images/1744291551391-920419951.png', 1),
	(33, 27, '/event-images/1744291551426-844961258.png', 0),
	(34, 28, '/event-images/1745328003898-971490902.png', 1),
	(35, 30, '/event-images/1747316295337-955905149.png', 1),
	(36, 31, '/event-images/1747316454476-977788553.png', 1),
	(37, 32, '/event-images/1747316601970-455069361.png', 1);

-- Listage de la structure de table yshare. favoris
CREATE TABLE IF NOT EXISTS `favoris` (
  `id_user` int NOT NULL,
  `id_event` int NOT NULL,
  PRIMARY KEY (`id_user`,`id_event`),
  KEY `id_event` (`id_event`),
  CONSTRAINT `favoris_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `favoris_ibfk_2` FOREIGN KEY (`id_event`) REFERENCES `events` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.favoris : ~7 rows (environ)
DELETE FROM `favoris`;
INSERT INTO `favoris` (`id_user`, `id_event`) VALUES
	(17, 3),
	(31, 3),
	(28, 4),
	(28, 8),
	(30, 8),
	(28, 17),
	(30, 17);

-- Listage de la structure de table yshare. messages
CREATE TABLE IF NOT EXISTS `messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `conversation_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `content` text,
  `reply_to_message_id` int DEFAULT NULL,
  `emoji` varchar(10) DEFAULT NULL,
  `sent_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `seen` tinyint(1) DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `conversation_id` (`conversation_id`),
  KEY `sender_id` (`sender_id`),
  KEY `reply_to_message_id` (`reply_to_message_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `messages_ibfk_3` FOREIGN KEY (`reply_to_message_id`) REFERENCES `messages` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.messages : ~0 rows (environ)
DELETE FROM `messages`;

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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.news : ~0 rows (environ)
DELETE FROM `news`;
INSERT INTO `news` (`id`, `title`, `content`, `image_url`, `date_posted`, `user_id`, `event_id`) VALUES
	(1, 'Ma première news', 'Voici le contenu complet.', '/news-images/1746534785010-94272694.png', '2025-05-06 12:33:05', 30, 4),
	(2, 'une news pour mon super event', 'jai beaucoup de chose a dire zbi beaucoup beaucoup beaucoup beaucoup beaucoup beaucoup beaucoup beaucoup beaucoup beaucoup beaucoup beaucoup beaucoup beaucoup beaucoup de choseeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee a dire voilaa', '/news-images/1746537846428-430132291.jpg', '2025-05-08 13:24:06', 30, 4);

-- Listage de la structure de table yshare. news_categories
CREATE TABLE IF NOT EXISTS `news_categories` (
  `news_id` int NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`news_id`,`category_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `news_categories_ibfk_1` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE CASCADE,
  CONSTRAINT `news_categories_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.news_categories : ~2 rows (environ)
DELETE FROM `news_categories`;
INSERT INTO `news_categories` (`news_id`, `category_id`) VALUES
	(2, 1),
	(1, 2),
	(2, 3);

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
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.notifications : ~18 rows (environ)
DELETE FROM `notifications`;
INSERT INTO `notifications` (`id`, `id_user`, `title`, `message`, `date_sent`, `read_status`) VALUES
	(2, 13, 'Nouvelle demande - sustineo culpa laboriosam', 'Johnny souhaite rejoindre votre événement "sustineo culpa laboriosam".', '2025-03-17 16:15:51', 0),
	(3, 15, 'Statut mis à jour - sustineo culpa laboriosam', 'Bonjour Johnny,\n\nVotre statut pour l\'événement "sustineo culpa laboriosam" a été mis à jour : Inscrit.\n\nMerci de votre participation !', '2025-03-17 16:42:07', 1),
	(4, 13, 'Retrait de l\'événement - sustineo culpa laboriosam', 'Bonjour John,\n\nVous avez été retiré de l\'événement "sustineo culpa laboriosam".\n\nSi vous pensez qu\'il s\'agit d\'une erreur, veuillez contacter l\'organisateur.', '2025-03-17 16:45:37', 0),
	(5, 28, 'Statut mis à jour - Signalement', 'Votre signalement a été mis à jour : En attente', '2025-04-30 13:13:28', 0),
	(6, 28, 'Statut mis à jour - Signalement', 'Votre signalement a été mis à jour : Rejeté', '2025-04-30 13:15:21', 0),
	(7, 28, 'Statut mis à jour - Signalement', 'Votre signalement a été mis à jour : Validé', '2025-04-30 13:18:50', 0),
	(8, 28, 'Statut mis à jour - Signalement', 'Votre signalement a été mis à jour : En attente', '2025-04-30 13:18:56', 0),
	(9, 13, 'Statut mis à jour - Signalement', 'Votre signalement a été mis à jour : Validé', '2025-04-30 13:23:13', 0),
	(10, 28, 'Statut mis à jour - Signalement', 'Votre signalement a été mis à jour : Rejeté', '2025-04-30 13:23:17', 0),
	(11, 13, 'Statut mis à jour - sponte veritatis consectetur', 'Bonjour John,\n\nVotre statut pour l\'événement "sponte veritatis consectetur" est maintenant : Inscrit.', '2025-05-02 08:22:08', 0),
	(12, 13, 'Statut mis à jour - sponte veritatis consectetur', 'Bonjour John,\n\nVotre statut pour l\'événement "sponte veritatis consectetur" est maintenant : En Attente.', '2025-05-02 08:24:53', 0),
	(13, 13, 'Statut mis à jour - sponte veritatis consectetur', 'Bonjour John,\n\nVotre statut pour l\'événement "sponte veritatis consectetur" est maintenant : Refusé.', '2025-05-02 08:24:59', 0),
	(14, 13, 'Statut mis à jour - sponte veritatis consectetur', 'Bonjour John,\n\nVotre statut pour l\'événement "sponte veritatis consectetur" est maintenant : En Attente.', '2025-05-02 08:33:00', 0),
	(15, 13, 'Statut mis à jour - amplexus adulatio amaritudo', 'Bonjour John,\n\nVotre statut pour l\'événement "amplexus adulatio amaritudo" est maintenant : Inscrit.', '2025-05-02 08:33:04', 0),
	(16, 13, 'Statut mis à jour - amplexus adulatio amaritudo', 'Bonjour John,\n\nVotre statut pour l\'événement "amplexus adulatio amaritudo" est maintenant : En Attente.', '2025-05-02 11:13:16', 0),
	(17, 13, 'Statut mis à jour - sponte veritatis consectetur', 'Bonjour John,\n\nVotre statut pour l\'événement "sponte veritatis consectetur" est maintenant : Inscrit.', '2025-05-02 12:26:56', 0),
	(18, 13, 'Statut mis à jour - sponte veritatis consectetur', 'Bonjour John,\n\nVotre statut pour l\'événement "sponte veritatis consectetur" est maintenant : En Attente.', '2025-05-02 12:28:33', 0),
	(19, 15, 'Statut mis à jour - sustineo culpa laboriosam', 'Bonjour Johnny,\n\nVotre statut pour l\'événement "sustineo culpa laboriosam" est maintenant : En Attente.', '2025-05-02 12:38:42', 0),
	(20, 17, 'Ajout à un événement', 'Vous avez été ajouté à l\'événement "spectaculum autus pauper".', '2025-05-02 13:38:47', 0),
	(21, 28, 'Demande envoyée : "Concert Open Air"', 'Votre demande est en attente de validation.', '2025-05-09 14:04:57', 0),
	(22, 28, 'Demande envoyée : "argumentum carbo blanditiis"', 'Votre demande est en attente de validation.', '2025-05-21 12:13:43', 0),
	(23, 28, 'Demande envoyée : "argumentum carbo blanditiis"', 'Votre demande est en attente de validation.', '2025-05-21 12:33:39', 0),
	(24, 29, 'Nouvelle demande pour "argumentum carbo blanditiis"', 'Alexandre souhaite rejoindre votre événement.', '2025-05-21 12:33:40', 0);

-- Listage de la structure de table yshare. participants
CREATE TABLE IF NOT EXISTS `participants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int DEFAULT NULL,
  `id_event` int DEFAULT NULL,
  `status` enum('En Attente','Inscrit','Annulé','Refusé') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `joined_at` datetime DEFAULT CURRENT_TIMESTAMP,
  `request_message` text,
  `organizer_response` text,
  PRIMARY KEY (`id`),
  KEY `id_event` (`id_event`),
  KEY `id_user` (`id_user`),
  CONSTRAINT `FK_participants_events` FOREIGN KEY (`id_event`) REFERENCES `events` (`id`),
  CONSTRAINT `FK_participants_users` FOREIGN KEY (`id_user`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.participants : ~12 rows (environ)
DELETE FROM `participants`;
INSERT INTO `participants` (`id`, `id_user`, `id_event`, `status`, `joined_at`, `request_message`, `organizer_response`) VALUES
	(3, 13, 9, 'En Attente', '2025-04-29 16:35:57', NULL, NULL),
	(4, 13, 6, 'En Attente', '2025-04-29 16:35:57', NULL, NULL),
	(5, 13, 7, 'En Attente', '2025-04-29 16:35:57', NULL, NULL),
	(6, 13, 8, 'En Attente', '2025-04-29 16:35:57', NULL, NULL),
	(7, 14, 3, 'En Attente', '2025-04-29 16:35:57', NULL, NULL),
	(10, 28, 5, 'Inscrit', '2025-04-29 16:35:57', 'bonjour est ce quil reste de la place pour cet evenement', 'oui vasy viens sans probleme zbi'),
	(11, 15, 5, 'En Attente', '2025-04-29 16:35:57', NULL, NULL),
	(12, 30, 14, 'En Attente', '2025-05-02 13:16:08', NULL, NULL),
	(13, 17, 4, 'En Attente', '2025-05-02 13:38:46', NULL, NULL),
	(14, 17, 18, 'Inscrit', '2025-05-07 16:51:34', 'je veux vraiment rejoindre cet evenement', NULL),
	(15, 28, 18, 'En Attente', '2025-05-09 14:04:56', 'jai des amis qui ont deja rejoints levenement laisse moi rejoindre stp', NULL),
	(18, 28, 8, 'En Attente', '2025-05-21 12:33:36', 'jaime beaucoup cet evenement', NULL);

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.ratings : ~3 rows (environ)
DELETE FROM `ratings`;
INSERT INTO `ratings` (`id`, `id_event`, `id_user`, `rating`, `message`, `date_rated`) VALUES
	(1, 5, 15, 4.50, 'Très bon événemen !', '2025-03-18 10:22:25'),
	(2, 27, 29, 4.50, 'Un event vraiment super', '2025-04-11 09:45:10'),
	(3, 27, 16, 5.00, 'Jamais eu un event aussi bien', '2025-04-11 09:45:56');

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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.reports : ~2 rows (environ)
DELETE FROM `reports`;
INSERT INTO `reports` (`id`, `id_user`, `id_event`, `id_reported_user`, `id_comment`, `message`, `status`, `date_reported`) VALUES
	(1, 13, 10, NULL, NULL, 'Cet événement contient du contenu inapproprié.', 'Validé', '2025-03-17 16:38:10'),
	(3, 28, 5, NULL, NULL, '[Titre offensant] Le titre m\'offense entant que char de combat ', 'Rejeté', '2025-04-11 11:56:22');

-- Listage de la structure de table yshare. report_files
CREATE TABLE IF NOT EXISTS `report_files` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int NOT NULL,
  `file_path` text NOT NULL,
  PRIMARY KEY (`id`),
  KEY `report_id` (`report_id`),
  CONSTRAINT `report_files_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.report_files : ~2 rows (environ)
DELETE FROM `report_files`;
INSERT INTO `report_files` (`id`, `report_id`, `file_path`) VALUES
	(1, 3, '/report-files/1744372582714-914572905.png'),
	(2, 3, '/report-files/1744372582722-206264008.pdf');

-- Listage de la structure de table yshare. report_messages
CREATE TABLE IF NOT EXISTS `report_messages` (
  `id` int NOT NULL AUTO_INCREMENT,
  `report_id` int NOT NULL,
  `sender_id` int NOT NULL,
  `message` text NOT NULL,
  `date_sent` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `report_id` (`report_id`),
  KEY `sender_id` (`sender_id`),
  CONSTRAINT `report_messages_ibfk_1` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE,
  CONSTRAINT `report_messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.report_messages : ~3 rows (environ)
DELETE FROM `report_messages`;
INSERT INTO `report_messages` (`id`, `report_id`, `sender_id`, `message`, `date_sent`) VALUES
	(1, 3, 30, 'report verifier votre report a bien ete pris en compte et le necessaire a ete effectuer ', '2025-04-24 10:11:17'),
	(2, 3, 28, 'merci pour votre retour super genial trop bien', '2025-04-24 10:13:35'),
	(3, 3, 30, 'dzadaadadadzad', '2025-04-24 10:08:47'),
	(4, 3, 30, 'dzrererer', '2025-04-25 08:31:13');

-- Listage de la structure de table yshare. users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` text NOT NULL,
  `lastname` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `role` enum('Utilisateur','Administrateur') DEFAULT 'Utilisateur',
  `provider` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `profile_image` text,
  `bio` text,
  `city` varchar(255) DEFAULT NULL,
  `street` varchar(255) DEFAULT NULL,
  `street_number` varchar(50) DEFAULT NULL,
  `banner_image` text,
  `status` enum('Approved','Suspended') DEFAULT 'Approved',
  `phone` varchar(20) DEFAULT NULL,
  `show_email` tinyint(1) DEFAULT '1',
  `show_address` tinyint(1) DEFAULT '1',
  `show_phone` tinyint(1) DEFAULT '0',
  `birthdate` date DEFAULT NULL,
  `gender` enum('Homme','Femme','Autre','Préféré ne pas dire') DEFAULT NULL,
  `linkedin_url` text,
  `insta_url` text CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
  `website_url` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=38 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Listage des données de la table yshare.users : ~12 rows (environ)
DELETE FROM `users`;
INSERT INTO `users` (`id`, `name`, `email`, `lastname`, `password`, `role`, `provider`, `profile_image`, `bio`, `city`, `street`, `street_number`, `banner_image`, `status`, `phone`, `show_email`, `show_address`, `show_phone`, `birthdate`, `gender`, `linkedin_url`, `insta_url`, `website_url`) VALUES
	(13, 'John', 'johndoe@example.com', 'Doe', '$2a$10$bOUc3pez25HnLJ514XI2ruQCmqxi92j8bQa/48Wj4z.3ijoWj/2OO', 'Utilisateur', NULL, '/profile-images/1742984852871-722505095.jpg', NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, 1, 1, 1, NULL, NULL, NULL, NULL, NULL),
	(14, 'Admin', 'admin@example.com', 'Master', '$2a$10$8rhd4a8O1l4aB1zty8FXV.d4RCzKmVGvXGwdhR9luJw0SQRq7WVUq', 'Administrateur', NULL, '/profile-images/1742984852871-722505095.jpg', NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, 1, 1, 1, NULL, NULL, NULL, NULL, NULL),
	(15, 'Johnny', 'user@example.com', 'Doe', '$2a$10$.uBsQluiOs8o58tj5K.m8exfzfu9ilpnoMm7tsIcJQfR/Zs35UZZu', 'Utilisateur', NULL, '/profile-images/1742984852871-722505095.jpg', NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, 1, 1, 1, NULL, NULL, NULL, NULL, NULL),
	(16, 'User', 'user@exampdddle.com', 'Test', '$2a$10$fpMIJMeb7ZZdI1TpyQDQYO6WPAGYaCzwE/NUdxDst6eCkZZ/7vS9G', 'Utilisateur', NULL, '/profile-images/1742984852871-722505095.jpg', NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, 1, 1, 1, NULL, NULL, NULL, NULL, NULL),
	(17, 'alex', 'a@gmail.com', 'alex', '$2a$10$5OUB40.XvQOMIjdEqSfB5OdxZDvHW9beT6Bfd/m0TCdOtAW0iv3mK', 'Utilisateur', NULL, '/profile-images/1742984852871-722505095.jpg', NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, 1, 1, 1, NULL, NULL, NULL, NULL, NULL),
	(28, 'Alexandre', 'alex.perezab470@gmail.com', 'Perez', '$2a$10$IlcXn/mzK9Xvk6Of8N8OR.FPsgST7JP1yLPn5ZdJVv6Xjas6ELzcO', 'Utilisateur', NULL, '/profile-images/1746777390451-588978481.png', '👋 Salut, moi c’est Alexandre Perez, j’ai 21 ans et je suis actuellement en 3ᵉ année de formation en développement web. Passionné par la tech, je suis ici pour mettre mes compétences au service de vos projets tout en continuant à monter en puissance dans ce domaine.\n\n💻 Je maîtrise un large éventail de technologies back-end et front-end, parmi lesquelles : JavaScript, Python (Django, Flask), PHP (Laravel, Symfony), Node.js, HTML/CSS, Bootstrap, Tailwind, React, Angular, Vue.js, mais aussi des outils orientés jeux et apps interactives comme Unreal Engine (C++), Unity (C#), ainsi que WordPress et Shopify.\n\n🚀 Mon objectif ? Allier apprentissage constant et valeur ajoutée pour vos idées. Si vous cherchez un profil jeune, motivé, et polyvalent, parlons de votre projet !\n', 'Argenteuil', 'avenue marie', '6', '/banner-images/1746777411791-984099653.jpg', 'Approved', NULL, 0, 0, 1, '2004-08-11', 'Homme', 'dazdzdaazdadaz', NULL, NULL),
	(29, 'l\'ancien d\'argenteuil', 'alex11@gmail.com', 'perezzz', '$2a$10$DS7nPlAz4dsvohBNxuMdCe3erxuSXuE5HIDjxD9VSxu/fnWI9M1ay', 'Utilisateur', NULL, '/profile-images/1744123074825-631065849.png', NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, 1, 1, 1, NULL, NULL, NULL, NULL, NULL),
	(30, 'Alexandre', 'admin@gmail.com', 'Perez', '$2a$10$CC8h2k8x.P9UUweDZTjhzur7f6pTcXE6UoHcxAH9hvQPiS3ajVedu', 'Administrateur', NULL, '/profile-images/1744640026597-177124585.png', NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, 1, 1, 1, NULL, NULL, NULL, NULL, NULL),
	(31, 'Corentin', 'alex@gmail.com', 'pinder-white', '$2a$10$f8hsvpLsoXZXEVkvBLx7nu4NDqfEQBNRqbCRJyHvnqS2KBLPmEnzi', 'Administrateur', NULL, '/profile-images/1745327857504-741394160.png', NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, 1, 1, 1, NULL, NULL, NULL, NULL, NULL),
	(33, 'Alexandre', 'alex.pere70@gmail.com', 'Perez', '$2a$10$dhqJqW/qfmscjYnhLUeaPOuitPnJsGJXbOuR.ooWLyJY6Uh484fBG', 'Utilisateur', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, 1, 1, 0, NULL, 'Autre', NULL, NULL, NULL),
	(34, 'Alexandre', 'alex.pere@gmail.com', 'Perez', '$2a$10$D6J8bnO5ZymgXdE6EUwvk.FzoM.KOwiyO28GFD.P3yYTjKNPO4qT.', 'Utilisateur', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, 1, 1, 0, NULL, 'Préféré ne pas dire', NULL, NULL, NULL),
	(36, 'Witeez', 'alex.perez.ap460@gmail.com', 'Gaming live', NULL, 'Utilisateur', 'google', '/profile-images/221ae01c-8d93-4c9d-9041-e1fdac1028ce.jpg', NULL, NULL, NULL, NULL, NULL, 'Approved', NULL, 1, 1, 0, NULL, NULL, NULL, NULL, NULL);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;

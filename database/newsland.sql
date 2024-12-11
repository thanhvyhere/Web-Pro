CREATE DATABASE IF NOT EXISTS newslanddb
CHARACTER SET utf8
COLLATE utf8_unicode_ci;

USE newslanddb
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `githubId` varchar(255),
  `googleId` varchar(255),
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL, -- Cột name
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `dob` date NOT NULL,
  `permission` int(11) NOT NULL,
  `NoOfFollower` int(11) DEFAULT 0,    -- Số người theo dõi
  `NoOfFollowing` int(11) DEFAULT 0,  -- Số người đang theo dõi
  `PublicPlaylist` int(11) DEFAULT 0, -- Số playlist công khai
  PRIMARY KEY (`id`),
  UNIQUE (`name`) -- Thêm chỉ mục UNIQUE cho cột name
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `userRefreshTokenExt` (
  `ID` int(11) NOT NULL,
  `RefreshToken` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `rdt` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`ID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
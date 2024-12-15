CREATE DATABASE IF NOT EXISTS newslanddb
CHARACTER SET utf8
COLLATE utf8_unicode_ci;

USE newslanddb;

CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `githubId` varchar(255),
  `googleId` varchar(255),
  `username` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `dob` date NOT NULL,
  `permission` int(11) NOT NULL,
  `NoOfFollower` int(11) DEFAULT 0,
  `NoOfFollowing` int(11) DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `userRefreshTokenExt` (
  `ID` int(11) NOT NULL,
  `RefreshToken` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  `rdt` datetime(6) NOT NULL,
  PRIMARY KEY (`ID`),
  CONSTRAINT `fk_user_id` FOREIGN KEY (`ID`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

CREATE TABLE `otp_table` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `email` VARCHAR(255) NOT NULL,
    `otp` VARCHAR(6) NOT NULL,
    `expire_time` BIGINT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `RoleID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `RoleName` VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`RoleID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `roles` (`RoleName`) VALUES
('guest'),
('subscriber'),
('writer'),
('editor'),
('administrator');


DROP TABLE IF EXISTS `features`;
CREATE TABLE `features` (
  `FeatureID` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
  `FeatureName` VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
  `PathName` VARCHAR(255) COLLATE utf8_unicode_ci NOT NULL,
  `RoleID` INT(11) UNSIGNED,
  `Icon` VARCHAR(255) COLLATE utf8_unicode_ci DEFAULT NULL,  -- Thêm cột icon
  PRIMARY KEY (`FeatureID`),
  CONSTRAINT `fk_features_role` FOREIGN KEY (`RoleID`) REFERENCES `roles` (`RoleID`) 
    ON DELETE SET NULL 
    ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;



INSERT INTO `features` (`FeatureName`, `PathName`, `RoleID`, `Icon`) VALUES
-- Features của subscriber
('Thư viện', 'library', 2, '<i class="bi bi-book"></i>'),
('Đã tải xuống', 'downloaded', 2, '<i class="bi bi-stars"></i>'),
('Premium', 'premium', 2, '<i class="bi bi-crown"></i>'),
('Yêu thích', 'favorites', 2, '<i class="bi bi-heart"></i>'),

-- Features của writer
('Tạo bài viết', 'create_article', 3, '<i class="bi bi-pencil"></i>'),
('Đã được duyệt', 'approved', 3, '<i class="bi bi-check-circle"></i>'),
('Đã xuất bản', 'published', 3, '<i class="bi bi-file-earmark-check"></i>'),
('Bị từ chối', 'rejected', 3, '<i class="bi bi-x-circle"></i>'),
('Chưa được duyệt', 'pending_approval', 3, '<i class="bi bi-clock"></i>'),

-- Features của editor
('Kho báo', 'repository', 4, '<i class="bi bi-archive"></i>'),
('Đã nhận xét', 'reviewed', 4, '<i class="bi bi-chat-dots"></i>'),
('Đã từ chối', 'editor_rejected', 4, '<i class="bi bi-x-octagon"></i>'),
('Đã duyệt', 'editor_approved', 4, '<i class="bi bi-check-circle-fill"></i>'),
('Lịch đăng', 'schedule', 4, '<i class="bi bi-calendar"></i>'),

-- Features của administrator
('Quản lý danh mục', 'manage_categories', 5, '<i class="bi bi-gear"></i>'),
('Quản lý nhãn', 'manage_tags', 5, '<i class="bi bi-tag"></i>'),
('Quản lý bài viết', 'manage_articles', 5, '<i class="bi bi-file-earmark"></i>'),
('Quản lý danh sách người dùng', 'manage_users', 5, '<i class="bi bi-person-lines-fill"></i>');

-- ----------------------------
-- Table structure for categories
-- ----------------------------
DROP TABLE IF EXISTS `categories`;
CREATE TABLE `categories` (
  `CatID` int(11) unsigned NOT NULL AUTO_INCREMENT,    -- ID danh mục
  `CatName` varchar(255) COLLATE utf8_unicode_ci NOT NULL, -- Tên danh mục
  `parent_id` int(11) unsigned DEFAULT NULL,           -- ID danh mục cha (NULL nếu là cấp 1)
  PRIMARY KEY (`CatID`),
  FOREIGN KEY (`parent_id`) REFERENCES `categories`(`CatID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Thời sự', NULL),
('Góc nhìn', NULL),
('Thế giới', NULL),
('Video', NULL),
('Podcasts', NULL),
('Kinh doanh', NULL),
('Bất động sản', NULL),
('Khoa học', NULL),
('Giải trí', NULL),
('Thể thao', NULL),
('Pháp luật', NULL),
('Giáo dục', NULL),
('Sức khỏe', NULL),
('Đời sống', NULL),
('Du lịch', NULL),
('Số hóa', NULL),
('Xe', NULL),
('Ý kiến', NULL),
('Tâm sự', NULL),
('Thư giãn', NULL);

-- Thời sự
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Chính trị', 1), 
('Dân sinh', 1),
('Lao động - Việc làm', 1),
('Giao thông', 1);

-- Góc nhìn
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Bình luận nhiều', 2),
('Chính trị & chính sách', 2),
('Y tế & sức khỏe', 2),
('Kinh doanh & quản trị', 2),
('Giáo dục & tri thức', 2),
('Môi trường', 2),
('Văn hóa & lối sống', 2),
('Covid 19', 2),
('Tác giả', 2);

-- Thế giới
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Tư liệu', 3),
('Phân tích', 3),
('Người Việt 5 châu', 3),
('Cuộc sống đó đây', 3),
('Quân sự', 3);

-- Video
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Thời sự', 4),
('Nhịp sống', 4),
('Food', 4),
('Pháp luật', 4);

-- Podcasts
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('VnExpress hôm nay', 5),
('Tâm điểm kinh tế', 5),
('Tài chính cá nhân', 5),
('Giải mã', 5);

-- Kinh doanh
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('NetZero', 6),
('Quốc tế', 6),
('Doanh nghiệp', 6),
('Chứng khoán', 6);

-- Bất động sản
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Chính sách', 7),
('Thị trường', 7),
('Dự án', 7);

-- Khoa học
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Khoa học trong nước', 8),
('Chỉ số PII', 8),
('Tin tức', 8);

-- Giải trí
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Giới sao', 9),
('Sách', 9),
('Video', 9);

-- Thể thao
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('ASEAN Cup 2024', 10),
('Bóng đá', 10),
('Lịch thi đấu', 10);

-- Pháp luật
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Hồ sơ phá án', 11),
('Tư vấn', 11),
('Video', 11);

-- Giáo dục
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Tin tức', 12),
('Tuyển sinh', 12),
('Chân dung', 12);

-- Sức khỏe
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Tin tức', 13),
('Các bệnh', 13),
('Sống khỏe', 13),
('Vaccine', 13);

-- Đời sống
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Nhịp sống', 14),
('Tổ ấm', 14),
('Bài học sống', 14),
('Cooking', 14);

-- Du lịch
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Điểm đến', 15),
('Ẩm thực', 15),
('Dấu chân', 15),
('Tư vấn', 15);

-- Số hóa
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Công nghệ', 16),
('Sản phẩm', 16),
('Blockchain', 16),
('Kinh nghiệm', 16);

-- Xe
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Thị trường', 17),
('Car Awards 2024', 17),
('Diễn đàn', 17),
('V-Car', 17);

-- Ý kiến
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Thời sự', 18),
('Đời sống', 18);

-- Tâm sự
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Hẹn hò', 19);

-- Thư giãn
INSERT INTO `categories` (`CatName`, `parent_id`) VALUES 
('Cười', 20),
('Đố vui', 20),
('Chuyện lạ', 20),
('Crossword', 20);



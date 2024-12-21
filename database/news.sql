DROP TABLE IF EXISTS `news_tags`;
DROP TABLE IF EXISTS `tag`;
DROP TABLE IF EXISTS `news`;
DROP TABLE IF EXISTS `status`;
CREATE TABLE `tag` (
  `TagID` int(11) unsigned NOT NULL AUTO_INCREMENT, -- ID của tag
  `TagName` varchar(255) COLLATE utf8_unicode_ci NOT NULL, -- Tên tag
  PRIMARY KEY (`TagID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


CREATE TABLE `status` (
  `StatusID` int(11) unsigned NOT NULL AUTO_INCREMENT, -- ID trạng thái
  `StatusName` varchar(255) COLLATE utf8_unicode_ci NOT NULL, -- Tên trạng thái
  PRIMARY KEY (`StatusID`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;


-- Chèn dữ liệu vào bảng status
INSERT INTO `status` (`StatusName`) VALUES
  ('Đã duyệt'),
  ('Đang chờ'),
  ('Đã đăng'),
  ('Đã từ chối'),
  ('Đã xóa'),
  ('Đã nhận xét'),
  ('Đã chỉnh sửa');

CREATE TABLE `news` (
  `NewsID` int(11) unsigned NOT NULL AUTO_INCREMENT, -- ID bài viết
  `CreatedDate` DATE DEFAULT CURRENT_DATE, -- Lấy ngày hiện tại
  `Title` varchar(255) COLLATE utf8_unicode_ci NOT NULL, -- Tiêu đề bài viết
  `Content` text COLLATE utf8_unicode_ci NOT NULL, -- Nội dung bài viết
  `Abstract` text COLLATE utf8_unicode_ci NOT NULL, -- Mô tả ngắn
  `CatID` int(11) NOT NULL, -- ID danh mục
  `AuthorName` varchar(100) NOT NULL, -- Tên tác giả
  `ImageCover` varchar(255) COLLATE utf8_unicode_ci, -- Đường dẫn đến ảnh bìa
  `Status` int(11) unsigned NOT NULL, -- ID trạng thái từ bảng status
  `PublishedDay` DATETIME, -- Ngày đăng bài
  `Feedback` TEXT COLLATE utf8_unicode_ci, -- Thêm trường Feedback
  `Views` int(11) NOT NULL DEFAULT 0, -- Lưu số lượt xem
  `Premium` BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (`NewsID`),
  FOREIGN KEY (`Status`) REFERENCES `status`(`StatusID`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
ALTER TABLE `news` ENGINE = InnoDB;

INSERT INTO `news` (
  `PublishedDay`,
  `Title`,
  `Content`,
  `CatID`,
  `AuthorName`,
  `ImageCover`,
  `Status`,
  `Abstract`,
  `Premium`
) VALUES (
  '2024-12-16 11:17:00', -- Ngày công bố bài viết
  'Hãng tin Mỹ chấp nhận bồi thường 15 triệu USD cho ông Trump', -- Tiêu đề
  '<p>ABC News xin lỗi, chấp nhận bồi thường 15 triệu USD cho ông Trump để dàn xếp vụ Tổng thống đắc cử Mỹ kiện hãng tin này tội phỉ báng.</p>
  <p>ABC News và người dẫn chương trình George Stephanopoulos hối tiếc về những phát ngôn liên quan ông Donald Trump trong chương trình phát sóng ngày 10/3, hãng tin Mỹ cho biết trong bài đăng cuối tuần trước.</p>
  <p>ABC News thông báo sẽ chi 15 triệu USD cho quỹ hoặc bảo tàng của Tổng thống đắc cử Trump để dàn xếp vụ ông kiện kênh này cùng người dẫn chương trình Stephanopoulos vì tội phỉ báng, đồng thời trả thêm một triệu USD chi phí pháp lý cho công ty của Alejandro Brito, luật sư phụ trách vụ kiện của ông Trump.</p>
  <p>""Chúng tôi rất vui mừng khi các bên đạt được thỏa thuận chấm dứt vụ kiện"", phát ngôn viên ABC News nói thêm.</p>
  <p>Hãng tin Mỹ sẽ phải chuyển 15 triệu USD vào tài khoản ký quỹ do công ty của Brito quản lý và thanh toán chi phí pháp lý cho luật sư này trong vòng 10 ngày.</p>
  <p>Tổng thống đắc cử chưa phản hồi về lời xin lỗi và bồi thường của ABC News.</p>
  <p>
  <img src="https://i1-vnexpress.vnecdn.net/2024/12/16/AP24348068968219-6590-1734320666.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=3IMba01gOo9Fa8zQ0CGFjQ" alt="Tổng thống đắc cử Donald Trump tại West Palm Beach, Florida, ngày 6/11. Ảnh: AP">
  </p>
  <p>Tổng thống đắc cử Donald Trump tại West Palm Beach, Florida, ngày 6/11. Ảnh: <i>AP</i>
  </p>
  <p>Người dẫn chương trình Stephanopoulos hồi tháng 3 nói trên sóng truyền hình rằng ông Trump đã bị kết tội ""cưỡng hiếp"" cựu nhà báo E. Jean Carroll.</p>
  <p>Thực tế, bồi thẩm đoàn New York cho rằng ông Trump đã ""lạm dụng tình dục"" Carroll, không kết luận rằng ông Trump phạm tội cưỡng hiếp theo định nghĩa trong pháp luật bang. Tuy nhiên, thẩm phán nói điều đó không có nghĩa là Carroll ""không chứng minh được rằng ông Trump đã ''cưỡng hiếp'' mình, như cách nhiều người thường hiểu về từ ''cưỡng hiếp''"".</p>
  <p>Sau khi chương trình lên sóng, ông Trump đã kiện ABC News và George Stephanopoulos vì tội phỉ báng.</p>', -- Nội dung bài viết
  
  21, -- ID danh mục
  'Phương Thảo', -- Tên tác giả
  'https://i1-vnexpress.vnecdn.net/2024/12/16/AP24348068968219-6590-1734320666.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=3IMba01gOo9Fa8zQ0CGFjQ', -- Ảnh bìa
  3, -- Trạng thái
  'ABC News xin lỗi và đồng ý bồi thường 15 triệu USD cho ông Trump để dàn xếp vụ kiện phỉ báng liên quan đến phát ngôn sai lệch của người dẫn chương trình George Stephanopoulos. Hãng tin sẽ chuyển tiền vào tài khoản ký quỹ và trả thêm chi phí pháp lý cho luật sư của ông Trump. Vụ kiện bắt nguồn từ việc Stephanopoulos tuyên bố sai lệch rằng ông Trump bị kết tội "cưỡng hiếp" cựu nhà báo E. Jean Carroll.'
,TRUE), (
  '2024-12-14',
  'Tổng thống Hàn Quốc bị luận tội, đình chỉ chức vụ',
  '<p>Quốc hội Hàn Quốc bỏ phiếu thông qua kiến nghị luận tội Tổng thống Yoon Suk-yeol do phe đối lập đưa ra, khiến ông bị đình chỉ chức vụ.</p>
  <p>Đề xuất luận tội Tổng thống Yoon Suk-yeol vì ""hành vi nổi loạn phá hoại trật tự hiến pháp"" được quốc hội Hàn Quốc thông qua lúc 17h01 hôm nay (15h01 giờ Hà Nội), trong đó 204 nghị sĩ ủng hộ luận tội, 85 người phản đối, 3 nghị sĩ bỏ phiếu trắng và 8 phiếu không hợp lệ.</p>
  <p>Điều này đồng nghĩa Tổng thống Yoon sẽ bị đình chỉ chức vụ trong thời gian Tòa án Hiến pháp ra phán quyết và Thủ tướng Han Duck-soo sẽ đảm nhiệm vai trò tổng thống lâm thời. Tòa có 180 ngày để ra phán quyết về tương lai của ông Yoon.</p>
  <p>Đây là lần thứ ba Hàn Quốc có tổng thống đương nhiệm bị luận tội kể từ năm 1987, sau ông Roh Moo-hyun năm 2004 và bà Park Geun-hye năm 2016.</p>
  <figure class=""image"">
  <img src="https://i1-vnexpress.vnecdn.net/2024/12/14/PYH2024121406270001301-P4-1734-4811-5855-1734162279.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=CgvTjuT-Xq-bTB862Y-rtQ" alt="Nghị sĩ Kwon Seong-dong, lãnh đạo đảng cầm quyền Quyền lực Nhân dân, bỏ phiếu về kiến nghị luận tội Tổng thống Yoon Suk-yeol. Ảnh: Yonhap">
  </figure>
  <p>Nghị sĩ Kwon Seong-dong, lãnh đạo đảng PPP cầm quyền, bỏ phiếu về kiến nghị luận tội Tổng thống Yoon chiều 14/12. Ảnh: <i>Yonhap</i>
  </p>
  <p>Tổng thống Yoon Suk-yeol chưa bình luận về thông tin, trong khi Thủ tướng Han Duck-soo khẳng định sẽ ""dành toàn lực để ổn định các hoạt động của đất nước"".</p>
  <p>Phe đối lập đã hoan nghênh kết quả bỏ phiếu. ""Quyết định luận tội hôm nay là thắng lợi to lớn của người dân Hàn Quốc"", lãnh đạo đảng Dân chủ đối lập Park Chan-dae nói.</p>
  <p>Hãng thông tấn <i>Yonhap</i> trước đó<i>
  </i>cho biết Tổng thống Yoon nhiều khả năng sẽ theo dõi kết quả cuộc bỏ phiếu từ dinh thự ở Hannam-dong. Văn phòng Thủ tướng Hàn Quốc và Văn phòng Điều phối Chính sách Chính phủ cũng đang theo dõi sát sao tình hình cuộc bỏ phiếu.</p>
  <p>Phát ngôn viên PPP Kim Dae-sik cho biết các thành viên đảng cầm quyền đã họp kín trước sự kiện. ""Chúng tôi kết luận hai điều, đó là sẽ tham gia cuộc bỏ phiếu và PPP vẫn phản đối đề xuất luận tội"", ông Kim nói.</p>
  <p>Nhiều người dân đã tập trung trước tòa nhà quốc hội Hàn Quốc để kêu gọi phế truất Tổng thống Yoon. Một cảnh sát Seoul ước tính đám đông lên đến 200.000 người.</p>
  <figure class=""image"">
  <img src="https://i1-vnexpress.vnecdn.net/2024/12/14/PYH2024121405880001300-P4-1734-4722-1113-1734162928.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=c7VZoLvSnPxOW2rlz8yTDw" alt="Người biểu tình kêu gọi ông Yoon Suk-yeol từ chức ở quận Yeongdeungpo, Seoul. Ảnh: Yonhap">
  </figure>
  <p>Người biểu tình kêu gọi ông Yoon Suk-yeol từ chức ở quận Yeongdeungpo, Seoul chiều 14/12. Ảnh: <i>Yonhap</i>
  </p>
  <p>""Nếu ông Yoon không bị luận tội hôm nay, tôi sẽ trở lại vào tuần sau. Tôi sẽ đến đây hàng tuần cho đến khi chuyện đó thành hiện thực"", Yoo Hee-jin, 24 tuổi, nói.</p>
  <p>Trong khi đó, khoảng 30.000 người tập trung tại quảng trường Gwanghwamun để thể hiện ủng hộ ông Yoon. Họ bật các bài hát yêu nước, vẫy quốc kỳ Hàn Quốc và Mỹ. ""Ông Yoon không có lựa chọn nào ngoài ban bố thiết quân luật. Tôi chấp nhận mọi quyết định ông ấy đưa ra trên cương vị Tổng thống"", bà Choi Hee-sun, 62 tuổi, nêu quan điểm.</p>
  <p>Quốc hội Hàn Quốc gồm 300 nghị sĩ, trong đó phe đối lập giữ 192 ghế. Kiến nghị luận tội ông Yoon, do phe đối lập đề xuất ngày 12/12, cần hội đủ 200 phiếu để được thông qua, đồng nghĩa phải có ít nhất 8 nghị sĩ từ đảng Quyền lực Nhân dân (PPP) cầm quyền đứng về phía họ.</p>
  <p>Trong trường hợp tòa ủng hộ bãi nhiệm, ông Yoon sẽ trở thành tổng thống thứ hai trong lịch sử Hàn Quốc bị phế truất bằng quá trình luận tội. Tuy nhiên, Tòa án Hiến pháp hồi năm 2004 từng ngăn luận tội và phục chức cho tổng thống khi đó là Roh Moo-hyun, người bị quốc hội bỏ phiếu bãi nhiệm vì cáo buộc vi phạm luật bầu cử và thiếu năng lực.</p>
  <figure class=""image"">
  <img src="https://i1-vnexpress.vnecdn.net/2024/12/14/2024-12-07T014936Z-881627165-R-6560-8407-1734159308.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=NXIx5X8bKsvTKhiRmFFBjA" alt="Tổng thống Hàn Quốc Yoon Seok-yeol phát biểu ngày 7/12. Ảnh: Reuters">
  </figure>
  <p>Tổng thống Hàn Quốc Yoon Seok-yeol phát biểu ngày 7/12. Ảnh: <i>Reuters</i>
  </p>
  <p>Phe đối lập lần đầu kiến nghị luận tội ông Yoon hồi tuần trước nhưng thất bại trong cuộc bỏ phiếu ngày 7/12 vì bị các thành viên PPP tẩy chay, chỉ có hai nghị sĩ đảng cầm quyền tham gia nên không thể đủ mức 200 phiếu cần thiết.</p>',
  
  21,
  'Phương Thảo',
  'https://i1-vnexpress.vnecdn.net/2024/12/14/2024-12-07T014936Z-881627165-R-6560-8407-1734159308.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=D4l6Fo3giTk5HLYqZI6Hqw',
  3,
  'Quốc hội Hàn Quốc thông qua kiến nghị luận tội Tổng thống Yoon Suk-yeol với cáo buộc "phá hoại trật tự hiến pháp", khiến ông bị đình chỉ chức vụ. Thủ tướng Han Duck-soo tạm thời đảm nhiệm vai trò tổng thống lâm thời trong khi Tòa án Hiến pháp có 180 ngày để ra phán quyết. Người dân và phe đối lập hoan nghênh kết quả, trong khi đảng cầm quyền phản đối mạnh mẽ.'
,FALSE)
,(
  '2024-12-16 09:40:00', 'Quỹ từ thiện Bill Gates sắp nhận cổ tức gần chục tỷ từ Masan Consumer', 
  '<p>Nắm hơn 1 triệu cổ phiếu MCH, quỹ từ thiện Bill &amp; Melinda Gates Foundation Trust của tỷ phú người Mỹ, sắp nhận gần 10 tỷ đồng cổ tức.</p>
  <p>Công ty cổ phần Hàng tiêu dùng Masan (Masan Consumer - MCH) vừa thông báo ngày đăng ký cuối cùng để chi trả tạm ứng <a href="https://vnexpress.net/co-tuc-la-gi-4494582.html">cổ tức</a> năm 2024 bằng tiền. Công ty đưa ra tỷ lệ 95%, tức mỗi cổ phiếu sẽ nhận 9.500 đồng. Ngày thanh toán là 30/12.</p>
  <p>Trước đó, Masan Consumer công bố quỹ từ thiện Bill &amp; Melinda Gates Foundation Trust của tỷ phú <a href="https://vnexpress.net/chu-de/bill-gates-1851">Bill Gates</a> đang giữ hơn 1,04 triệu cổ phiếu MCH, tương đương hơn 0,14%. Đây là cổ đông lớn thứ 11 của công ty.</p>
  <p>Như vậy, quỹ từ thiện trên sẽ nhận về hơn 9,88 tỷ đồng. Trước đó trong hai đợt chia cổ tức năm 2023, quỹ này được cho là có thể nhận về gần 28 tỷ đồng.</p>
  <figure class="image">
  <img src="https://i1-kinhdoanh.vnecdn.net/2024/12/16/lnmc2h3xrbknvfo6irc3njc5oy-171-2610-3397-1734314839.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=B-7N37HO-Zg8QTGrcvxOoA" alt="Tỷ phú Bill Gates tại London (Anh) hôm 15/2. Ảnh: Reuters">
  </figure>
  <p>Tỷ phú Bill Gates tại London (Anh) hôm 15/2. Ảnh: <i>Reuters</i></p>
  <p>Bill &amp; Melinda Gates Foundation Trust là công ty nhận ủy thác tài chính từ Bill &amp; Melinda Gates Foundation - quỹ từ thiện được góp vốn bởi nhà sáng lập Microsoft Bill Gates và vợ cũ Melinda French Gates, về sau có thêm sự tham gia của tỷ phú đầu tư <a href="https://vnexpress.net/chu-de/warren-buffett-1859">Warren Buffett</a>. Tính đến cuối năm 2023, giá trị tài sản ròng của công ty ủy thác đạt khoảng 75,2 tỷ USD, chủ yếu là các khoản đầu tư tài chính.</p>
  <p>Từ lâu, Bill &amp; Melinda Gates Foundation Trust đã gián tiếp đầu tư vào Việt Nam. Họ tham gia thị trường <a href="https://vnexpress.net/chu-de/chung-khoan-3761">chứng khoán</a> thông qua Vietnam Enterprise Investments Limited (VEIL) - quỹ đầu tư lớn nhất trên thị trường do Dragon Capital quản lý. Đến cuối tháng 6, quỹ này là cổ đông lớn thứ hai của VEIL khi nắm gần 24,7 triệu chứng chỉ quỹ.</p>
  <p>Lần này, MCH dự tính chi gần 6.900 tỷ đồng cho đợt tạm ứng cổ tức năm 2024. Họ gần như dùng hết lợi nhuận cả năm để chi trả khi lãi lũy kế chưa phân phối đến cuối quý III ghi nhận gần 5.478 tỷ đồng. Động thái trên diễn ra trước thềm chuyển MCH từ UPCoM sang sàn HoSE, dự kiến trong đầu năm sau.</p>
  <p>MCH chia cổ tức đậm nhờ kết quả kinh doanh tích cực. 9 tháng đầu năm, doanh thu đạt gần 21.955 tỷ đồng, tăng 11% so với cùng kỳ năm trước. Lợi nhuận sau thuế ghi nhận gần 5.553 tỷ đồng, tăng 14%. Trung bình mỗi ngày, công ty lãi hơn 20 tỷ đồng.</p>
  <p>Masan Consumer là một trong những trụ cột tăng trưởng chính của <a href="https://vnexpress.net/chu-de/masan-1520">Tập đoàn Masan</a>, bên cạnh chuỗi bán lẻ hiện đại WinCommerce. Họ cho biết sở hữu 5 thương hiệu đạt doanh thu trên 2.000 tỷ đồng, gồm Chin-su, Omachi, Kokomi, Nam Ngư và WakeUp 247.</p>', 
  50, 'Phương Thảo', 
  'https://i1-kinhdoanh.vnecdn.net/2024/12/16/lnmc2h3xrbknvfo6irc3njc5oy-171-2610-3397-1734314839.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=B-7N37HO-Zg8QTGrcvxOoA', 
  3,'Quỹ từ thiện Bill & Melinda Gates Foundation Trust của tỷ phú Bill Gates sắp nhận gần 10 tỷ đồng cổ tức từ Masan Consumer (MCH) nhờ nắm giữ hơn 1,04 triệu cổ phiếu. Masan Consumer chi gần 6.900 tỷ đồng để tạm ứng cổ tức năm 2024, với tỷ lệ 95% (9.500 đồng/cổ phiếu), nhờ lợi nhuận 9 tháng đầu năm đạt hơn 5.553 tỷ đồng. Động thái này diễn ra trước kế hoạch chuyển niêm yết MCH từ UPCoM sang sàn HoSE đầu năm sau.'
  , FALSE),

(
  '2024-12-09 19:00:00', 'Taylor Swift khép lại The Eras Tour', 
  '<p>Ca sĩ Taylor Swift tổ chức đêm nhạc cuối của "The Eras Tour" tại Vancouver, hoàn thành 149 buổi diễn sau gần hai năm thực hiện.</p>
  <p>Chặng cuối của <i>The Eras Tour</i> diễn ra tại sân vận động BC Place với khoảng 60.000 người tham dự mỗi đêm, từ ngày 6 đến 8/12 (giờ địa phương). Theo <i>CNN</i>, trong đêm 8/12, Taylor Swift nói với người hâm mộ đến nay cô đã biểu diễn trước hơn 10 triệu khán giả, cảm ơn tất cả mang lại trải nghiệm "hoàn toàn khác với những gì bản thân từng làm trong đời".</p>
  <p>Nghệ sĩ nói thêm: "Tôi nghĩ di sản của chuyến lưu diễn này là việc các bạn cùng nhau tạo nên không gian ngập tràn niềm vui, sự gắn bó và tình yêu".</p>
  <figure class="image">
  <img src="https://i1-giaitri.vnecdn.net/2024/12/09/76836190007-20241207-t-050230-9328-3110-1733739480.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=aLQmAyLBDNjzZWevNHBVXw" alt="Taylor Swift tại đêm diễn ngày 6/12 - một trong ba đêm diễn của cô tại Vancouver. Ảnh: Reuters">
  </figure>
  <p>Taylor Swift trong show ngày 6/12 - một trong ba đêm diễn của cô tại Vancouver. Ảnh: <i>Reuters</i></p>
  <p>Chương trình thu hút nhiều sự quan tâm, luôn trong tình trạng "cháy" vé. Nhiều người nổi tiếng, nhân vật quyền lực như Thủ tướng Canada Justin Trudeau, Thái tử Anh William, cựu Tổng thống Mỹ Bill Clinton, tài tử Tom Cruise và minh tinh Cate Blanchet từng đến xem.</p>
  <p>The Eras Tour là chuyến lưu diễn quốc tế gây tiếng vang của Taylor Swift. Đây là chuỗi hòa nhạc đầu tiên của nghệ sĩ kể từ <i>Reputation Stadium Tour</i> năm 2018. Ca sĩ khởi động buổi diễn đầu tiên tại bang Arizona, Mỹ vào tháng 3/2023, dự tính có 27 show nhưng quyết định thêm suất để tất cả fan có thể tham gia, theo <i>Forbes</i>. Ban đầu, Taylor Swift có kế hoạch tổ chức 152 đêm nhạc, đi qua 51 thành phố khắp thế giới nhưng phải hủy ba ngày ở Vienna do phát hiện âm mưu khủng bố tại đây.</p>
  <p>Sự kiện thường kéo dài khoảng ba giờ. Trong đó, khán giả thưởng thức 44 bài hát từ các album xuyên suốt sự nghiệp của Taylor Swift và một số ca khúc do các ca sĩ hỗ trợ biểu diễn như Sabrina Carpenter, Gracie Abrams, Phoebe Bridgers, Girl in Red...</p>
  <p>Chuyến lưu diễn này còn giúp kích thích nền kinh tế địa phương ở những nơi Taylor Swift biểu diễn. Theo <i>Washington Post</i>, ca sĩ giúp những nơi cô đến hút khách du lịch, góp phần tạo ra khoảng 5,7 tỷ USD cho nền kinh tế Mỹ năm 2023. <i>Time</i> cho biết mỗi thành phố cô biểu diễn, kinh tế lập tức tăng trưởng, khách sạn và nhà hàng hút khách. Các hàng hóa và sản phẩm liên quan mang lại cho ca sĩ khoảng 200 triệu USD.</p>
  <p>Tháng 12/2023, tổ chức Guinness công bố <i>The Eras Tour</i> là chuyến lưu diễn có doanh thu cao nhất lịch sử, vượt qua một tỷ USD khi đó. Kỷ lục trước đây của danh ca Elton John với <i>Farewell Yellow Brick Road</i>, hơn 900 triệu USD. Lợi nhuận mới nhất của concert chưa được công bố nhưng các trang tin ước tính hơn hai tỷ USD.</p>
  <figure class="image">
  <img src="https://iv1.vnecdn.net/giaitri/images/web/2024/06/22/trailer-the-eras-tour-cua-taylor-swift-1719021980.jpg?w=0&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=G-Oxa1hkQ0JPPAlOnEEmvw" alt="Trailer &quot;The Eras Tour&quot; của Taylor Swift">
  </figure>
  <p><a href="https://vnexpress.net/chu-de/taylor-swift-2646">Taylor Swift</a>, 35 tuổi, là ca sĩ kiêm nhạc sĩ người Mỹ, nổi lên nhờ những bản nhạc đồng quê vào năm 2006. Sau 11 album, Swift nhận về 14 giải Grammy và 29 giải Billboard, 30 cúp VMAs. Năm 2023, cô được <i>Time</i> chọn là "Nhân vật của năm". Theo <i>Forbes</i>, lợi nhuận từ chuyến lưu diễn giúp Taylor Swift vượt qua Rihanna, trở thành nữ ca sĩ <a href="https://vnexpress.net/taylor-swift-la-nu-ca-si-giau-nhat-the-gioi-4801479.html">giàu nhất</a> thế giới với 1,6 tỷ USD. Hôm 27/11, tạp chí <i>Billboard</i> công bố cô xếp hạng hai <a href="https://vnexpress.net/beyonce-la-ngoi-sao-pop-vi-dai-nhat-the-ky-21-4823118.html">Top 25</a> Ngôi sao pop vĩ đại nhất thế kỷ 21.</p>', 
  57, 'Phương Thảo', 
  'https://i1-giaitri.vnecdn.net/2024/12/09/76836190007-20241207-t-050230-9328-3110-1733739480.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=aLQmAyLBDNjzZWevNHBVXw', 
  4,'Taylor Swift kết thúc chuyến lưu diễn The Eras Tour tại Vancouver với 149 buổi diễn, thu hút hơn 10 triệu khán giả toàn cầu và phá kỷ lục doanh thu hơn 1 tỷ USD. Chương trình kéo dài ba giờ, trình diễn 44 ca khúc từ sự nghiệp của cô và góp phần tạo ra khoảng 5,7 tỷ USD cho kinh tế Mỹ. Guinness công nhận đây là chuyến lưu diễn có doanh thu cao nhất lịch sử.'
  , FALSE),
(
  '2024-12-15 22:23:00', 'Thủ môn Nguyễn Filip thắng trận đầu cùng Việt Nam', 
  '<p><span style="color:rgb(117,117,117)!important;">Phú Thọ</span>Sau chuỗi tám trận chỉ hòa và thua, thủ môn Nguyễn Filip lần đầu thắng trận cùng tuyển Việt Nam, trước Indonesia tại ASEAN Cup 2024.</p>
  <p>Trong bảy trận đầu thi đấu cho đội tuyển, tính từ Asian Cup 2023, <a href="https://vnexpress.net/chu-de/filip-nguyen-2599">Filip</a> đều nhận thất bại, trong đó có ba trận trước Indonesia, hai trận gặp Iraq, một Nhật Bản và một trận giao hữu với Thái Lan. Ở trận thứ tám anh chơi, đội tuyển bị Ấn Độ cầm hòa 1-1 trong trận giao hữu trên sân Thiên Trường.</p>
  <figure class="image">
  <img src="https://i1-thethao.vnecdn.net/2024/12/15/nguye-n-filip-jpeg-1734275848-5450-4413-1734275924.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=pPn0vkW2rZFZqe8yDflsig" alt="Thủ môn Nguyễn Filip mừng sau trận Việt Nam hạ Indonesia 1-0 tại bảng B, ASEAN Cup trên sân Việt Trì, tỉnh Phú Thọ tối 15/12/2024. Ảnh: Lâm Thỏa">
  </figure>
  <p>Thủ môn Nguyễn Filip mừng sau trận Việt Nam hạ Indonesia 1-0 tại bảng B, ASEAN Cup trên sân Việt Trì, tỉnh Phú Thọ tối 15/12/2024. Ảnh: <i>Lâm Thỏa</i></p>
  <p>Trước trận gặp Indonesia tại lượt ba bảng B ASEAN Cup hôm nay, trung vệ đội trưởng Đỗ Duy Mạnh đã bày cách để Filip "<a href="https://vnexpress.net/thu-mon-nguyen-filip-dot-via-truoc-tran-gap-indonesia-4827014.html">đốt vía</a>", bằng cách nhảy qua ngọn lửa trong phòng khách sạn. Quả thực, thủ thành 32 tuổi không chỉ giữ sạch lưới lần đầu cho đội tuyển, còn giành ba điểm.</p>
  <p>Trận này, Filip không phải hoạt động nhiều, nhưng cứu thua từ cơ hội nguy hiểm nhất của đội khách. Phút 64, tiền đạo Rafael Struick chuyền ngang cho Victor Dethan lao xuống đối mặt, nhưng cú sút của tiền vệ 20 tuổi về góc gần bị thủ thành chủ nhà đổ người đẩy ra. Đến phút 77, tiền vệ Nguyễn Quang Hải ghi bàn duy nhất giúp Việt Nam thắng 1-0 và leo lên đỉnh bảng.</p>
  <p>Kể từ khi Filip được triệu tập lên tuyển, có ba trận anh chỉ dự bị mà không thi đấu, trong đó có tới hai chiến thắng. Đặng Văn Lâm bắt chính khi <a href="https://vnexpress.net/viet-nam-vs-philippines-4755156-tong-thuat.html">Việt Nam hạ Philippines 3-2</a> tại vòng loại World Cup 2026 trên sân Mỹ Đình, còn Nguyễn Đình Triệu bắt chính khi đội tuyển ra quân thắng Lào 4-1 ở ASEAN Cup 2024.</p>
  <p>Filip sinh ra tại thành phố Praha, Tiệp Khắc, nay thuộc CH Czech, có bố người Việt Nam, mẹ người Czech. Anh từng được triệu tập lên tuyển Czech nhưng chỉ ngồi dự bị, không được bắt chính, nên vẫn đủ điều kiện khoác áo Việt Nam. Thủ thành cao 1,92 m đang chơi cho CLB Công An Hà Nội ở V-League.</p>
  <p>Giải này Văn Lâm chấn thương và vắng mặt, nên Filip là thủ môn số một của đội tuyển. Nhiều khả năng anh sẽ tiếp tục chơi những trận quan trọng tiếp theo tại ASEAN Cup.</p>', 
  10, 'Đức Trung', 'https://i1-thethao.vnecdn.net/2024/12/15/nguye-n-filip-jpeg-1734275848-5450-4413-1734275924.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=pPn0vkW2rZFZqe8yDflsig', 3,'Thủ môn Nguyễn Filip giành chiến thắng đầu tiên cùng tuyển Việt Nam khi đội hạ Indonesia 1-0 tại ASEAN Cup 2024, sau chuỗi 8 trận chỉ hòa và thua. Filip giữ sạch lưới, cứu một bàn thua nguy hiểm và góp công vào chiến thắng với pha lập công duy nhất của Quang Hải. Anh hiện là thủ môn số một của tuyển Việt Nam thay Đặng Văn Lâm đang chấn thương.',FALSE),

(
  '2024-12-14 16:23:00', 'Cả nước không hoàn thành mục tiêu xây 130.000 căn nhà xã hội', 
  '<p>Theo Bộ Xây dựng, cả nước chỉ hoàn thành 21.000 căn nhà ở xã hội, tương ứng khoảng 16% so với kế hoạch cả năm 2024.</p>
  <p>Thông tin này được Bộ Xây dựng cho biết trong dự thảo tài liệu tổng kết công tác của ngành này công bố hôm 14/12.</p>
  <p>Theo đề án xây dựng ít nhất 1 triệu căn nhà ở xã hội, năm 2024, cả nước đặt mục tiêu phát triển 130.000 căn. Dù nỗ lực, các tỉnh, thành phố cũng chỉ hoàn thành được 21.000 căn, tương ứng hơn 16% kế hoạch. Thời gian qua, lãnh đạo Bộ Xây dựng cũng nhiều lần cho biết việc hiện thực hoá mục tiêu phát triển nhà ở xã hội <a href="https://vnexpress.net/bo-truong-nguyen-thanh-nghi-de-an-xay-1-trieu-can-nha-o-xa-hoi-con-nhieu-thach-thuc-4666703.html">còn nhiều khó khăn, thách thức</a>.</p>
  <p>Việc thực hiện gói vay ưu đãi cho loại hình nhà ở này cũng hạn chế. Cụ thể, đến nay mới có 16 dự án được cho vay với tổng mức cam kết cấp tín dụng 4.200 tỷ đồng, dư nợ 1.727 tỷ.</p>
  <p>Từ 2021 đến nay, theo số liệu của Bộ Xây dựng, cả nước có 644 dự án nhà ở xã hội được triển khai với quy mô 580.109 căn. Trong đó, chỉ có 96 dự án được hoàn thành với quy mô hơn 57.620 căn. 133 dự án đã khởi công với trên 110.200 căn. Còn lại 415 dự án đã được chấp thuận chủ trương đầu tư sẽ cung cấp thêm hơn 412.200 căn nếu xây xong.</p>
  <figure class="image">
  <img src="https://i1-vnexpress.vnecdn.net/2024/12/14/img-0722-lo-n-jpeg-1734163863-7015-9226-1734164005.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=nQD_4rpI8TK8h916HjREhw" alt="Một dự án nhà ở xã hội tại Thuỷ Nguyên, Hải Phòng tháng 10/2024. Ảnh: Anh Tú">
  </figure>
  <p>Một dự án nhà ở xã hội tại Thuỷ Nguyên, Hải Phòng tháng 10/2024. Ảnh: <i>Anh Tú</i></p>
  <p>Trong năm qua, Bộ Xây dựng cũng đã đề nghị Bộ Công an và Quốc phòng thực hiện 5.000 căn nhà ở xã hội cho lực lượng vũ trang mỗi đơn vị. Đồng thời, cơ quan này cũng phối hợp với Ngân hàng Nhà nước, Ngân hàng Chính sách Xã hội để thúc đẩy phát triển nhà ở xã hội tại Hà Nội.</p>
  <p>Tại báo cáo gửi Thủ tướng hồi tháng 9, Bộ Xây dựng cho biết việc phát triển nhà ở xã hội tại hai đô thị loại đặc biệt Hà Nội và TP HCM còn chậm, chưa tới 40% chỉ tiêu dù nhu cầu rất lớn. Cụ thể, Hà Nội phải xây 18.700 căn đến 2025, nhưng thời điểm đó mới có 3 dự án được khởi công (1.700 căn) và 5 dự án xây dựng xong, với 5.200 căn, đạt gần 37% mục tiêu.</p>
  <p>TP HCM có chỉ tiêu xây xong 26.200 căn đến 2025. Tuy nhiên, thành phố đạt khoảng 21% mục tiêu với 6 dự án đã cấp phép, khởi công (gần 4.400 căn) và 4 dự án hoàn thành (hơn 1.200 căn). Ngoài ra, TP HCM đăng ký đưa 6 dự án vận hành vào năm 2025.</p>
  <p>Một số địa phương có nhu cầu về nhà xã hội nhưng chưa rõ kế hoạch triển khai tới đâu như Thái Nguyên, Ninh Bình, Nam Định, Quảng Bình, Thừa Thiên Huế, Bạc Liêu, Cà Mau... Trong số này, nhiều địa phương cũng chưa có dự án nào khởi công.</p>
  <p>Còn theo báo cáo về thị trường bất động sản của Đoàn giám sát Quốc hội, việc triển khai nhà ở xã hội còn bị động, do nguồn vốn ngân sách chưa bố trí thỏa đáng. Vì thế, phần lớn dự án xây bằng nguồn vốn ngoài nhà nước do doanh nghiệp hoặc hợp tác xã xây dựng. Trong khi thực tế nhiều doanh nghiệp tại khu công nghiệp không mặn mà việc xây nhà cho công nhân.</p>
  <p>Cùng với đó, nhiều địa phương chưa bố trí quỹ đất độc lập, chủ yếu phụ thuộc quỹ đất 20% trong dự án nhà ở thương mại. Cụ thể, giai đoạn 2015-2023, chỉ có 18 trên 63 tỉnh thành bố trí quỹ đất độc lập làm nhà xã hội và 35 địa phương bố trí quỹ 20% trong dự án nhà thương mại. Điều này dẫn đến chưa đảm bảo nguồn cung, ảnh hưởng đến giá bán, cho thuê, thuê mua nhà xã hội.</p>', 
  52, 'Đức Trung', 'https://i1-vnexpress.vnecdn.net/2024/12/14/img-0722-lo-n-jpeg-1734163863-7015-9226-1734164005.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=nQD_4rpI8TK8h916HjREhw', 3,'Cả nước chỉ hoàn thành 21.000 căn nhà ở xã hội năm 2024, đạt 16% kế hoạch 130.000 căn. Tiến độ chậm do thiếu vốn ưu đãi, quỹ đất và sự tham gia hạn chế của doanh nghiệp. Hà Nội và TP HCM mới đạt lần lượt 37% và 21% chỉ tiêu, trong khi nhiều địa phương chưa khởi công dự án nào.',FALSE),
(
  '2024-10-30 00:00:00', 
 'Tại sao cha đẻ của máy phát hiện nói dối hối hận?', 
 '<p><span style="color:rgb(117,117,117)!important;">Mỹ</span>John A. Larson trình làng máy phát hiện nói dối vào năm 1921, nhưng bản thân ông cũng không tin tưởng vào độ chính xác của nó.</p>
  <figure class="image">
  <img src="https://i1-vnexpress.vnecdn.net/2024/10/29/John-Larson-2243-1730190498.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=qOrCebUk1VajciKEgF1GNA" alt="John A. Larson năm 1921. Ảnh: Wikimedia">
  </figure>
  <p>John A. Larson năm 1921. Ảnh: <i>Wikimedia</i></p>
  <p>Để bắt kẻ nói dối, người Trung Quốc cổ đại đôi khi sẽ cho người bị buộc tội ngậm đầy gạo sống trong lúc thẩm vấn, sau đó yêu cầu há miệng. Gạo khô chỉ ra rằng miệng cũng khô. Đây được xem là bằng chứng của sự lo lắng tội lỗi - đôi khi trở thành cơ sở để xử tử.</p>
  <p>Từ lâu nhiều người đã cho rằng việc nói dối gây ra những tác dụng phụ về thể chất, và một người đàn ông nghĩ rằng mình đã tìm ra cơ chế khoa học của việc phát hiện nói dối vào những năm 1920, giữa lúc tội phạm bùng nổ. Đây là thời kỳ Mỹ cấm bán rượu và các băng nhóm buôn lậu hoạt động mạnh.</p>
  <p>Một số sở cảnh sát áp dụng biện pháp ngày càng quyết liệt để ép nghi phạm khai ra sự thật, ví dụ như đánh đập, làm bỏng bằng thuốc lá, không cho ngủ. Dù đi ngược với pháp luật, những biện pháp này vẫn diễn ra phổ biến tại Mỹ và thu được nhiều lời thú tội, nhưng nhiều lời trong số đó bị nghi ngờ về độ chính xác.</p>
  <p>August Vollmer, cảnh sát trưởng của Sở Cảnh sát Berkeley, California, nghĩ rằng có thể mở ra kỷ nguyên mới trong đó khoa học sẽ giúp quá trình thẩm vấn trở nên chính xác và nhân đạo hơn. Ông bắt đầu tuyển những người tốt nghiệp đại học để giúp chuyên nghiệp hóa lực lượng cảnh sát. Điều này phù hợp với John A. Larson, người vừa nhận bằng tiến sĩ sinh lý học tại Đại học California Berkeley và có niềm đam mê với công lý. Larson gia nhập lực lượng cảnh sát Berkeley năm 1920, trở thành tân binh đầu tiên trong vùng có bằng tiến sĩ.</p>
  <p>Vollmer và Larson đặc biệt quan tâm đến một bài kiểm tra nói dối đơn giản do William Marston, một luật sư kiêm nhà tâm lý học, sáng tạo. Larson đã nỗ lực tạo ra một bài kiểm tra phức tạp hơn nhiều. Ông thử nghiệm trong phòng thí nghiệm đại học với một tổ hợp kỳ lạ gồm bơm và đồng hồ đo gắn vào cơ thể người thông qua vòng tay và đai ngực.</p>
  <p>Thiết bị của Larson sẽ đo sự thay đổi của nhịp tim, hô hấp và huyết áp cùng lúc trong quá trình một đối tượng được thẩm vấn và giám sát liên tục. Ông tin rằng thiết bị sẽ phát hiện câu trả lời sai qua những biến động đặc biệt được một chiếc bút khắc lên cuộn giấy quay. Người vận hành sau đó sẽ phân tích và diễn giải kết quả.</p>
  <figure class="image">
  <img src="https://i1-vnexpress.vnecdn.net/2024/10/29/may-noi-doi-set-5238-1730190499.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=rMgfFPCdHwxGxWetVq9qUw" alt="Máy phát hiện nói dối đầu tiên của John A. Larson. Ảnh: Cade Martin">
  </figure>
  <p>Máy phát hiện nói dối đầu tiên của John A. Larson. Ảnh: <i>Cade Martin</i></p>
  <p>Mùa xuân năm 1921, Larson trình làng máy đo tâm lý - tim - phổi, sau này gọi là máy phát hiện nói dối (polygraph). Cỗ máy trông giống như sự kết hợp giữa bộ radio, ống nghe y tế, máy khoan nha khoa, bếp gas và nhiều thứ khác, tất cả đặt trên một bàn gỗ dài. Cỗ máy gây chú ý lớn và được tờ <i>Examiner </i>ca ngợi: "Tất cả những kẻ nói dối, dù khôn khéo, đều sẽ tiêu đời".</p>
  <p>Bản thân Larson không hoàn toàn tin vào sự thổi phồng này. Khi thử nghiệm phát minh, ông phát hiện ra tỷ lệ lỗi đáng báo động và ngày càng lo ngại về việc sử dụng chính thức. Và dù nhiều sở cảnh sát trên khắp nước Mỹ chấp nhận thiết bị này, các thẩm phán còn tỏ ra nghi ngờ hơn cả Larson.</p>
  <p>Năm 1923, Tòa Phúc thẩm Mỹ khu vực Washington D.C. tuyên bố kết quả của máy phát hiện nói dối không được chấp nhận tại phiên tòa vì các bài kiểm tra không được những chuyên gia liên quan chấp nhận rộng rãi. Tuy nhiên, cảnh sát vẫn tiếp tục sử dụng cỗ máy. Larson thậm chí đã thất vọng khi một đồng nghiệp cũ được cấp bằng sáng chế cho một phiên bản cập nhật vào năm 1931.</p>
  <p>Trong khi cỗ máy gốc của Larson phủ bụi, những người bắt chước phát triển nhiều phiên bản hiện đại hơn, tất cả đều tuân theo thông số tương tự như của Larson - và hàng triệu người đã bị kiểm tra. Thời kỳ Chiến tranh Lạnh, Bộ Ngoại giao Mỹ sử dụng máy phát hiện nói dối để loại những người bị nghi là không phù hợp khỏi chính phủ liên bang. Nhiều nhân viên vô tội đã mất công ăn việc làm, trong khi số khác - sau này mới bị phát hiện là người đối nghịch, bao gồm cả gián điệp nổi tiếng Aldrich Ames - đã đánh lừa được các bài kiểm tra.</p>
  <p>Larson đã lấy bằng y khoa và dành phần đời còn lại làm bác sĩ tâm thần. Tuy nhiên, ông vẫn luôn đau buồn về máy phát hiện nói dối. Ông mô tả thiết bị này như "quái vật Frankenstein" của mình, không thể kiểm soát hay tiêu diệt.</p>
  <p>Năm 1988, Quốc hội Mỹ cuối cùng cũng thông qua luật cấm các nhà tuyển dụng tư nhân yêu cầu kiểm tra nói dối, dù một số cơ quan chính phủ vẫn sử dụng nó cho việc sàng lọc và cảnh sát có thể dùng với nghi phạm như một công cụ điều tra trong một số trường hợp nhất định.</p>', 
   
  81, 
  'Đức Trung', 
  'https://i1-vnexpress.vnecdn.net/2024/10/29/may-noi-doi-set-5238-1730190499.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=rMgfFPCdHwxGxWetVq9qUw', 
  3,'John A. Larson phát minh máy phát hiện nói dối năm 1921 nhưng chính ông nghi ngờ độ chính xác của nó. Dù cảnh sát sử dụng rộng rãi, tòa án Mỹ từ chối kết quả này từ năm 1923. Larson gọi phát minh của mình là "quái vật Frankenstein". Năm 1988, Mỹ cấm sử dụng máy trong tuyển dụng tư nhân, nhưng nó vẫn được dùng hạn chế trong điều tra.',FALSE),
  (
    '2024-12-16 18:30:00',
    'Tổng Bí thư: Chống lợi dụng sắp xếp bộ máy để tham nhũng',
    '<p>Tổng Bí thư Tô Lâm chỉ đạo kiên quyết phòng chống việc lợi dụng chủ trương sắp xếp bộ máy, đội ngũ cán bộ để tiêu cực, tham nhũng.</p>
    <p>Sáng 16/12, phát biểu tại hội nghị toàn quốc tổng kết công tác tổ chức xây dựng Đảng năm 2024, triển khai nhiệm vụ năm 2025, Tổng Bí thư Tô Lâm cho rằng công tác tuyển chọn, đào tạo, đề bạt, bổ nhiệm, luân chuyển, điều động, đánh giá cán bộ hiện nay còn rất nhiều tồn tại.</p>
    <p>Công tác quản lý, đánh giá cán bộ còn rất khó khăn; phòng, chống suy thoái, tự diễn biến, tự chuyển hóa chưa đồng đều; bố trí chiến lược cán bộ cũng chưa được chú trọng; sinh hoạt Đảng nhiều nơi còn hình thức, tính chiến đấu trong tự phê bình, phê bình còn thấp; việc kiểm soát quyền lực trong công tác cán bộ có chuyển biến bước đầu nhưng hiệu quả cũng chưa cao; tình trạng lạm quyền, lợi dụng quyền lực, vụ lợi trong công tác cán bộ vẫn còn xảy ra một số nơi...</p>
    <p>Nhấn mạnh năm 2025 có rất nhiều sự kiện trọng đại của đất nước, Tổng Bí thư Tô Lâm đề nghị các cấp ủy và hệ thống tổ chức cán bộ của Trung ương luôn phải có ba câu hỏi và câu trả lời hợp lý. Đó là phải làm sao có được bộ máy hoạt động của Đảng, hệ thống tổ chức bộ máy của Nhà nước hiệu năng, hiệu quả, hiệu lực? Làm sao phải có đội ngũ cán bộ có giác ngộ, có tâm huyết vì nước, vì dân, vì sự nghiệp của Đảng. Tại sao Đảng ta phải chọn khâu cán bộ là then chốt?</p>
    <p>Tổng Bí thư gợi mở phải làm tốt công tác tham mưu, sắp xếp tinh gọn tổ chức bộ máy của hệ thống chính trị gắn với cơ cấu lại đội ngũ cán bộ. Tinh gọn bộ máy của hệ thống chính trị là vấn đề khó, thậm chí là rất khó. Khi tinh gọn bộ máy sẽ liên quan đến tâm tư, tình cảm, nguyện vọng, lợi ích của một số cá nhân, tổ chức. Do vậy, công tác này cần được tiến hành khách quan, thận trọng, dân chủ, khoa học, bài bản. Ban Tổ chức Trung ương nói riêng, ngành tổ chức xây dựng Đảng nói chung phải phát huy cao độ, vai trò tham mưu để triển khai nhiệm vụ này.</p>
    <figure class=""image"">
    <img src="https://i1-vnexpress.vnecdn.net/2024/12/16/ttxvn-tong-bi-thu-2-4990-17343-5961-4020-1734348002.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=gdtKpBqqghrsTcAiMpf0pQ" alt="Tổng Bí thư Tô Lâm. Ảnh: TTXVN">
    </figure>
    <p>Tổng Bí thư Tô Lâm. Ảnh: <i>TTXVN</i></p>
    <p>Một cơ quan thực hiện nhiều việc, một việc chỉ giao cho một cơ quan chủ trì và chịu trách nhiệm, khắc phục triệt để chồng chéo về chức năng, nhiệm vụ, chia cắt về địa bàn, lĩnh vực; hạn chế tổ chức trung gian, xác định rõ chức năng, nhiệm vụ, trách nhiệm cụ thể trên cơ sở tính Đảng, tính hợp lý, tính hợp pháp; phải rà soát chức năng, nhiệm vụ của từng tổ chức, bộ máy.</p>
    <p>Tổng Bí thư yêu cầu phải tham mưu tinh gọn bộ máy tổ chức các cơ quan Đảng thực sự là hạt nhân trí tuệ, là Bộ Tổng tham mưu, là đội tiên phong, lãnh đạo cơ quan nhà nước, tuyệt đối không để xảy ra bao biện, làm thay hoặc buông lỏng sự lãnh đạo của Đảng; xây dựng các cơ quan tham mưu, cấp ủy thực sự tinh gọn, đánh giá toàn diện việc kiêm nhiệm các chức danh của Đảng, hệ thống chính trị để có quyết sách phù hợp.</p>
    <p>Tổng Bí thư đề nghị khẩn trương rà soát quy định của Đảng có liên quan để chủ động tham mưu bổ sung, sửa đổi hoặc ban hành mới theo đúng quy định trên cơ sở mô hình tổng thể của hệ thống chính trị, tạo cơ sở chính trị pháp lý để hệ thống chính trị hoạt động được ngay khi kiện toàn, không để gián đoạn. Những việc thuộc thẩm quyền của Bộ Chính trị, Ban Bí thư, các cấp, các ngành, địa phương thực hiện được trước tiến hành ngay, không chờ Trung ương.</p>
    <p>Các cơ quan Đảng cần nghiên cứu thống nhất, sắp xếp, thực sự tinh gọn bộ máy và làm trước.</p>
    <p>Ban Tổ chức Trung ương, Ban cán sự Đảng Chính phủ sớm báo cáo Bộ Chính trị cho chủ trương về chế độ, chính sách đối với cán bộ khi sắp xếp tinh gọn tổ chức bộ máy.</p>
    <p>Tổng Bí thư chỉ rõ với tinh gọn tổ chức bộ máy từng cấp, từng ngành cần khẩn trương rà soát để có phương án cơ cấu lại đội ngũ cán bộ có đủ phẩm chất, năng lực, ngang tầm nhiệm vụ, biên chế hợp lý, chuẩn hóa chức danh; kiên quyết phòng, chống việc lợi dụng chủ trương sắp xếp bộ máy, đội ngũ cán bộ để tiêu cực, tham nhũng.</p>
    <p>Người đứng đầu Đảng cũng yêu cầu đổi mới mạnh mẽ công tác tuyển dụng, đào tạo, đề bạt, bổ nhiệm, luân chuyển, điều động, đánh giá cán bộ theo hướng thực chất vì việc tìm người trên cơ sở sản phẩm cụ thể đo đếm được, có cơ chế hữu hiệu, sàng lọc, đưa ra khỏi vị trí công tác những người không đủ phẩm chất, năng lực, uy tín, sử dụng đối với người có năng lực nổi trội.</p>
    <p>Tổng Bí thư yêu cầu các cán bộ lãnh đạo, người đứng đầu cấp ủy, cơ quan cần gương mẫu, chủ động, quyết liệt trong thực hiện nhiệm vụ được giao theo tinh thần Trung ương làm trước đến địa phương.</p>
    <p>Tổng Bí thư đề nghị phải chuẩn bị và tổ chức thật tốt Đại hội Đảng bộ các cấp, tiến tới Đại hội lần thứ 14 của Đảng, trọng tâm là tham mưu xây dựng đảm bảo chất lượng dự thảo văn kiện đại hội các cấp, tham mưu chuẩn bị bầu ra được cơ quan lãnh đạo của Đảng mỗi cấp có sức chiến đấu cao.</p>
    <p>Tổng Bí thư nhấn mạnh công tác cán bộ là nhiệm vụ then chốt của công tác xây dựng Đảng liên quan đến sự sống còn của Đảng và vận mệnh của chế độ của đất nước. Cán bộ là cái gốc của mọi công việc, là nhân tố quyết định sự thành bại của cách mạng. Đi liền với công tác cán bộ, công tác tổ chức xây dựng Đảng có vị trí đặc biệt quan trọng, trách nhiệm rất lớn, rất vinh quang.</p>
    <p>Khối lượng công việc phía trước của ngành rất bộn bề, khẩn trương. Đất nước đang đứng trước cánh cửa lịch sử. Bước vào kỷ nguyên mới, Tổng Bí thư đề nghị toàn ngành tổ chức xây dựng Đảng, ý thức sâu sắc hơn về vai trò, trách nhiệm, nỗ lực, cố gắng vươn mình với quyết tâm chính trị cao nhất, hoàn thành toàn bộ các nhiệm vụ đề ra.</p>
    <figure class=""image"">
    <img src="https://i1-vnexpress.vnecdn.net/2024/12/16/ttxvn-to-chuc-xay-dung-dang-1-5618-9376-1734348002.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=YoyFjGxbL26qpbSnPUmWrw" alt="Hội nghị toàn quốc tổng kết công tác tổ chức xây dựng Đảng năm 2024, triển khai nhiệm vụ năm 2025, sáng 16/12. Ảnh: TTXVN">
    </figure>
    <p>Hội nghị toàn quốc tổng kết công tác tổ chức xây dựng Đảng năm 2024, triển khai nhiệm vụ năm 2025, sáng 16/12. Ảnh: <i>TTXVN</i></p>',
    
    21,
    'Viết Tuân',
    'https://i1-vnexpress.vnecdn.net/2024/12/16/ttxvn-tong-bi-thu-2-4990-17343-5961-4020-1734348002.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=nFiuxNuV1LaVhrHGN9aswQ',
    3,'Tổng Bí thư Tô Lâm yêu cầu kiên quyết phòng chống tiêu cực, tham nhũng trong công tác sắp xếp bộ máy và đội ngũ cán bộ. Ông nhấn mạnh cần tinh gọn bộ máy, nâng cao chất lượng cán bộ và kiên quyết ngăn chặn việc lợi dụng sắp xếp bộ máy để tiêu cực. Cán bộ lãnh đạo cần gương mẫu, chủ động thực hiện nhiệm vụ.', FALSE
), (
  '2024-12-16 12:00:00', 
 '6 điểm nhấn công nghệ thế giới 2024', 
 '<p>Thế giới công nghệ 2024 chứng kiến sự bùng nổ của AI tạo sinh, làn sóng robot hình người, trong khi thị trường tiền số khởi sắc.</p><p>Trong 12 tháng qua, nhiều sự kiện liên quan đến trí tuệ nhân tạo diễn ra, len lỏi đến mọi mặt trong đời sống thực tế. Hàng chục công ty cũng tham gia cuộc đua robot hình người với nhiều cải tiến quan trọng.</p><p><strong>AI tạo sinh bùng nổ</strong></p><p>Cuộc chiến AI tạo sinh được đánh giá đang diễn ra tương tự những năm 1990 khi Microsoft và Netscape đối đầu để trở thành trình duyệt tốt nhất. ChatGPT liên tục cải tiến với mô hình mới như GPT-4 hay o1. Google đổi Bard thành Gemini, Microsoft đưa Copilot vào Office, Windows, còn Meta AI cũng được triển khai cho Messenger, Instagram, WhatsApp và web. Character.AI, Viggle, Pixverse, Luma AI cũng tạo dấu ấn với khả năng tùy biến cho nhu cầu riêng. Các công ty Trung Quốc như Baidu, Alibaba, ByteDance... cũng công bố hàng loạt AI tương tự ChatGPT. Dù vậy, làn sóng chatbot được cho là có sự giống nhau giữa các sản phẩm thay vì đột phá.</p><p>Nối tiếp xu hướng AI chuyển văn bản thành ảnh, OpenAI tiếp tục là bên mở màn cho cuộc đua AI chuyển văn bản thành video với mô hình Sora hồi tháng 2. Sau đó, Google trình làng Veo, Runway công bố Gen-3 Alpha, Meta ra Movie Gen, còn Adobe cũng giới thiệu công cụ video AI của riêng mình. Tuy nhiên, hiện mới có Sora thương mại hóa đầu tháng 12, còn hầu hết vẫn đang thử nghiệm.</p>',
  
 81, 
 'Đức Trung', 
 'https://i1-sohoa.vnecdn.net/2024/12/15/image-copy-4616-1728578684-173-5411-9689-1734251543.png?w=680&h=0&q=100&dpr=1&fit=crop&s=IRcwfC15RTkRruYmXWWx6A',
 5,'Thế giới công nghệ 2024 chứng kiến sự bùng nổ của AI tạo sinh và robot hình người. ChatGPT và các AI khác liên tục cải tiến, trong khi AI chuyển văn bản thành video bắt đầu được triển khai. Tuy nhiên, các sản phẩm chatbot vẫn thiếu sự đột phá, với nhiều sự tương đồng.', FALSE),
(
  '2024-12-15 21:03:00',
 'Chủ tịch hội đồng trường quan trọng hơn hiệu trưởng',
 '<p>Chủ tịch hội đồng trường trực tiếp hoạch định chính sách, chiến lược, quan trọng hơn hiệu trưởng, nhưng chưa được quy định rõ trong Luật, theo GS Nguyễn Đình Đức.</p>
  <p>Ý kiến được GS Đức, Chủ tịch hội đồng trường Đại học Công nghệ, Đại học Quốc gia Hà Nội, nêu tại hội thảo đổi mới quản trị đại học tại TP HCM, ngày 14/12.</p>
  <p>Ông cho rằng thay đổi quan trọng nhất kể từ khi Luật Giáo dục đại học được sửa đổi vào năm 2018 là định hướng các trường hoạt động theo mô hình doanh nghiệp.</p>
  <p>""Nhưng phải là doanh nghiệp phi lợi nhuận, thu đủ bù chi, chứ không phải hoạt động để tìm kiếm lợi nhuận"", ông Đức giải thích.</p>
  <p>Để ""doanh nghiệp"" hoạt động hiệu quả, theo ông cần xác định rõ vai trò và vị trí của hội đồng trường với ban giám hiệu. Với trường công lập tự chủ, hội đồng trường tương tự hội đồng quản trị ở doanh nghiệp, còn hiệu trưởng và ban giám hiệu như giám đốc, ban giám đốc. Với các trường ngoài công lập, hội đồng quản trị phải có vai trò quyết định như hội đồng trường.</p>
  <p>Ông nhận định chủ tịch hội đồng trường quan trọng hơn hiệu trưởng, trực tiếp hoạch định chính sách, chiến lược, nhưng không được thể hiện rõ nét trong luật dẫn đến nhiều nơi vẫn loay hoay ""ai lớn hơn"", rồi chọn người qua loa.</p>
  <p>Câu hỏi ""Ai đứng đầu trường đại học"" từng được đưa ra từ năm 2020, khi Nghị định 99 hướng dẫn Luật Giáo dục đại học sửa đổi có hiệu lực.</p>
  <p>Trả lời Bộ Giáo dục và Đào tạo hồi tháng 1/2021, Bộ Nội vụ cho rằng hiệu trưởng là người đứng đầu bởi đây là người đại diện theo pháp luật và là chủ tài khoản, chịu trách nhiệm quản lý, điều hành hoạt động của trường.</p>
  <p>Hiệu trưởng tổ chức các hoạt động chuyên môn, học thuật, tổ chức, nhân sự, tài chính, tài sản, hợp tác trong nước, quốc tế và nhiều hoạt động khác. Hiệu trưởng cũng là thành viên hội đồng trường.</p>
  <p>Thực tế đến nay, nhiều trường vẫn lúng túng. Hồi tháng 8/2023, đại diện trường Đại học Y Hà Nội từng cho biết không làm sao xác định được <a href="https://vnexpress.net/ai-dung-dau-truong-dai-hoc-4642352.html">ai là người đứng đầu</a> trong quá trình thực hiện tự chủ do chưa có văn bản pháp luật nào quy định việc này.</p>
  <p><img src="https://i1-vnexpress.vnecdn.net/2024/12/14/ong-nguyen-dinh-duc-jpg-173417-6000-9893-1734182990.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=bLzNEVicypWtPeulSGeVlQ" alt="GS Nguyễn Đình Đức phát biểu tại hội thảo, ngày 14/12. Ảnh: DHV"></p>
  <p>GS Nguyễn Đình Đức phát biểu tại hội thảo, ngày 14/12. Ảnh: <i>DHV</i></p>
  <p>Ngoài ra, cơ chế, chính sách về tự chủ đại học hiện nay còn chồng chéo. GS Nguyễn Đình Đức ví dụ theo quy định 125 của Trung ương Đảng, chủ tịch hội đồng trường đồng thời là bí thư đảng ủy. Trong khi Luật Giáo dục yêu cầu vị trí này là người có uy tín, có thể là người ngoài trường.</p>
  <p>""Nếu chủ tịch hội đồng trường phải là bí thư đảng ủy thì làm sao người ngoài có thể giữ chức này được. Quy định như vậy rất mâu thuẫn, khó khả thi"", ông Đức nói.</p>
  <p>Một vấn đề khác được ông Đức đặt ra là bình đẳng giữa đại học công và tư. Các trường công lập có bộ chủ quản, được đầu tư theo kế hoạch 5 hoặc 10 năm nhưng các trường dân lập thì không. Hiện, các chiến lược, đề án cấp quốc gia vẫn ưu tiên cho các trường công, ít đề cập đến trường tư</p>
  <p>Ông cho rằng cơ quan quản lý phải đầu tư, tạo cơ hội tương đương giữa hai nhóm này. Nhà nước có thể đầu tư cho các trường tư nếu họ có nhóm nghiên cứu mạnh, tham gia đào tạo, cung cấp nguồn nhân lực theo yêu cầu quốc gia.</p>
  <p>Ở khía cạnh tích cực, ông Đức nhìn nhận tự chủ đại học đã ""thổi luồng gió mới"" giúp các trường phát triển, vươn lên mạnh mẽ. Biểu hiện là nhiều trường vào bảng xếp hạng thế giới, với thứ hạng ngày càng tốt, đầu tư cơ sở vật chất, tăng lương cho giảng viên. Các trường đều thực hiện kiểm định chất lượng, tiếp cận với những tiêu chuẩn quốc tế.</p>
  <p>Luật Giáo dục đại học sửa đổi có hiệu lực từ tháng 7/2019. Điểm nổi bật là mở rộng phạm vi và nâng cao hiệu quả tự chủ đại học; đổi mới quản trị, quản lý đào tạo đại học và đổi mới quản lý nhà nước trong điều kiện thực hiện tự chủ đại học...</p>',
 66, 
 'Đức Trung', 
 'https://i1-vnexpress.vnecdn.net/2024/12/14/ong-nguyen-dinh-duc-jpg-173417-6000-9893-1734182990.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=bLzNEVicypWtPeulSGeVlQ', 
 6,'GS Nguyễn Đình Đức cho rằng chủ tịch hội đồng trường quan trọng hơn hiệu trưởng, nhưng chưa rõ trong luật. Ông cũng nhấn mạnh cần bình đẳng giữa đại học công và tư, và tự chủ đại học đã mang lại nhiều thành tựu.'
 ,FALSE),
(
  '2024-12-07 12:39:00',
 'Du học sinh Việt hỗ trợ cảnh sát Nhật ngăn hành vi phạm tội',
 '<p>Sinh viên tình nguyện Việt phối hợp với cảnh sát Saitama xác định những bài đăng có dấu hiệu phạm tội trong các hội nhóm người Việt.</p>
  <p>40.000 người Việt sinh sống tại tỉnh Saitama, là cộng đồng ngoại quốc lớn thứ hai tại địa phương, sau người Trung Quốc. Cảnh sát tỉnh này đã phát hiện một số người Việt trao đổi trên mạng xã hội về hoạt động mua bán tài khoản ngân hàng, giao dịch ma túy, giới thiệu việc làm bất hợp pháp.</p>
  <p>Các bài đăng như vậy thường sử dụng tiếng lóng, từ viết tắt để tránh bị phát hiện, như dùng ""blx"" chỉ bằng lái xe, thêm dấu chấm như ""mua"" thành ""m.u.a"". Điều đó gây khó khăn cho các điều tra viên, biên dịch viên người Nhật, nên giới chức quyết định tuyển khoảng 20 tình nguyện viên Việt Nam từ các trường Nhật ngữ và trường nghề trong tỉnh, tạo thành nhóm Tình nguyện viên Nước ngoài Hỗ trợ An ninh mạng (FRCV). Đây là lần đầu tiên mô hình như vậy được triển khai ở Nhật Bản.</p>
  <p>""Tôi muốn góp phần giảm tình trạng người Việt phạm tội thông qua hoạt động này"", V. T. Hien, thành viên FRCV, nói.</p>
  <figure class=""image"">
  <img src="https://i1-vnexpress.vnecdn.net/2024/12/07/Thiet-ke-chua-co-ten-12-5907-1733541845.png?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=SrYaclec-IkBwLzYiEMf8A" alt="Tình nguyện viên FRCV rà soát mạng xã hội hỗ trợ cảnh sát, ngày 5/8. Ảnh: Asahi">
  </figure>
  <p>Tình nguyện viên FRCV rà soát mạng xã hội hỗ trợ cảnh sát, ngày 5/8. Ảnh: <i>Asahi</i></p>
  <p>Hien và L. T. Na, 19 tuổi, sinh viên trường Nhật ngữ Tokyo Nichigo Gakuin ở Saitama, dành thời gian nghỉ giữa giờ để dùng smartphone rà tìm các từ khóa mà một số người Việt thường dùng để mua bán sổ ngân hàng, thẻ rút tiền trái phép trên mạng xã hội.</p>
  <p>""Tôi thấy một bài đăng rồi này"", Na giơ smartphone lên thông báo sau khoảng 20 phút tìm kiếm. ""Thu mua thẻ rút tiền, sổ ngân hàng từ tất cả nhà băng tại Nhật Bản"", phần mô tả bài đăng có đoạn.</p>
  <p>Na sau đó gửi đường link cùng bản dịch tiếng Nhật đến cảnh sát tỉnh Saitama. Hôm trước, Hien cũng phát hiện một bài đăng thu mua tài khoản ngân hàng được công ty cấp.</p>
  <p>""Thật buồn khi thấy một số người Việt phạm tội. Tôi rất mừng khi có thể giúp đỡ cảnh sát"", Hien nói. Ngoài hoạt động trong thời gian nghỉ giữa giờ, hai tình nguyện viên Việt Nam còn tận dụng những phút rảnh rỗi ở nhà để hỗ trợ.</p>
  <figure class=""image"">
  <img src="https://i1-vnexpress.vnecdn.net/2024/12/07/Thiet-ke-chua-co-ten-11-8701-1733541846.png?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=C09d0LI5JIDk6RP1JblZLg" alt="Lễ trao giấy khen cho các tình nguyện viên FRCV hồi tháng 7. Ảnh: Yomiuri">
  </figure>
  <p>Lễ trao giấy khen cho các tình nguyện viên FRCV hồi tháng 7. Ảnh: <i>Yomiuri</i></p>
  <p>Sau khi nhận thông tin từ tình nguyện viên Việt, cảnh sát Saitama sẽ gửi cảnh cáo bằng cả tiếng Việt lẫn tiếng Nhật đến các tài khoản có dấu hiện phạm pháp, với thông điệp: ""Mua bán sổ ngân hàng, thẻ rút tiền ở Nhật Bản là bất hợp pháp"".</p>
  <p>Tổng cộng, chương trình đã giúp cảnh sát cảnh cáo hơn 100 bài đăng, phần lớn đã bị gỡ xuống. Cảnh sát cũng có thể bắt người đăng bài nếu xác định được danh tính.</p>
  <p>""Có những từ lóng mà chỉ người bản ngữ mới có thể phát hiện ra. Chúng tôi rất mong tiếp tục hợp tác với tình nguyện viên Việt Nam để phòng chống các loại hình tội phạm"", một sĩ quan cho biết.</p>
  <p>Shunichi Nakazawa, lãnh đạo ban hợp tác của trường Nhật ngữ Tokyo Nichigo Gakuin, hoan nghênh sáng kiến. ""Sinh viên cũng có thể nâng cao nhận thức về phòng chống tội phạm thông qua hoạt động tình nguyện"", ông nói.</p>
  <p>Cảnh sát tỉnh Saitama đang cân nhắc mở rộng sáng kiến này sang các ngôn ngữ khác ngoài tiếng Việt.</p>
  <p><br>&nbsp;</p>',
    
  36, 
  'Đức Trung', 
  'https://i1-vnexpress.vnecdn.net/2024/12/07/Thiet-ke-chua-co-ten-11-8701-1733541846.png?w=680&h=0&q=100&dpr=1&fit=crop&s=C09d0LI5JIDk6RP1JblZLg', 
  3,'Sinh viên tình nguyện Việt Nam phối hợp với cảnh sát Saitama phát hiện các bài đăng phạm tội trên mạng xã hội, như mua bán tài khoản ngân hàng. Chương trình đã cảnh cáo hơn 100 bài đăng và đang xem xét mở rộng sang ngôn ngữ khác.'
,FALSE),
(
  '2024-12-03 11:29:00',
 'Bang ở Australia phạt tù trẻ 10 tuổi như người lớn',
 '<p>Bang Queensland thông qua luật áp dụng các mức phạt tù như người lớn đối với trẻ em 10 tuổi trở lên mắc một số trọng tội.</p>
  <p>Bang Queensland, đông bắc Australia, ngày 12/12 thông qua luật cho phép áp dụng mức phạt tù tương tự người lớn đối với trẻ em từ 10 tuổi trở lên bị kết tội giết người, hành hung nghiêm trọng, đột nhập và 10 trọng tội khác.</p>
  <p>Trước đây, mức phạt tối đa đối với tội phạm nhỏ tuổi mắc tội giết người là 10 năm tù, án tù chung thân chỉ được cân nhắc với hành vi ""đặc biệt tàn ác"". Với luật mới, mức phạt đối với tội giết người là tù chung thân, phải ngồi tù ít nhất 20 năm trước khi được cân nhắc ân xá.</p>
  <p>Luật mới cũng xóa bỏ các điều khoản coi ""án tù là biện pháp cuối"", vốn ưu tiên đưa ra các hình thức trừng phạt với tội phạm nhỏ tuổi như phạt tiền, phục vụ công ích thay vì giam giữ. Thay đổi nhằm giúp thẩm phán xem xét tiền án của tội phạm thiếu niên hiệu quả hơn khi xét xử.</p>
  <p>Trước khi bỏ phiếu thông qua luật mới, các nhà lập pháp Queensland thống nhất rằng bang đang phải đối mặt với làn sóng tội phạm thiếu niên, cần có biện pháp trừng phạt mạnh tay hơn.</p>
  <figure class=""image"">
  <img src="https://i1-vnexpress.vnecdn.net/2024/12/13/afp-20141112-hkg10117490-v1-hi-9235-8713-1734061189.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=BkiEeJTPuD2pdNghHUeOxw" alt="Cảnh sát Queensland tại Brisbane, tháng 11/2014. Ảnh: AFP">
  </figure>
  <p>Cảnh sát Queensland tại Brisbane, tháng 11/2014. Ảnh: <i>AFP</i></p>
  <p>Chính quyền Queensland cho biết luật mới nhằm đáp lại ""nỗi phẫn nộ của cộng đồng về tội ác do tội phạm thiếu niên gây ra"" và sẽ có tác dụng răn đe. Đảng Tự do Australia (LNP), bên chiến thắng trong cuộc bầu cử bang hồi tháng 10, mô tả luật mới ""đặt quyền của nạn nhân lên trên quyền của tội phạm"".</p>
  <p>Tuy nhiên, nhiều chuyên gia cảnh báo các hình phạt nghiêm khắc hơn không giảm tình trạng tội phạm thiếu niên, thậm chí làm trầm trọng vấn đề. LHQ cũng chỉ trích luật mới của Queensland, cho rằng nó vi phạm luật quốc tế và các công ước về quyền của trẻ em.</p>
  <p>Dù coi luật mới là ""bước tiến đúng hướng"", tân Tổng chưởng lý Queensland Deb Frecklington lưu ý luật ""xung đột trực tiếp"" với các tiêu chuẩn quốc tế, cảnh báo trẻ em bản địa Australia có thể bị phân biệt đối xử.</p>',
    
  37, 
  'Đức Trung', 
  'https://i1-vnexpress.vnecdn.net/2024/12/13/afp-20141112-hkg10117490-v1-hi-9235-8713-1734061189.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=BkiEeJTPuD2pdNghHUeOxw', 
  3,'Queensland (Australia) đã thông qua luật áp dụng án tù như người lớn đối với trẻ em từ 10 tuổi trở lên phạm trọng tội. Mức án mới nghiêm khắc hơn, với án tù chung thân cho tội giết người. Tuy nhiên, chuyên gia và LHQ lo ngại luật này vi phạm quyền trẻ em và không giảm tội phạm thiếu niên.'
  ,FALSE), 
(
      '2024-12-16 11:50:00',
  'Giá vàng thế giới năm 2025 có thể tăng chậm lại',
  '<p>Hội đồng Vàng Thế giới (WGC) cho rằng nếu tình hình thị trường giữ nguyên như hiện tại, giá vàng 2025 sẽ tăng chậm hơn năm nay.</p>
  <p>Vàng ghi nhận năm tốt nhất trong hơn một thập kỷ. Từ đầu năm đến nay, kim loại quý 40 lần lập đỉnh, có thời điểm tiến sát 2.800 USD một ounce vào cuối tháng 10. Tổng nhu cầu vàng trong quý III lần đầu tiên chạm 100 tỷ USD. Dù bị bán tháo sau cuộc bầu cử Tổng thống Mỹ, kim loại quý vẫn tăng 30% năm nay.</p>
  <p>Trong báo cáo triển vọng <a href="https://vnexpress.net/chu-de/gia-vang-hom-nay-1403">giá vàng</a> 2025 công bố cuối tuần trước, WGC nhận định kim loại quý vẫn có tiềm năng tăng giá, nếu nhu cầu của các ngân hàng trung ương mạnh hơn dự báo hoặc tình hình tài chính kém đi, kéo nhu cầu trú ẩn lên cao. Dù vậy, mức tăng năm 2025 có thể chậm hơn năm nay. Bên cạnh đó, nếu làn sóng giảm lãi suất bị đảo ngược, kim loại quý sẽ gặp nhiều thách thức.</p>
  <p>Lực mua của các ngân hàng trung ương và nhu cầu trú ẩn tăng vài năm qua, do biến động kinh tế - chính trị trên toàn cầu. Lo ngại về khối nợ công của các nước châu Âu, cùng với bất ổn tại Trung Đông, Đông Âu và nhiều nước khác vẫn kéo giá lên.</p>
  <p>""Nhìn chung, tình hình hiện tại thôi thúc nhà đầu tư trú ẩn, ví dụ như mua vàng, để đối phó rủi ro"", WGC cho biết.</p>
  <figure class=""image"">
  <img src="https://i1-kinhdoanh.vnecdn.net/2024/12/16/Screenshot-2024-12-16-112536-1-3445-4843-1734323371.png?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=1w4p3jDby_DeQ-h4ftOv_A" alt="Diễn biến giá vàng thế giới một năm qua. Đồ thị: Goldprice.org">
  </figure>
  <p>Diễn biến giá vàng thế giới một năm qua. Đồ thị: <i>Goldprice.org</i></p>
  <p>Thị trường hiện dự báo lãi suất tại Mỹ sẽ giảm thêm 100 điểm cơ bản (1%) năm 2025. Mức giảm ở châu Âu cũng tương tự. Lãi suất thấp sẽ có lợi cho giá vàng. Đồng đôla cũng được kỳ vọng đi ngang hoặc giảm nhẹ khi lãi suất hạ xuống. Việc này sẽ kéo kim loại quý lên cao.</p>
  <p>Ngược lại, nếu các ngân hàng trung ương dừng điều chỉnh lãi suất trong thời gian dài hoặc tăng trở lại, sức ép lên kim loại quý sẽ lớn. Tổng thống đắc cử Donald Trump được dự báo tung nhiều chính sách hỗ trợ doanh nghiệp. Tuy nhiên, các chính sách này được dự báo gây ra lạm phát và làm gián đoạn chuỗi cung ứng. Việc này có thể khiến các ngân hàng trung ương phải cân nhắc chuyện giảm lãi.</p>
  <p>""Tất cả đang chờ nhiệm kỳ 2 của ông Trump, để xem kinh tế toàn cầu sẽ ra sao"", báo cáo của WGC viết.</p>
  <p>Nhu cầu tại châu Á cũng rất quan trọng. Trung Quốc và Ấn Độ là các thị trường tiêu thụ vàng lớn nhất thế giới. Nhu cầu tại hai nước này đã góp phần kéo giá vàng lên đỉnh năm nay.</p>
  <p>Tuy nhiên, việc ông Trump đe dọa tăng thuế nhập khẩu với Trung Quốc gây sức ép lên nhà đầu tư nước này. Nhu cầu vàng tại đây còn phụ thuộc vào sức khỏe nền kinh tế, vốn chưa khởi sắc nhiều sau loạt chính sách kích thích gần đây.</p>
  <p>So với Trung Quốc, Ấn Độ có khả năng hỗ trợ giá vàng tốt hơn. Tăng trưởng kinh tế tại đây vẫn tốt. Họ cũng không xuất khẩu nhiều sang Mỹ nên ít chịu tác động từ thuế nhập khẩu.</p>
  <p>Lực mua của các ngân hàng trung ương cũng được kỳ vọng vẫn là động lực chính đẩy giá vàng năm tới. Dù giảm về cuối năm 2024, nhu cầu vàng vẫn rất mạnh, được dự báo vượt 500 tấn trong năm sau. Về dài hạn, việc này tác động tích cực lên giá.</p>
  <p>""Diễn biến của vàng sẽ phụ thuộc vào sự tương tác của 4 yếu tố chính, gồm tăng trưởng kinh tế, rủi ro, chi phí cơ hội và xu hướng khi đó"", báo cáo kết luận.</p>',
    
  48, 
  'Mỹ Ý', 
  'https://i1-kinhdoanh.vnecdn.net/2024/12/16/goldindiareuters-1734323344-17-7672-8143-1734323371.jpg?w=680&h=408&q=100&dpr=2&fit=crop&s=On2nmMUQzDxB2QSJZu8ezA', 
 7,'Giá vàng năm 2025 dự báo tăng chậm hơn năm nay, dù vẫn có tiềm năng nếu nhu cầu của các ngân hàng trung ương mạnh. Nhu cầu vàng từ Trung Quốc và Ấn Độ sẽ tiếp tục hỗ trợ giá. Tuy nhiên, nếu lãi suất giảm lại bị đảo ngược, giá vàng sẽ gặp khó khăn.', 
 FALSE), 
(
  '2024-12-04 20:12:00',
 'Phó thủ tướng: ''Không để gián đoạn hệ thống khi tinh gọn bộ máy Ngân hàng Nhà nước''',
 '<p>Phó thủ tướng Hồ Đức Phớc lưu ý việc sắp xếp, tinh gọn bộ máy của Ngân hàng Nhà nước phải đảm bảo hoạt động bình thường của hệ thống ngân hàng.</p>
  <p>Theo kế hoạch định hướng sắp xếp tổ chức bộ máy của Chính phủ công bố ngày 6/12, Ngân hàng Nhà nước nằm trong 5 bộ và 3 cơ quan ngang bộ dự kiến duy trì, chỉ tinh gọn bên trong.</p>
  <p>Tại hội nghị triển khai nhiệm vụ ngân hàng năm 2025 ngày 14/12, một trong các nhiệm vụ quan trọng hàng đầu Phó thủ tướng Hồ Đức Phớc nhắc tới là cần tập trung hoàn thành rà soát, sắp xếp tinh gọn bộ máy của Ngân hàng Nhà nước.</p>
  <p>Ngành ngân hàng được giao nghiên cứu, đề xuất cấp có thẩm quyền phê duyệt chế độ, chính sách đối với cán bộ, công chức, viên chức, người lao động khi sắp xếp lại bộ máy.</p>
  <figure class=""image"">
  <img src="https://i1-kinhdoanh.vnecdn.net/2024/12/14/web-jpeg-1734180472-1734180498-2500-1734180597.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=zrKn_ZAdRIGocEZo7yCkFg" alt="Phó thủ tướng Hồ Đức Phớc tại hội nghị ngày 14/12. Ảnh: SBV">
  </figure>
  <p>Phó thủ tướng Hồ Đức Phớc tại hội nghị ngày 14/12. Ảnh: <i>SBV</i></p>
  <p>Trước đó tại cuộc họp gần đây với Phó thủ tướng, Thống đốc Nguyễn Thị Hồng nêu một số khó khăn trong quá trình sắp xếp. Bà cũng cho biết cần có lộ trình để đảm bảo hoạt động thường xuyên về nghiệp vụ của ngành và bảo đảm an toàn tài sản của Nhà nước. Đồng thời, các vấn đề liên quan đến bảo đảm chế độ, chính sách đối với cán bộ, công chức, viên chức, người lao động sau khi sắp xếp bộ máy cũng cần lưu tâm.</p>
  <p>Ngân hàng Nhà nước cũng cho biết thời gian qua đã quán triệt nghiêm túc, khẩn trương triển khai việc sắp xếp, tinh giản bộ máy và nhanh chóng thành lập Ban Chỉ đạo do Thống đốc Nguyễn Thị Hồng làm Trưởng ban. Theo đó, Ban chỉ đạo xây dựng các phương án sắp xếp, tinh gọn bộ máy theo tinh thần một việc, một đầu mối và đánh giá tác động của các phương án.</p>
  <p>Hai khối dự kiến giảm lớn nhất đó là chi nhánh Ngân hàng Nhà nước tại các tỉnh, thành phố và sắp xếp lại Cơ quan Thanh tra giám sát ngân hàng từ mô hình tổng cục xuống thành các cục.</p>
  <p><span style=""color:rgb(44,62,80);""><strong>Ngoài việc tinh gọn bộ máy</strong></span>, Phó thủ tướng cũng đặt ra các đề bài về điều hành chính sách tiền tệ, tín dụng, cơ cấu lại hệ thống các tổ chức tín dụng, chuyển đổi số... với ngành ngân hàng trong năm tới.</p>
  <p>Nhìn vào kết quả hoạt động 2024, Phó thủ tướng đánh giá Ngân hàng Nhà nước đã đóng góp quan trọng vào mục tiêu của Chính phủ về ổn định kinh tế vĩ mô, kiểm soát lạm phát, bảo đảm các cân đối lớn, ổn định thị trường ngoại hối, tỷ giá.</p>
  <p>Theo báo cáo của Ngân hàng Nhà nước, điều hành chính sách tiền tệ linh hoạt đã góp phần kiểm soát lạm phát bình quân 11 tháng ở mức 3,69%. Nhà điều hành cũng đưa các giải pháp tháo gỡ khó khăn cũng như điều hành tín dụng góp phần hỗ trợ tăng trưởng kinh tế ở mức cao so với các nước trên thế giới và khu vực. Tỷ giá cơ bản ổn định, trong bối cảnh thị trường quốc tế biến động mạnh.</p>
  <p>Thời gian qua, Ngân hàng Nhà nước tiếp tục giữ nguyên các mức lãi suất điều hành trong bối cảnh lãi suất thế giới vẫn neo ở mức cao, tạo điều kiện cho các nhà băng tiếp cận nguồn vốn từ Ngân hàng Nhà nước với chi phí thấp, qua đó có điều kiện hỗ trợ nền kinh tế. Theo báo cáo của các ngân hàng thương mại, mặt bằng lãi suất cho vay đến nay tiếp tục giảm khoảng 0,96% so với cuối năm 2023.</p>
  <p>Năm nay, việc tái cơ cấu hệ thống ngân hàng đã đạt bước tiến quan trọng trong xử lý các ngân hàng yếu kém, theo Thống đốc Nguyễn Thị Hồng. CBBank và OceanBank - hai trong số ba ngân hàng 0 đồng đã được chuyển giao bắt buộc. GPBank - ngân hàng còn lại và một ngân hàng yếu kém khác là DongABank đang được trình cấp có thẩm quyền sớm phê duyệt phương án trong năm 2024.</p>
  <p>""Với tinh thần rất khẩn trương, hy vọng trong năm nay cả 4 ngân hàng đều được chuyển giao bắt buộc"", Thống đốc nói. Đồng thời, người đứng đầu ngành ngân hàng nhận định điều này ""chưa từng có tiền lệ"", đòi hỏi sự phối hợp chặt chẽ giữa các bộ, cơ quan, ban, ngành.</p>
  <p>Thời gian tới, lãnh đạo Ngân hàng Nhà nước cho biết tiếp tục theo dõi sát diễn biến thị trường, tình hình kinh tế trong và ngoài nước để điều hành chính sách tiền tệ chủ động, hài hòa với chính sách tài khóa. Việc này nhằm hỗ trợ ưu tiên tăng trưởng kinh tế, thúc đẩy sản xuất kinh doanh và góp phần ổn định vĩ mô, kiểm soát lạm phát...</p>',
    
  49, 
  'Mỹ Ý', 
  'https://i1-kinhdoanh.vnecdn.net/2024/12/14/web-jpeg-1734180472-1734180498-2500-1734180597.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=ZkT3CltW725-zF4NtLCDhg',
  2,'Phó thủ tướng Hồ Đức Phớc yêu cầu tinh gọn bộ máy Ngân hàng Nhà nước mà không ảnh hưởng đến hoạt động ngân hàng, đồng thời tiếp tục điều hành chính sách tiền tệ và tín dụng. Ngân hàng Nhà nước đã giúp ổn định kinh tế và kiểm soát lạm phát trong năm 2024.',FALSE),
(
    '2024-12-16 10:08:00',
  'Rau luộc hay hấp tốt cho sức khỏe hơn?',
  '<p>Luộc rau có thể làm mất chất dinh dưỡng hòa tan trong nước, trong khi phương pháp hấp giữ lại nhiều vitamin và hợp chất thực vật hơn.</p>
  <p>Rau củ là một trong những thực phẩm tốt nhất cho sức khỏe. Nhờ chứa nhiều hợp chất thực vật, chất xơ, vitamin và khoáng chất, rau củ mang lại nhiều lợi ích, từ hỗ trợ cân nặng đến giảm nguy cơ mắc các bệnh thông thường như tim mạch và một số loại ung thư.</p>
  <p><strong>Rau luộc hay hấp tốt cho sức khỏe hơn?</strong></p>
  <p>Hấp là phương pháp nấu chín thực phẩm bằng hơi nước nóng. Nghiên cứu cho thấy rau hấp có hàm lượng vitamin C, beta-carotene và chất chống oxy hóa flavonoid cao hơn so với rau luộc.</p>
  <p>Luộc làm rau củ ngập hoàn toàn trong nước, khiến các chất dinh dưỡng hòa tan trong nước bị mất đi, làm giảm một số chất dinh dưỡng và phytochemical như vitamin C và beta-carotene. Hấp rau vẫn làm mất vitamin C, nhưng ít hơn so với luộc.</p>
  <p>Các phân tích cũng chỉ ra rằng phương pháp nấu nướng ở nhiệt độ cao, trong nước quá lâu, như luộc, là bất lợi nhất cho hàm lượng dinh dưỡng của rau. Hấp không làm rau ngập trong nước nên ít bị mất chất dinh dưỡng.</p>
  <p>Rau luộc thường mềm và nhũn hơn rau hấp, rau hấp giòn hơn. Rau hấp cũng có màu sắc tươi sáng và giữ được nhiều hương vị hơn rau luộc.</p>
  <p>Song tùy theo sở thích cá nhân, một số người thích hương vị và cảm giác của rau luộc, và rau luộc mềm có thể dễ ăn hơn đối với những người gặp vấn đề về nhai và nuốt.</p>
  <figure class=""image"">
  <img src="https://i1-suckhoe.vnecdn.net/2024/12/15/Buoc-4-Anh-dai-dien-4-3836-171-8620-5492-1734255099.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=cKWY4eSVgzgwsmf9DgM0eA" alt="Rau muống luộc. Ảnh: Bùi Thuỷ">
  </figure>
  <p>Rau muống luộc. Ảnh: <i>Bùi Thuỷ</i></p>
  <p><strong>Cách hấp rau giúp giữ tối đa chất dinh dưỡng</strong></p>
  <p>Hấp là một trong những cách tốt nhất để giữ lại chất dinh dưỡng và hương vị của rau củ, nhưng điều quan trọng là không hấp quá lâu hoặc quá nhanh.</p>
  <p>Thời gian hấp khuyến nghị cho một số loại rau phổ biến: bông cải xanh: 5 phút; súp lơ: 5-6 phút; mầm Brussels: 8-10 phút; rau bina: 3 phút; khoai tây nhỏ: 15-20 phút; măng tây: 4-6 phút.</p>
  <p>Khi hấp rau, bạn có thể kiểm tra độ mềm bằng nĩa hoặc tăm trong suốt quá trình nấu để đảm bảo rau chín theo ý muốn.</p>
  <p>Các bước hấp rau bằng xửng hấp: Đổ 2,5-5 cm nước vào đáy nồi; đun sôi nước; đặt xửng hấp lên trên nồi; cho rau đã sơ chế vào xửng hấp; đậy nắp xửng hấp và giảm lửa xuống mức trung bình; hấp rau, kiểm tra sau vài phút cho đến khi rau chín theo ý muốn.</p>
  <p><strong>Một số lời khuyên khác khi chế biến rau củ</strong></p>
  <p>Nêm rau bằng thảo mộc tươi, gia vị và nước cốt chanh để giảm lượng muối; thêm chất béo vào rau để tăng khả năng sinh học của một số phytochemical; kết hợp rau với nguồn protein như cá, gà hoặc đậu để có một bữa ăn nhẹ hoặc bữa ăn đầy đủ.</p>
  <p>Thử nghiệm các phương pháp nấu ăn khác nhau để khám phá cách chế biến rau củ mà bạn ưa thích. Tìm các phương pháp chế biến phù hợp với rau củ đông lạnh để bạn có những lựa chọn lành mạnh hơn khi không có rau củ tươi.</p>',
    
  71, 
  'Mỹ Ý', 
  'https://i1-suckhoe.vnecdn.net/2024/12/15/Buoc-4-Anh-dai-dien-4-3836-171-8620-5492-1734255099.jpg?w=680&h=0&q=100&dpr=1&fit=crop&s=cKWY4eSVgzgwsmf9DgM0eA',
  1,'Hấp rau giữ nhiều chất dinh dưỡng hơn luộc, giúp rau tươi sáng và giữ hương vị. Không hấp quá lâu để bảo vệ dưỡng chất. Thêm thảo mộc và chất béo để tăng hấp thu dinh dưỡng.',TRUE),
  -- (`PublishedDay`,
  -- `Title`,
  -- `Content`,
  -- `CatID`,
  -- `AuthorName`,
  -- `ImageCover`,
  -- `Status`,
  -- `Abstract`,
  -- `Premium`)
  ('2024-12-04 20:12:00', 'Có nên ăn đồ cay khi trời lạnh?', '<p>Vợ tôi hạn chế ăn đồ cay khi trời lạnh để giảm trào ngược, nhưng tôi cho rằng ăn đồ cay nóng giúp ấm bụng. Vậy trời lạnh có nên ăn cay và ăn thế nào tốt cho sức khỏe? (Hoàng, 33 tuổi, Hà Nội)</p>
<p>
<strong>Trả lời:</strong>
</p>
<p>Trào ngược dạ dày thực quản là hiện tượng trào ngược dịch vị từ dạ dày lên thực quản. Trời lạnh sẽ kích thích hàm lượng histamin trong máu tăng, acid dạ dày tăng tiết nhiều hơn làm dạ dày co bóp mạnh, tình trạng trào ngược tăng lên.</p>
<p>Trường hợp bị trào ngược, bạn nên ăn uống khoa học, không ăn đồ cay nóng nhiều bất kể trong thời tiết nào. Khi trời lạnh, sức đề kháng bị giảm nên người có tiền sử trào ngược dạ dày thực quản dễ bị tái phát. Ăn cay nóng nhiều có thể làm tăng nguy cơ trào ngược.</p>
<p>&nbsp;</p>
<figure class="image">
<img src="https://i1-suckhoe.vnecdn.net/2024/12/12/Buoc-6-6-1235-1671269525-17340-7488-5392-1734000606.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=fMtnJFNVWbVael_aNjyDBQ" alt="Người bị bệnh dạ dày, trào ngược nên hạn chế ăn đồ cay, nóng. Ảnh: Bùi Thủy">
</figure>
<p>Người bị bệnh dạ dày, trào ngược nên hạn chế ăn đồ cay, nóng. Ảnh: <i>Bùi Thủy</i>
</p>
<p>Để phòng trào ngược dạ dày, nên ăn uống điều độ, khoa học, chia nhỏ bữa ăn để cơ thể hấp thu tốt. Tránh ăn quá no hay để dạ dày quá đói. Hạn chế ăn đồ ăn nóng, chua, cay. Không nên nằm ngay hoặc vận động mạnh sau khi ăn no. Hạn chế thức ăn nhiều chất béo, dầu mỡ, cà phê, bia rượu, nước uống có gas, thực phẩm có vị chua để tránh nguy cơ dạ dày tiết dịch nhiều và làm việc vất vả hơn.</p>
<p>Nghỉ ngơi hợp lý và hạn chế thức khuya. Tránh xa khói thuốc lá, chất kích thích, rượu, bia... bởi chúng làm ảnh hưởng tới sức khỏe tim mạch, hệ tiêu hóa và hô hấp.</p>
<p>Tăng cường tập thể dục để nâng cao sức đề kháng, không tập sáng sớm hoặc tối muộn. Trường hợp trào ngược quá nhiều, bạn nên đi khám để được bác sĩ kê đơn điều trị, cải thiện chất lượng cuộc sống.</p>
<p>
<br>&nbsp;</p>',71,'Mỹ Ý','https://i1-suckhoe.vnecdn.net/2024/12/12/Buoc-6-6-1235-1671269525-17340-7488-5392-1734000606.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=bafVstO9jlNBBfNR_4q45A',
  3,'Vợ tôi hạn chế ăn đồ cay khi trời lạnh để giảm trào ngược, nhưng tôi cho rằng ăn đồ cay nóng giúp ấm bụng. Vậy trời lạnh có nên ăn cay và ăn thế nào tốt cho sức khỏe?',TRUE),
  ('2024-12-04 20:12:00', '"Người nhàn nhã" gây bất bình vì nhận lương cao nhất Sở Cảnh sát New York', '<p>Quathisha Epps, nhân viên được trả lương cao nhất của Sở Cảnh sát New York, bị đình chỉ chức vụ khi có cuộc điều tra nội bộ về số giờ tăng ca bất thường.</p>
<p>Theo The Post, trung úy Quathisha Epps, 51 tuổi, kiếm được 403.515 USD (hơn 10 tỷ đồng) trong năm tài chính 2024 (tính từ 1/10/2023 đến 30/9/2024). Tuy nhiên, hồ sơ bảng lương cho thấy trong đó có đến 204.000 USD là tiền làm thêm giờ cho công việc hành chính tại văn phòng Giám đốc Sở Cảnh sát New York (NYPD) Jeffrey Maddrey.</p>
<p>Theo hồ sơ, trong năm bà Epps đã làm thêm gần 1.627 giờ ngoài các ca thường lệ, trung bình khoảng 74 giờ một tuần. Thời gian tăng ca, cộng với mức lương cơ bản 164.477 USD, đã đẩy tổng số tiền lương của bà Epps lên hơn 400.000 USD và khiến bà trở thành nhân viên NYPD được trả lương cao nhất.</p>
<p>Trong cùng năm, cấp trên của bà, ông Maddrey, nhận được khoảng 292.000 USD.</p>
<p>Thời gian làm thêm đáng kinh ngạc của bà Epps khiến nhiều đồng nghiệp khó chịu. "Công việc hành chính nào yêu cầu bạn phải ở Sở từ 115 đến 120 giờ mỗi tháng để nhận mức tiền đó?", một cảnh sát quận Bronx phàn nàn.</p>
<p>Trung úy Quathisha Epps có thâm niên 19 năm công tác tại văn phòng Sở Cảnh sát New York. Ảnh: NYPD<br>Trung úy Quathisha Epps có thâm niên 19 năm công tác tại văn phòng Sở Cảnh sát New York. Ảnh: NYPD</p>
<p>Sau báo cáo của The Post vào tháng trước về mức lương, số giờ tăng ca khổng lồ của bà Epps đã bị giới hạn, đồng thời được thông báo sẽ phải trở lại làm nhiệm vụ tuần tra đường phố. Bà cũng bị điều tra nội bộ về việc tăng ca.</p>
<p>"Không đời nào bà ấy ra ngoài tuần tra", một nguồn tin cho biết khi so sánh công việc bàn giấy nhàn nhã bà Epps đã làm trong nhiều năm.</p>
<p>Đối mặt với nhiệm vụ đi tuần và một cuộc điều tra, bà Epps nộp đơn xin nghỉ hưu vào ngày 16/12, sau 19 năm gắn bó với sở. Ngày làm việc cuối cùng của bà Epps sẽ là 14/1/2025, nhưng bà đã bị đình chỉ không lương vào ngày 18/12.</p>
<p>Việc nghỉ sớm sẽ ảnh hưởng đến lương hưu, khiến bà Epps mất khoản bổ sung 12.000 USD một năm cho những cảnh sát đạt mốc hai thập kỷ cống hiến. Nhưng dự kiến bà vẫn nhận được khoảng 16.000 USD mỗi tháng.</p>
<p>NYPD có 30 ngày để điều tra trước khi bà Epps bắt đầu hưởng chế độ hưu trí.</p>',64,'Đức Trung','https://i1-vnexpress.vnecdn.net/2024/12/19/1-6818-1734594667.png?w=680&h=0&q=100&dpr=2&fit=crop&s=VFT6lUDvMb3s3Hv934zI-A',
  4,'Quathisha Epps, nhân viên được trả lương cao nhất của Sở Cảnh sát New York, bị đình chỉ chức vụ khi có cuộc điều tra nội bộ về số giờ tăng ca bất thường.',TRUE),
   ('2024-12-04 20:12:00', 'Thượng viện Mỹ thông qua dự luật ngăn chính phủ đóng cửa', '<p>Thượng viện Mỹ duyệt dự luật ngân sách mới nhằm ngăn chính phủ đóng cửa ngay trước hạn chót, chấm dứt một tuần hỗn loạn của quốc hội.</p>
<p>Các thượng nghị sĩ Mỹ ngày 21/12 thông qua dự luật với 85 phiếu thuận và 11 phiếu chống. Dự luật sẽ gia hạn gói ngân sách ở mức hiện tại tới ngày 14/3/2025, trong đó phân bổ hơn 100 tỷ USD cứu trợ cho các khu vực bị tàn phá bởi bão lũ, thiên tai và hỗ trợ kinh tế cho nông dân.</p>
<p>Trước đó, Hạ viện Mỹ thông qua dự luật với 366 phiếu thuận, 34 phiếu chống và một phiếu trắng. Sau khi được lưỡng viện quốc hội phê duyệt, văn bản được chuyển đến cho Tổng thống Joe Biden ký thành luật.</p>
<p>"Đây là tin tốt khi cách tiếp cận của lưỡng đảng đã thắng thế. Đây là kết quả tốt cho nước Mỹ và người dân", lãnh đạo phe Dân chủ tại Thượng viện Mỹ Chuck Schumer nhận định.</p>
<figure class="image">
<img src="https://i1-vnexpress.vnecdn.net/2024/12/21/5563187178137268617a-My-173476-6697-9248-1734764467.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=9YTVJurtP5Yebu2rUxceCA" alt="Tòa nhà quốc hội Mỹ ở thủ đô Washington tháng 1/2021. Ảnh: AP">
</figure>
<p>Tòa nhà quốc hội Mỹ ở thủ đô Washington tháng 1/2021. Ảnh: <i>AP</i>
</p>
<p>Việc Thượng viện Mỹ thông qua dự luật giúp chính phủ Mỹ tránh phải đóng cửa và đình chỉ các hoạt động không thiết yếu. Nếu điều này xảy ra, 875.000 người sẽ phải tạm nghỉ việc và 1,4 triệu người phải làm việc không lương.</p>
<p>Phê duyệt dự luật ngân sách ở quốc hội Mỹ luôn là nhiệm vụ đầy thách thức, do đảng Cộng hòa và Dân chủ đều không chiếm ưu thế rõ rệt ở lưỡng viện.</p>
<p>Căng thẳng về vấn đề này gia tăng sau khi Tổng thống đắc cử Donald Trump và tỷ phú Elon Musk hồi đầu tuần gây sức ép khiến đảng Cộng hòa đã phải từ bỏ phiên bản đầu tiên của dự luật ngân sách mà họ đã thống nhất với đảng Dân chủ. Phiên bản thứ hai do đảng Cộng hòa đưa ra đã bị Hạ viện bác bỏ hôm 19/12.</p>
<p>Phiên bản cuối cùng được thông qua gần như giống hệt dự luật bị bác hôm 19/12, điểm khác là không có điều khoản về đình chỉ trần nợ công trong hai năm mà ông Trump đề ra.</p>',71,'Mỹ Ý','https://i1-vnexpress.vnecdn.net/2024/12/21/5563187178137268617a-My-173476-6697-9248-1734764467.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=TRYAMxjMSy7TERzDLuB6Bg',
  3,'Thượng viện Mỹ duyệt dự luật ngân sách mới nhằm ngăn chính phủ đóng cửa ngay trước hạn chót, chấm dứt một tuần hỗn loạn của quốc hội.',FALSE),
  ('2024-12-04 20:12:00', 'Giá vàng thế giới bật tăng trở lại', '<p>Mỗi ounce vàng tăng thêm gần 30 USD khi số liệu lạm phát Mỹ tháng 11 củng cố khả năng Fed tiếp tục giảm lãi suất năm tới.</p>
<p>Chốt phiên giao dịch hôm qua, <a href="https://vnexpress.net/chu-de/gia-vang-hom-nay-1403">giá vàng</a> thế giới giao ngay tăng 27,7 USD lên 2.622 USD một ounce. Trước đó, giá đi xuống vài phiên liên tiếp sau khi Cục Dự trữ liên bang Mỹ (Fed) ra tín hiệu muốn lãi suất giảm chậm lại trong năm 2025.</p>
<p>Ngày 20/12, số liệu của Cục Phân tích Kinh tế thuộc Bộ Thương mại Mỹ cho thấy Chỉ số Chi tiêu Cá nhân (PCE) lõi - không tính giá thực phẩm và năng lượng - chỉ tăng 0,1% so với tháng 10. Đây là tốc độ chậm nhất kể từ tháng 5. PCE là thước đo lạm phát ưa thích của Fed.</p>
<figure class="image">
<img src="https://i1-kinhdoanh.vnecdn.net/2024/12/21/gold-2024-12-21T090624-347-173-5354-5926-1734746917.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=H2m7PrlQ_9S_iAopCuVdRQ" alt="Giá vàng thế giới bật tăng mạnh trong phiên 20/12. Đồ thị: Kitco">
</figure>
<p>Giá vàng thế giới bật tăng mạnh trong phiên 20/12. Đồ thị:<i> Kitco</i>
</p>
<p>Đây là chỉ số mới nhất cho thấy quá trình giảm lạm phát tại Mỹ tiếp tục có tiến triển. Trong cuộc họp giữa tuần này, Fed ra tín hiệu giảm tốc độ nới lỏng tiền tệ trong năm 2025, do tình hình lạm phát chững lại vài tháng qua. Thông báo này khiến vàng bị bán tháo, mất tới hơn 60 USD chỉ trong phiên 18/12.</p>
<p>Lợi suất trái phiếu chính phủ Mỹ và USD cùng giảm phiên cuối tuần. Việc này càng có lợi cho kim loại quý.</p>
<p>Từ đầu năm, giá vàng đã tăng 27% và nhiều lần lập đỉnh mới. Nguyên nhân chủ yếu là lực mua của các ngân hàng trung ương, làn sóng giảm lãi suất và nhu cầu trú ẩn trong bất ổn địa chính trị trên toàn cầu.</p>
<p>Cơn sốt vàng chững lại từ đầu tháng 11, khi việc ông Donald Trump đắc cử Tổng thống Mỹ khiến giá USD tăng mạnh. Tuy nhiên, ngân hàng Goldman Sachs kỳ vọng thị trường lập đỉnh mới năm tới, có thể lên 3.000 USD một ounce trước tháng 12/2025.</p>',50,'Mỹ Ý','https://i1-kinhdoanh.vnecdn.net/2024/12/21/gold-2024-12-21T090624-347-173-5354-5926-1734746917.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=q2meEcbmIBNBZE9nV6TzRw',
  2,'Mỗi ounce vàng tăng thêm gần 30 USD khi số liệu lạm phát Mỹ tháng 11 củng cố khả năng Fed tiếp tục giảm lãi suất năm tới.',TRUE),
  ('2024-12-04 20:12:00', 'Bitcoin giảm về sát 92.000 USD', '<p>Gần 680 triệu USD dòng tiền bị rút ròng từ các quỹ ETF Bitcoin khiến thị giá đồng này bốc hơi 10% về sát 92.000 USD.</p>
<p>Bitcoin (BTC) một lần nữa mất mốc 100.000 USD và đi quanh khu vực 95.000-97.000 USD suốt chiều nay.</p>
<p>Đến khoảng 19h10 (tức 7h10 giờ địa phương), BTC bất ngờ sụt mạnh về 92.175 USD một đơn vị, mất giá 10% chỉ sau 24 giờ. Nếu so với kỷ lục hồi 17/12, tiền số lớn nhất thế giới mất gần 16.100 USD. Vốn hóa cũng giảm theo tốc độ tương tự, khiến BTC lùi về vị trí thứ 8 trong bảng xếp hạng tài sản lớn nhất toàn cầu.</p>
<p>Sau đó, giá thị trường cải thiện lên vùng 94.000 USD. Tuy nhiên, đây vẫn là khoảng cách lớn so với <a href="https://vnexpress.net/gia-bitcoin-hom-nay-btc-co-ky-luc-moi-gan-106-500-usd-4828266.html">đỉnh giá 106.500 USD</a> cách đây 3 ngày.</p>
<p>Cú sập của Bitcoin diễn ra sau khi thị trường ghi nhận hiện tượng chốt lời mạnh của nhóm nhà đầu tư "cá mập".</p>
<p>Theo số liệu từ công ty đầu tư Farside Investors có trụ sở tại Anh, các quỹ ETF Bitcoin (một loại quỹ giao dịch trên thị trường chứng khoán, đầu tư chủ yếu vào Bitcoin) giao ngay của Mỹ chứng kiến dòng tiền rút ròng lớn nhất từng được ghi nhận là 679 triệu USD. CoinTelegraph đánh giá đợt xả hàng này mang tính "thanh tẩy".</p>
<p>Tuy nhiên, các chuyên gia cho rằng động thái trên giúp loại bỏ đầu cơ quá mức cho thị trường. Dẫu vậy, những người tham gia thị trường lâu năm vẫn lo ngại điều tồi tệ hơn còn xảy ra.</p>
<figure class="image">
<img src="https://i1-kinhdoanh.vnecdn.net/2024/12/20/Bitcoin-giam-jpeg-1734700459-5258-1734700723.jpg?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=wfd2ei0JsxhqeZV0nCLgnw" alt="Biểu trưng Bitcoin đặt trước một biểu đồ minh họa xuống giá. Ảnh: CNBC">
</figure>
<p>Biểu trưng Bitcoin đặt trước một biểu đồ minh họa xuống giá. Ảnh: <i>CNBC</i>
</p>
<p>Khoảng 900 triệu USD tài sản số đã bị thanh lý trong vòng 24 giờ, theo dữ liệu từ CoinGlass. Những thay đổi trong chính sách vĩ mô của Mỹ khi Cục Dự trữ liên bang Mỹ (Fed) phát tín hiệu giảm tốc trong hạ lãi suất năm sau, đã cắt ngắn đợt phục hồi của các tài sản rủi ro trên diện rộng.</p>
<p>Thêm vào đó, Chủ tịch Fed Jerome Powell nói rằng cơ quan này "không được phép sở hữu Bitcoin" theo Đạo luật Cục Dự trữ liên bang. Ông nhấn mạnh họ cũng không có ý định sửa đổi luật để tham gia vào xây dựng kho dự trữ tiền số theo ý tưởng của Tổng thống đắc cử Donald Trump.</p>
<p>"Mặc dù rất dễ đổ lỗi cho việc bán tháo là do Fed, nhưng chúng tôi tin rằng nguyên nhân gốc rễ của sự sụp đổ bởi thị trường ở trạng thái tăng trưởng quá mức", nhóm phân tích của nền tảng tiền số QCP Capital nhấn mạnh.</p>',50,'Mỹ Ý','https://i1-kinhdoanh.vnecdn.net/2024/12/20/Bitcoin-giam-jpeg-1734700459-5258-1734700723.jpg?w=680&h=0&q=100&dpr=2&fit=crop&s=5igJPN1N_wLFyoH4Ihn7ZQ',
  5,'Gần 680 triệu USD dòng tiền bị rút ròng từ các quỹ ETF Bitcoin khiến thị giá đồng này bốc hơi 10% về sát 92.000 USD.',TRUE),
   ('2024-12-04 20:12:00', 'Công ty ChatGPT tiến bước dài đến siêu trí tuệ AGI', '<p>OpenAI cho biết đang thử nghiệm hai mô hình AI "có thể suy luận" o3 và o3 mini, được đánh giá giúp tiến thêm một bước dài đến AGI.</p>
<p>Trên blog ngày 20/12, OpenAI cho biết o3 và o3 mini đang trong quá trình thử nghiệm an toàn ở quy mô nội bộ, nhưng đã đạt "điểm số cao đột phá" trong bài kiểm tra lý luận AI có tên ARC Challenge. Trong đó, mô hình đạt 87,5% ở bài ARC-AGI, vượt "trình độ con người" cũng như có tính năng "chuỗi suy nghĩ riêng tư", giúp "tự suy nghĩ" trước khi đưa ra câu trả lời.</p>
<p>OpenAI khẳng định mô hình mới "mạnh hơn <a href="https://vnexpress.net/ai-lap-muu-phan-khang-khi-nghi-sap-bi-thay-the-4825746.html">mô hình o1</a> ra mắt trước đó" và là "bước nhảy vọt ấn tượng về hiệu suất". CEO Sam Altman khiêm tốn hơn khi nói đây là khởi đầu cho "giai đoạn tiếp theo" của AI.</p>
<figure class="image">
<img src="https://i1-sohoa.vnecdn.net/2024/12/21/o3-1734749921-8786-1734750062.png?w=680&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s=TClE9BBFx927IwEAueBkAQ" alt="Minh họa về OpenAI o3. Ảnh: VentureBeat">
</figure>
<p>Minh họa về OpenAI o3. Ảnh: <i>VentureBeat</i>
</p>
<p>OpenAI o1 <a href="https://vnexpress.net/openai-ra-sieu-ai-moi-voi-kha-nang-lap-luan-4792384.html">ra mắt</a> hồi tháng 9. Khi đó, công ty cho biết mô hình có <a href="https://vnexpress.net/openai-ra-sieu-ai-moi-voi-kha-nang-lap-luan-4792384.html">khả năng suy luận</a> thông qua các nhiệm vụ phức tạp và có thể giải quyết vấn đề khó hơn so với trước về khoa học, mã hóa và toán học. Khi đó, <i>Business Insider</i> đánh giá, sự xuất hiện của o1 khiến "ranh giới phân chia trí thông minh con người với trí thông minh nhân tạo ngày càng trở nên hẹp hơn".</p>
<p>OpenAI đang mở quy trình nộp đơn cho các nhà nghiên cứu bên ngoài, cho phép họ thử nghiệm mô hình o3 trước khi phát hành công khai. Chương trình dự kiến kết thúc ngày 10/1/2025.</p>
<p>Theo <i>Reuters</i>, việc <a href="https://vnexpress.net/chu-de/openai-5975">OpenAI</a> thử nghiệm o3 mạnh hơn o1 chỉ sau vài tháng cho thấy công ty đang đẩy nhanh quá trình tiến đến siêu trí tuệ <a href="https://vnexpress.net/sieu-tri-tue-nhan-tao-agi-la-gi-4681761.html">AGI</a> - cột mốc đột phá trong lĩnh vực trí tuệ nhân tạo, với viễn cảnh AI thông minh hơn con người. Trước đó, o1 được một số chuyên gia nhận định có thể <a href="https://vnexpress.net/sieu-tri-tue-nhan-tao-agi-dang-dan-hien-dien-4825386.html">tiệm cận</a> AGI.</p>
<p>Sau thông báo của công ty đứng sau ChatGPT, Francois Chollet, chuyên gia của ARC Challenge và vừa rời Google Research, đánh giá mô hình mới "rất ấn tượng và là cột mốc lớn trên con đường hướng tới AGI", dù còn "một số lượng khá lớn" nhiệm vụ đơn giản mà o3 chưa thể giải quyết. Chollet nói thêm rằng "những khả năng này là thuộc về lĩnh vực mới, đòi hỏi sự quan tâm về khoa học một cách nghiêm túc".</p>
<p>Arc Prize, một sáng kiến phi lợi nhuận cho thúc đẩy nghiên cứu AGI, cũng đánh giá o3 là bước tiến lớn nếu khả năng của nó mạnh hơn o1. "Đây có thể bước tiến đáng ngạc nhiên và quan trọng của <a href="https://vnexpress.net/chu-de/tri-tue-nhan-tao-ai-1980">AI</a>, cho thấy khả năng thích ứng với nhiệm vụ mới chưa từng thấy trước đây trong mô hình họ GPT", tổ chức này viết trên blog.</p>
<p>
<i>Fortune</i> đánh giá o3 chưa phải là AGI, nhưng mô hình mới nhiều khả năng sẽ giúp ChatGPT xử lý các truy vấn phức tạp hơn và giải quyết vấn đề từng bước. "Đặc biệt, tìm kiếm AI có thể phát triển với sự hiểu biết ngữ nghĩa được cải thiện, do chúng tìm thông tin không chỉ dựa trên từ khóa, mà còn trên ý nghĩa sâu sắc và mối quan hệ giữa các khái niệm. Các mô hình cũng có thể tạo ra câu chuyện và bài luận mạch lạc hơn, giải quyết vấn đề theo thời gian thực", trang này bình luận.</p>',81,'Mỹ Ý','https://i1-sohoa.vnecdn.net/2024/12/21/o3-1734749921-8786-1734750062.png?w=680&h=0&q=100&dpr=2&fit=crop&s=Qj_mc_4DQ6xWNzRM6uHRHA',
  5,'OpenAI khẳng định mô hình mới "mạnh hơn mô hình o1 ra mắt trước đó" và là "bước nhảy vọt ấn tượng về hiệu suất". CEO Sam Altman khiêm tốn hơn khi nói đây là khởi đầu cho "giai đoạn tiếp theo" của AI.',TRUE);
CREATE TABLE `news_tags` (
  `NewsID` int(11) unsigned NOT NULL, -- ID bài viết
  `TagID` int(11) unsigned NOT NULL, -- ID tag
  PRIMARY KEY (`NewsID`, `TagID`),
  FOREIGN KEY (`NewsID`) REFERENCES `news`(`NewsID`) ON DELETE CASCADE, -- Liên kết với bảng news
  FOREIGN KEY (`TagID`) REFERENCES `tag`(`TagID`) ON DELETE CASCADE -- Liên kết với bảng tag
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;
 

 INSERT INTO `tag` (`TagName`) 
VALUES 
  ('Việt Nam'), 
  ('bài viết hay');
  INSERT INTO `news_tags` (`NewsID`, `TagID`) 
VALUES 
  (1, 1), (1, 2),
  (2, 1), (2, 2),
  (3, 1), (3, 2),
  (4, 1), (4, 2),
  (5, 1), (5, 2),
  (6, 1), (6, 2),
  (7, 1), (7, 2),
  (8, 1), (8, 2),
  (9, 1), (9, 2),
  (10, 1), (10, 2),
  (11, 1), (11, 2),
  (12, 1), (12, 2),
  (13, 1), (13, 2),
  (14, 1), (14, 2),
  (15, 1), (15, 2),
  (16, 1), (16, 2),
  (17, 1), (17, 2),
  (18, 1), (18, 2),
  (19, 1), (19, 2),
  (20, 1), (20, 2),
  (21, 1), (21, 2);
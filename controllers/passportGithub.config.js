import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import dotenv from "dotenv";
import User from "../services/account.service.js"; // Giả định rằng bạn có mô hình User

dotenv.config();

export default function configurePassport() {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/account/login/githubAuth/callback",
        scope: ["user:email"], // Yêu cầu quyền truy cập email từ GitHub
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          console.log(profile.username);
          // Lấy email (nếu có)
          const email =
            profile.emails && profile.emails.length > 0
              ? profile.emails[0].value
              : null;

          if (!email) {
            return done(new Error("Email not provided by GitHub"), null);
          }

          // Tìm user theo GitHub username
          let user = await User.findByUsername(profile.username);

          if (user) {
            // Nếu user tồn tại nhưng chưa liên kết GitHub, cập nhật GitHub ID
            if (!user.githubId) {
              user.githubId = profile.id; // Cập nhật githubId
              await User.update(user); // Cập nhật thông tin người dùng trong DB
            }
            // Xác thực thành công
            return done(null, user);
          } else {
            // Nếu không tìm thấy user, tạo user mới
            user = {
              githubId: profile.id,
              username: profile.username,
              name: profile.displayName || profile.username || "No Name",
              email: email,
              permission: 1,
            };
            await User.add(user); // Thêm user mới vào cơ sở dữ liệu
            return done(null, user); // Xác thực thành công và trả về user
          }
        } catch (error) {
          console.error("Error during GitHub authentication:", error);
          return done(error, null); // Xử lý lỗi
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user.username); // Chỉ lưu trữ ID (hoặc username) của người dùng vào session
  });

  // Deserialize user: khôi phục thông tin người dùng từ session
  passport.deserializeUser(async function (username, done) {
    try {
      const user = await User.findByUsername(username); // Lấy thông tin người dùng từ DB bằng ID
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

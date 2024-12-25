import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../services/account.service.js'; // Giả định rằng bạn có mô hình User

dotenv.config();

export default function configurePassport() {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/account/login/googleAuth/callback",
        scope: ['profile', 'email']
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          const email = profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

          // Tìm user theo tên hiển thị (displayName) hoặc email
          let user = await User.findByUsername(profile.displayName);

          if (user) {
            // Nếu user đã tồn tại nhưng chưa có googleId, cập nhật googleId
            if (!user.googleId) {
              user.googleId = profile.id;
              await User.update(user); // Cập nhật thông tin user
            }
            // Xác thực thành công
            return done(null, user);
          } else {
            // Nếu không tìm thấy user, tạo user mới
            user = {
              googleId: profile.id,
              username: profile.displayName,
              email: email,
              permission: 1
            };
            await User.add(user); // Thêm user mới vào cơ sở dữ liệu
            return done(null, user); // Xác thực thành công và trả về user
          }
        } catch (error) {
          console.error('Error during Google authentication:', error);
          return done(error, null); // Xử lý lỗi
        }
      }
    )
  );

  passport.serializeUser(function(user, done) {
    done(null, user.username);  // Chỉ lưu trữ ID (hoặc username) của người dùng vào session
  });

  // Deserialize user: khôi phục thông tin người dùng từ session
  passport.deserializeUser(async function(username, done) {
    try {
      const user = await User.findByUsername(username);  // Lấy thông tin người dùng từ DB bằng ID
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}

import passport from 'passport';
import dotenv from 'dotenv';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../services/account.service.js'; // Giả định rằng bạn có mô hình User

dotenv.config();

export default function configurePassport() {
  

  passport.use(
    new GoogleStrategy({
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
          let user = await User.findByUsername(profile.displayName);
          if (user) {
            // Nếu user tồn tại nhưng chưa liên kết GitHub, cập nhật GitHub ID
            if (!user.googleId) {
              user.googleId = profile.id;
                await user.save();
            }
          } else {
            // Nếu không tìm thấy user, tạo user mới
            user = await User.add({
              googleId: profile.id,
              username: profile.displayName,
              email: email,
              permission: 1
            });
          }
          // Xác thực thành công
          return done(null, user);
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

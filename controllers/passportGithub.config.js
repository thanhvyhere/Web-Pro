import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import dotenv from 'dotenv';
import User from '../model/User.js';
import accountService from '../services/account.service.js';

dotenv.config();

export default function configurePassport() {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: "http://localhost:3000/account/login/githubAuth/callback",
        scope: ['user:email'], // Yêu cầu quyền truy cập email từ GitHub
      },
      async function (accessToken, refreshToken, profile, done) {
        try {
          console.log(profile.username);
          // Lấy email (nếu có)
          const email = profile.emails && profile.emails.length > 0
            ? profile.emails[0].value
            : null;

          if (!email) {
            return done(new Error('Email not provided by GitHub'), null);
          }

          // Tìm user theo GitHub username
          let user = await accountService.findByEmail(email);

          if (user) {
            if (!user.githubId) {
                user.githubId = profile.id;
                await user.save();
            }
            return done(null, user);
          } else {
            // Nếu không tìm thấy user, tạo user mới
            user = new User({
              githubId: profile.id,
              username: profile.username,
              name: profile.displayName || profile.username || 'No Name',
              email: email,
            });
            await user.save();
            return done(null, user); 
          }
        } catch (error) {
          console.error('Error during GitHub authentication:', error);
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
        const user = await accountService.findByUsername(username);  // Lấy thông tin người dùng từ DB bằng ID
        done(null, user);
      } catch (error) {
        done(error, null);
      }
    });
}

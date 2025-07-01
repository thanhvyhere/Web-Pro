import User from '../model/User.js';
import OtpUser from '../model/OtpUser.js'
import { Role } from '../model/Role.js';
export default {
    // Tìm người dùng theo tên đăng nhập
    findByUsername(username) {
        return User.findOne({username: username});
    },
    
    // Tìm người dùng theo email
    findByEmail(email) {
        return User.findOne({email: email});
    },

    // Thêm người dùng mới
    add(entity) {
        const user = new User(entity);
        return user.save();
    }, 

    updateUser(id, user) {
        return User.findByIdAndUpdate(id, user, { new: true });
    },

    addOTP(entity) {
        const otp = new OtpUser(entity)
        return otp.save();
    }, 

    findOTPByEmail(email) {
        return OtpUser.findOne({ email: email });
    },

    updatePassword(email, username, newPassword) {
        return User.findOneAndUpdate(
            { 
                email: email, 
                username: username,
            },          
            { $set: { password: newPassword } }, // cập nhật password
            { new: true }                     // trả về document mới sau khi update
        );
    },

    // Lấy OTP từ cơ sở dữ liệu
    findbyID(userId)
    {
        return User.findById(userId);
    },

    delOTP(otp)
    {
        return OtpUser.deleteOne({otp: otp})
    },

    roleFeature(id) {
        return db('features')
            .join('roles', 'features.RoleID', 'roles.RoleID') // Thực hiện JOIN
            .select(
                'features.FeatureID',
                'features.FeatureName',
                'features.PathName',
                'features.RoleID',
                'features.Icon',
                'roles.RoleName' // Lấy RoleName từ bảng roles
            )
            .where('features.RoleID', id); // Lọc theo RoleID
    },

    async findbyrolename(permission)
    {
        return await Role.findOne({ RoleName: permission }).exec();
    },

    // findRoleById(roleId) {
    //     return User.findById()
    // },

    upPremium(id) {
        return User.findByIdAndUpdate(id, {role: 'subscriber'});
    },

    findPremiumByUserId(id)
    {
        return db('premium_accounts').where('id', id).first();
    },

    delPremium(id)
    {
        return User.findByIdAndUpdate;
    },

    updatePremiumDate(id, day) {
        return User.findByIdAndUpdate(id, {'expiration_date': day});
    },
    findPremiumDate(id)
    {
        return db('premium_accounts').where('id', id).first();
    },



    findPremiumRegisterByUserId(userId) {
        return db('premium_accounts')
            .where('id', userId)
            .first()
            .then(account => account)
            .catch(err => {
                throw new Error('Error fetching premium account: ' + err.message);
            });
    },
    
    // Lấy thông tin người dùng theo ID
getUserById(userId, callback) {
    db('users')
        .select('id', 'username', 'email', 'dob', 'NoOfFollower', 'NoOfFollowing', 'permission')
        .where({ id: userId })
        .first()
        .then((user) => {
            if (!user) {
                return callback(null, null);
            }

            // Chuyển đổi ngày sinh thành định dạng yyyy-MM-dd
            const dobFormatted = new Date(user.dob).toISOString().split('T')[0];

            callback(null, { ...user, dob: dobFormatted });
        })
        .catch((err) => {
            callback(err, null);
        });
},

// Lấy tên quyền từ bảng roles theo permission ID
    getRoleById(permissionId, callback) {
        db('roles')
            .select('RoleName')
            .where({ RoleID: permissionId })
            .first()
            .then((role) => {
                if (!role) {
                    return callback(null, null);
                }

                callback(null, role);
            })
            .catch((err) => {
                callback(err, null);
            });
    },

updateDOB(userId, dob, callback) {
    // Kiểm tra định dạng ngày hợp lệ
    const date = new Date(dob);
    if (isNaN(date.getTime())) {
        return callback(new Error('Ngày sinh không hợp lệ'), false);
    }

    // Chuyển đổi ngày sinh thành định dạng UTC
    const dobUTC = new Date(date.toISOString());

    db('users')
        .where({ id: userId })
        .update({ dob: dobUTC })  // Lưu ngày sinh ở dạng UTC
        .then((rowsAffected) => {
            if (rowsAffected === 0) {
                return callback(null, false); // Không có dòng nào được cập nhật
            }
            callback(null, true); // Thành công
        })
        .catch((err) => {
            callback(err, false);
        });
    },       
};
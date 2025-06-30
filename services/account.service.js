// import db from '../utils/db.js';
import { Role } from '../model/Role.js';
export default {
    // Tìm người dùng theo tên đăng nhập
    findByUsername(username) {
        return db('users').where('username', username).first();
    },
    
    // Thêm người dùng mới
    add(entity) {
        return db('users').insert(entity);
    }, 

    updateUser(id, user) {
        return db('users').where('id', id).update(user);
    },

    addOTP(entity) {
        return db('otp_table').insert(entity);
    }, 

    findOTPByEmail(email) {
        return db('otp_table').where('email', email).first();
    },

    updatePassword(email, newPassword) {
        return db('users').where('email', email).update({ password: newPassword });
    },

    // Lấy OTP từ cơ sở dữ liệu
    findbyID(userId)
    {
        return db('users').where('id', userId).first()
    },

    delOTP(otp)
    {
        return db('otp_table').where('otp', otp).del();
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

    async findByRoleName(permission)
    {
        return await Role.findOne({ RoleName: permission }).exec();
    },

    findRoleById(roleId) {
        return db('roles').where('RoleID', roleId).first();
    },

    addPremium(entity) {
        return db('premium_accounts').insert(entity);
    },

    updatePermission(id, permission) {
        return db('users').where('id', id).update({ 'permission': permission });
    },

    findPremiumByUserId(id)
    {
        return db('premium_accounts').where('id', id).first();
    },

    delPremium(id)
    {
        return db('premium_accounts').where('id', id).del();
    },

    updatePremium(id, day) {
        return db('premium_accounts').where('id', id).update({'expiration_date': day});
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
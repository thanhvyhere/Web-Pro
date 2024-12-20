import db from '../utils/db.js';

export default {
    // Tìm người dùng theo tên đăng nhập
    findByUsername(username) {
        return db('users').where('username', username).first();
    },
    // Tìm người dùng theo email
    findByEmail(email) {
        return db('users').where('email', email).first();
    },

    // Thêm người dùng mới
    add(entity) {
        return db('users').insert(entity);
    }, 
    save(user) {
        return db('users').update(user);
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
        return db('users').where({ id: userId }).first()
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
    findbyrolename(permission)
    {
        return db('roles').where('RoleName', permission).first();
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
    }

};

import { mongoose } from '../utils/db.js'; 
const { Schema, model, Types } = mongoose;

const userSchema = new Schema({
  githubId: String,      
  googleId: String,
  username: { type: String, unique: true },
  password: String,
  name: String,
  email: String,
  dob: Date,             
  permission: Number,    
  NoOfFollower: { type: Number, default: 0 },
  NoOfFollowing: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  gender: {
    type: String,
    enum: ['Male', 'Female', 'none'],
    default: 'none'
  },
  address: String,
  phone: String,
  avatar: String,
  roleId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Role', 
    required: true 
  }
}, { collection: 'User' });

const User = model('User', userSchema);

export default User;
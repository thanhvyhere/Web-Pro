import { mongoose } from '../utils/db.js'; 

const { Schema, model } = mongoose;

const roleSchema = new Schema({
    roleId: { type: Number, required: true },
    role: { 
        type: String, 
        required: true, 
        enum: ['guest', 'subscriber', 'writer', 'editor', 'administrator'], 
        default: 'guest' 
    },
});

const Role = model('Role', roleSchema);

export { Role };

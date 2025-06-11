import { mongoose } from '../utils/db.js'; 

const { Schema, model } = mongoose;

const roleSchema = new Schema({
    _id: Number,
    role: { 
        type: String, 
        required: true, 
        enum: ['guest', 'subscriber', 'writer', 'editor', 'administrator'], 
        default: 'guest' 
    },
},{ _id: false, collection:'Role' });

const Role = model('Role', roleSchema);

export { Role };

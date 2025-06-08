import { mongoose } from '../utils/db.js'; 

const { Schema, model } = mongoose;


const categorySchema = new Schema({
    _id: Number,
    CatName: { type: String, required: true },
    parent_id: { type: Number, ref: 'Category', default: null }
},{ _id: false, collection: 'Category' });
const Category = model('Category',categorySchema);
export {Category};
import { mongoose } from '../utils/db.js'; 

const { Schema, model } = mongoose;


const categorySchema = new Schema({
    CatName: { type: String, required: true },
    parent_id: { type: Number, ref: 'Category', default: null }
});
const Category = model('Category',categorySchema);
export {Category};
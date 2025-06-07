import { mongoose } from '../utils/db.js'; 

const { Schema, model } = mongoose;


const tagSchema = new Schema({
    tagName: { type: String, required: true },
});
const Tag = model('Tag',tagSchema);
export {Tag};
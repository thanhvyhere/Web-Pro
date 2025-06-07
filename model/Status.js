import { mongoose } from '../utils/db.js'; 

const { Schema, model } = mongoose;


const statusSchema = new Schema({
    status: { type: String, required: true },
});
const Status = model('Status',statusSchema);
export {Status};
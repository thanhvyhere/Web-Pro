import { mongoose } from '../utils/db.js'; 
const { Schema, model } = mongoose;
const CommentSchema = new mongoose.Schema({
  Comment: { type: String, required: true },
  NewsID: { type: Schema.Types.ObjectId, ref: 'News', required: true },
  UserID: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  CreatedDate: { type: Date, default: Date.now }
});
const News = model('News',newsSchema);
export {News};
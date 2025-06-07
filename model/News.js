import { mongoose } from '../utils/db.js'; 
const { Schema, model } = mongoose;
const newsSchema = new Schema({
  Title: { type: String, required: true },
  Content: { type: String, required: true },
  Abstract: { type: String, required: true },
  CatID: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  AuthorName: { type: String, required: true },
  ImageCover: { type: String },
  Status: { type: Schema.Types.ObjectId, ref: 'Status', required: true },
  PublishedDay: { type: Date },
  Feedback: { type: String },
  Views: { type: Number, default: 0 },
  Premium: { type: Boolean, default: false },
  CreatedDate: { type: Date, default: Date.now }
});
const News = model('News',newsSchema);
export {News};
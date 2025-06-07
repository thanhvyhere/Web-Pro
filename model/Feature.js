import { mongoose } from '../utils/db.js';
const { Schema, model, Types } = mongoose;

const featureSchema = new Schema({
  featureID: { type: Number, required: true, unique: true },
  featureName: { type: String, required: true },
  pathName: { type: String, required: true },
  roleId: { 
    type: Schema.Types.ObjectId, 
    ref: 'Role', 
    required: true 
  },
  icon: { type: String, default: null },
}, { collection: 'features' });

const Feature = model('Feature', featureSchema);

export default Feature;

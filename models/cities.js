import mongoose, { model } from 'mongoose';

const dataSchema = mongoose.Schema({
	id: String,
	name: String,
	photos: String,
	places: Array,
	districts: Array,
});
export default model('Citie', dataSchema);

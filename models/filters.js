import mongoose, { model } from 'mongoose';

const filtersSchema = mongoose.Schema({
	id: String,
	subcategories: Array,
	categories: Array,
});
export default model('Filter', filtersSchema);

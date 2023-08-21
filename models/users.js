import mongoose, { model } from 'mongoose';

const usersSchema = mongoose.Schema({
	uid: String,
	email: String,
	name: String,
	cities: Array,
	photo: String,
});
export default model('User', usersSchema);

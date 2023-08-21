import multer from 'multer';
import fs from 'fs-extra';
const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		let type = req.query.type;
		let path = `./images/${type}`;
		fs.emptyDirSync(path);
		callback(null, path);
	},
	filename(req, file, cb) {
		cb(null, 'user' + file.originalname);
	},
});
const types = ['image/png', 'image/jpeg', 'image/jpg'];

const fileFilter = (req, file, cb) => {
	types.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

export default multer({ storage, fileFilter });

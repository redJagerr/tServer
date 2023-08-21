import { Router } from 'express';
import express from 'express';
import User from '../models/users.js';
import _ from 'lodash';
import fileMiddleware from '../middleware/file.js';
const router = Router();
router.use(express.json());

////---Получить пользователя
router.get('/:uid', async (req, res) => {
	const gettingData = await User.find({ uid: req.params.uid }, { _id: 0 });
	res.json(gettingData[0]);
});

///---Загрузить аватар
router.post('/uploadImage', fileMiddleware.single('avatar'), (req, res) => {
	console.log(req.file.path);
	User.findOneAndUpdate(
		{ uid: req.query.type },
		{ photo: req.file.path },
		{ new: true },
		(err, post) => {
			if (err) {
				res.end();
			} else {
				res.end();
			}
		}
	);
	res.json(req.file);
});

///---Добавить место юзеру
router.post('/:userId/:cityId/places', async (req, res) => {
	User.findOneAndUpdate(
		{ uid: req.params.userId, 'cities.id': req.params.cityId },
		{ $push: { 'cities.$.places': req.body } },
		{ returnDocument: 'after' },
		(err, post) => {
			if (err) {
				res.end();
			} else {
				res.end();
			}
		}
	);
});

///---Заменить reorderPlaces
router.patch('/:userId/:cityId/reorderPlaces', async (req, res) => {
	User.findOneAndUpdate(
		{ uid: req.params.userId, 'cities.id': req.params.cityId },
		{ $set: { 'cities.$.places': req.body } },
		(err, post) => {
			if (err) {
				res.end();
			} else {
				res.end();
			}
		}
	);
});

///---Заменить reorderVisited
router.patch('/:userId/:cityId/reorderVisited', async (req, res) => {
	User.findOneAndUpdate(
		{ uid: req.params.userId, 'cities.id': req.params.cityId },
		{ $set: { 'cities.$.visited': req.body } },
		(err, post) => {
			if (err) {
				res.end();
			} else {
				res.end();
			}
		}
	);
});

///---Добавить место в visited
router.post('/:userId/:cityId/visited', async (req, res) => {
	User.findOneAndUpdate(
		{ uid: req.params.userId, 'cities.id': req.params.cityId },
		{ $push: { 'cities.$.visited': req.body } },
		{ new: true },
		(err, post) => {
			if (err) {
				res.end();
			} else {
				res.end();
			}
		}
	);
});

///---Добавить юзера
router.post('/', async (req, res) => {
	const { uid, email, name, photo } = req.body;
	const post = new User({ uid, email, name, photo });
	post
		.save()
		.then(result => res.send(result))

		.catch(error => console.error(error));
});

///---Добавить юзеру город
router.post('/:userId', async (req, res) => {
	User.findOneAndUpdate(
		{ uid: req.params.userId },
		{ $push: { cities: req.body } },
		{ new: true },
		(err, post) => {
			if (err) {
				res.end();
			} else {
				res.end();
			}
		}
	);
});

///---Удалить место
router.delete('/:userId/:cityId/deletePlace', async (req, res) => {
	User.findOneAndUpdate(
		{ uid: req.params.userId, 'cities.id': req.params.cityId },
		{ $pull: { 'cities.$.places': req.body } },
		{ new: true },
		(err, post) => {
			if (err) {
				res.end();
			} else {
				res.end();
			}
		}
	);
});

///---Удалить место в visited
router.delete('/:userId/:cityId/deleteVisitedPlace', async (req, res) => {
	User.findOneAndUpdate(
		{ uid: req.params.userId, 'cities.id': req.params.cityId },
		{ $pull: { 'cities.$.visited': req.body } },
		{ new: true },
		(err, post) => {
			if (err) {
				res.end();
			} else {
				res.end();
			}
		}
	);
});

export default router;

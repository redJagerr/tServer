import { Router } from 'express';
import express from 'express';
import Filters from '../models/filters.js';
import _ from 'lodash';
const router = Router();
router.use(express.json());

//---Получить ПОДкатегорию по категории
router.get('/subcategories', async (req, res) => {
	const gettingData = await Filters.find({}, { subcategories: 1 });
	const filteredData = _.filter(gettingData[0].subcategories, req.query);
	res.json(filteredData[0]);
});
router.get('/subcategoriesAll', async (req, res) => {
	const gettingData = await Filters.find({}, { subcategories: 1 });
	if (typeof req.query.category === 'string') {
		req.query.category = [req.query.category];
	}
	const finalData = req.query.category.map(category => {
		let fil = _.filter(gettingData[0].subcategories, {
			category,
		});
		return fil[0];
	});

	res.json(finalData);
});
//---Получить категории
router.get('/categories', async (req, res) => {
	const gettingData = await Filters.find({}, { categories: 1 });
	res.status(200).json(gettingData[0].categories);
});

export default router;

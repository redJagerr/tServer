import { Router } from 'express';
import express from 'express';
import _ from 'lodash';
import Data from '../models/cities.js';
import { findByObjKey } from '../utils/findByObjKey.js';
const router = Router();
router.use(express.json());

///---Добавить место в город
router.post('/:cityId/addplace', async (req, res) => {
	Data.findOneAndUpdate(
		{ _id: req.params.cityId },
		{ $push: { places: req.body } },
		(err, post) => {
			if (err) {
				res.end();
			} else {
				res.end();
			}
		}
	);
});

//---Поиск места
router.get('/:id/place/:search', async (req, res) => {
	try {
		const gettingData = await Data.findById(req.params.id);
		const searchLowerCase = req.params.search.toLowerCase();
		const filteredData = gettingData.places.filter(item =>
			item.name.toLowerCase().includes(searchLowerCase)
		);
		res.json(filteredData);
	} catch (error) {
		res.json(error);
	}
});

//---Получить города
router.get('/', async (req, res) => {
	const { search } = req.query;
	let gettingData = await Data.find();
	gettingData = search
		? gettingData.filter(item =>
				item.name.toLowerCase().includes(search.toLowerCase())
		  )
		: gettingData;

	res.json(gettingData);
});

//---Получить город для поиска
router.get('/:id/search', async (req, res) => {
	const gettingData = await Data.find(
		{ _id: req.params.id },
		{ photos: 1, name: 1 }
	);
	res.json(gettingData[0]);
});
//---Получить районы
router.get('/:id/districts', async (req, res) => {
	const gettingData = await Data.find(
		{ _id: req.params.id },
		{ _id: 0, districts: 1 }
	);
	res.json(gettingData[0].districts);
});
//---Получить место по id
router.get('/:id/places/:placeId', async (req, res) => {
	const gettingData = await Data.findById(req.params.id);
	const filteredData = _.filter(gettingData.places, { id: req.params.placeId });
	res.json(filteredData);
});

//---Получить места по фильтру
router.get('/:id/places', async (req, res) => {
	const gettingData = await Data.findById(req.params.id);
	const {
		page,
		search,
		rating,
		sortBy,
		orderBy,
		locals,
		district,
		...filters
	} = req.query;
	let places = gettingData.places;
	let pageCount = 0;
	let placeSliceEnd = '';
	const limit = 6;
	const withSubcat = {
		subcategory: [],
	};

	for (let key in filters) {
		if (typeof filters[key] === 'string') {
			filters[key] = [filters[key]];
		}
	}

	if (filters?.subcategory) {
		const categWithSub = [];
		filters.subcategory.forEach(sub => {
			const categoryName = sub.slice(0, 3);
			if (filters.category.includes(categoryName)) {
				withSubcat.subcategory.push(sub);
				if (!categWithSub.includes(categoryName))
					categWithSub.push(categoryName);
			}
		});
		filters.category = filters.category.filter(i => !categWithSub.includes(i));
	}

	const noSub = {
		category: filters.category ? filters.category : [],
	};

	if (search) {
		places = places.filter(item =>
			item.name.toLowerCase().includes(search.toLowerCase())
		);
	}
	const filteredSub =
		withSubcat.subcategory.length === 0
			? []
			: places.filter(item => findByObjKey(item, withSubcat));

	const filteredCat =
		noSub.category.length === 0
			? []
			: places.filter(item => findByObjKey(item, noSub));

	places =
		filteredCat.length === 0 && filteredSub.length === 0
			? places.filter(item => findByObjKey(item, filters))
			: [...filteredCat, ...filteredSub];

	places = _.sortBy(places, [sortBy]);
	places = _.orderBy(places, [sortBy], [orderBy]);

	if (rating) {
		places = places.filter(i => Number(i.rating) >= Number(rating));
		pageCount = Math.ceil(places.length / limit);
		places = places.slice((page - 1) * limit, page * limit);
	}
	if (locals) {
		places = places.filter(i => i.localsChoice);
	}
	if (district) {
		places = _.filter(places, function (place) {
			return district.includes(place.district);
		});
	}
	pageCount = Math.ceil(places.length / limit);
	placeSliceEnd = pageCount === page ? null : page * limit;
	const totalPlaces = places.length;
	places = places.slice((page - 1) * limit, placeSliceEnd);
	res.json({ places, pageCount, totalPlaces });
});
router.post('/:cityId/:placeId/reviews', async (req, res) => {
	Data.findOneAndUpdate(
		{ _id: req.params.cityId, 'places.id': req.params.placeId },
		{ $push: { 'places.$.reviews': req.body } },
		(err, post) => {
			if (err) {
				res.end();
			} else {
				res.end();
			}
		}
	);
});
router.put('/:cityId/:placeId/likes', async (req, res) => {
	Data.findOneAndUpdate(
		{ _id: req.params.cityId, 'places.id': req.params.placeId },
		{ $set: { 'places.$.likes': req.body.likes } },
		(err, post) => {
			if (err) {
				res.end();
			} else {
				res.end();
			}
		}
	);
});
router.put('/:cityId/:placeId/rating', async (req, res) => {
	Data.findOneAndUpdate(
		{ _id: req.params.cityId, 'places.id': req.params.placeId },
		{ $set: { 'places.$.rating': req.body.rating } },
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

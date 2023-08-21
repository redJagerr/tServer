import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';
import cityRoutes from './routes/citiesRoutes.js';
import filtersRoutes from './routes/filtersRoutes.js';
import usersRoutes from './routes/usersRoutes.js';
import cors from 'cors';
import path from 'path';

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3001;
const app = express();

app.use(cors());
app.use('/', cityRoutes);
app.use('/filters', filtersRoutes);
app.use('/users', usersRoutes);
app.use('/images', express.static(path.join(__dirname, '/images')));
app.use(express.json());

async function startApp() {
	try {
		await mongoose.connect(process.env.DB_URL + 'database');
		app.listen(PORT, () => {
			console.log('FINE ' + PORT);
		});
	} catch (e) {}
}
startApp();

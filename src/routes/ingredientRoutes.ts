import express from 'express';
import _ from 'lodash';
import ingredients from '../data/ingredients.json';

const router = express.Router();

router.get('/ingredients/trending', (req, res) => {
	const trending = _.sampleSize(ingredients, 20);
	res.send(trending);
});

export default router;

import express from 'express';
import _ from 'lodash';
import recipes from '../data/recipes.json';

const router = express.Router();

router.get('/recipes/trending', (_req, res) => {
	const trending = _.sampleSize(recipes, 5);
	res.send(trending);
});

router.get('/filter', (req, res) => {
	const { ingredientId } = req.query;
	if (ingredientId === undefined)
		return res.status(422).send('Invalid parameters');

	const resp = _.filter(recipes, recipe => {
		return _.find(
			recipe.ingredients,
			i => i.ingredient.ingredientId === Number(ingredientId)
		);
	});

	res.send(resp);
});

export default router;

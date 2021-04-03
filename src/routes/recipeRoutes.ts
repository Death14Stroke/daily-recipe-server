import express from 'express';
import _ from 'lodash';
import recipes from '../data/recipes.json';

const router = express.Router();

router.get('/recipes/trending', (_req, res) => {
	const trending = _.sampleSize(recipes, 5);
	res.send(trending);
});

router.get('/search', (req, res) => {
	const { cookTime, query, dishTypes } = req.query;

	if (typeof dishTypes !== 'string')
		return res.status(422).send('Invalid params');

	const categories = JSON.parse(dishTypes);

	const results = _.filter(recipes, recipe => {
		let isValid = cookTime ? recipe.time <= Number(cookTime) : true;

		if (categories.length > 0)
			isValid = isValid && _.includes(categories, recipe.category.id);

		if (typeof query === 'string')
			isValid = isValid && recipe.title.includes(query);

		return isValid;
	});

	res.send(results);
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

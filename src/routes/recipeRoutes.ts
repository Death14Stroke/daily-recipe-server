import express from 'express';
import _ from 'lodash';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import recipes from '../data/recipes.json';
import {
	searchParams,
	SearchParamsSchema
} from '../validators/recipeValidators';

const router = express.Router();
const validator = createValidator();

router.get('/recipes/trending', (_req, res) => {
	const trending = _.sampleSize(recipes, 5);
	res.send(trending);
});

router.post(
	'/search',
	validator.query(searchParams),
	(req: ValidatedRequest<SearchParamsSchema>, res) => {
		const { cookTime, query, dishTypes, ingredients } = req.body;
		let results = recipes;

		if (cookTime) {
			results = results.filter(recipe => recipe.time <= cookTime);
		}
		if (query) {
			results = results.filter(recipe => recipe.title.includes(query));
		}
		if (dishTypes && dishTypes.length > 0) {
			results = results.filter(recipe =>
				dishTypes.includes(recipe.category.id)
			);
		}
		if (ingredients && ingredients.length > 0) {
			results = results.filter(recipe =>
				_.some(recipe.ingredients, ingredient =>
					ingredients.includes(ingredient.ingredient.ingredientId)
				)
			);
		}

		res.send(results);
	}
);

export default router;

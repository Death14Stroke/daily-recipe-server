import express from 'express';
import _ from 'lodash';
import admin from 'firebase-admin';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import recipes from '../data/recipes.json';
import {
	bookmarkParams,
	BookmarkParamsSchema,
	searchParams,
	SearchParamsSchema
} from '../validators/recipeValidators';

const router = express.Router();
const validator = createValidator();

router.get('/recipes/trending', async (req, res) => {
	const { uid } = req;
	let trending = _.sampleSize(recipes, 5);

	try {
		const dbRef = admin.database().ref(`/bookmarks/${uid}`);
		const bookmarks = (await dbRef.once('value')).val() ?? {};
		trending = trending.map(recipe => {
			return {
				...recipe,
				isBookmarked: bookmarks[recipe.recipeId.toString()] || false
			};
		});
	} catch (err) {
		console.log(err);
	}

	res.send(trending);
});

router.post(
	'/search',
	validator.query(searchParams),
	async (req: ValidatedRequest<SearchParamsSchema>, res) => {
		const { uid } = req;
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

		try {
			const dbRef = admin.database().ref(`/bookmarks/${uid}`);
			const bookmarks = (await dbRef.once('value')).val() ?? {};
			results = results.map(recipe => {
				return {
					...recipe,
					isBookmarked: bookmarks[recipe.recipeId.toString()] || false
				};
			});
		} catch (err) {
			console.log(err);
		}

		res.send(results);
	}
);

router.post(
	'/bookmarks',
	validator.body(bookmarkParams),
	async (req: ValidatedRequest<BookmarkParamsSchema>, res) => {
		const { uid } = req;
		const { bookmarks } = req.body;
		const dbRef = admin.database().ref(`/bookmarks/${uid}`);

		const data = _.reduce(
			bookmarks,
			(res, id) => ({ ...res, [id]: true }),
			{}
		);

		try {
			await dbRef.set(data);
			res.send('Bookmarks synced successfully');
		} catch (err) {
			return res
				.status(422)
				.send({ error: 'Could not update bookmarks' });
		}
	}
);

router.get('/bookmarks', async (req, res) => {
	const { uid } = req;
	const dbRef = admin.database().ref(`/bookmarks/${uid}`);

	try {
		let bookmarks = (await dbRef.once('value')).val() ?? {};
		let results = recipes
			.filter(({ recipeId }) => bookmarks[recipeId.toString()] === true)
			.map(recipe => {
				return { ...recipe, isBookmarked: true };
			});
		return res.send(results);
	} catch (err) {
		return res.status(422).send({ error: 'Could not fetch bookmarks' });
	}
});

export default router;

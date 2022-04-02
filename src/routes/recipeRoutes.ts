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
} from '@validators/recipeValidators';
import {
	apiRecipeDetails,
	apiRecipeSteps,
	apiSearchRecipes,
	apiTrendingRecipes
} from '@api/recipes';
import {
	idFieldParams,
	IdFieldParamsSchema,
	trendingParams,
	TrendingParamsSchema
} from '@validators/commonValidators';

const router = express.Router();
const validator = createValidator();

// new api
router.get(
	'/recipes/trending',
	validator.query(trendingParams),
	async (req: ValidatedRequest<TrendingParamsSchema>, res) => {
		const { count } = req.query;

		try {
			const data = await apiTrendingRecipes(count);
			res.set('Cache-control', 'public, max-age=1000');
			return res.send(data);
		} catch (err) {
			console.error(err);
			return res.status(422).send('Could not fetch recipes');
		}
	}
);

// new api
router.get(
	`/recipe/:id`,
	validator.fields(idFieldParams),
	async (req: ValidatedRequest<IdFieldParamsSchema>, res) => {
		const { id } = req.params;

		try {
			const data = await apiRecipeDetails(id);
			return res.send(data);
		} catch (err) {
			console.error(err);
			return res.status(422).send('Could not fetch recipe');
		}
	}
);

// new api
router.get(
	'/steps/:id',
	validator.fields(idFieldParams),
	async (req: ValidatedRequest<IdFieldParamsSchema>, res) => {
		const { id } = req.params;

		try {
			const data = await apiRecipeSteps(id);
			return res.send(data);
		} catch (err) {
			console.error(err);
			return res.status(422).send('Could not fetch recipe steps');
		}
	}
);

// new api
router.get(
	'/recipes/search',
	validator.query(searchParams),
	async (req: ValidatedRequest<SearchParamsSchema>, res) => {
		const { uid } = req;
		const { page, pageSize, ...params } = req.query;

		try {
			const data = await apiSearchRecipes({
				offset: page,
				page: pageSize,
				...params
			});
			return res.send(data);
		} catch (err) {
			console.error(err);
			return res.status(422).send('Could not search for recipes');
		}
		// try {
		// 	const dbRef = admin.database().ref(`/bookmarks/${uid}`);
		// 	const bookmarks = (await dbRef.once('value')).val() ?? {};
		// 	results = results.map(recipe => {
		// 		return {
		// 			...recipe,
		// 			isBookmarked: bookmarks[recipe.recipeId.toString()] || false
		// 		};
		// 	});
		// } catch (err) {
		// 	console.error(err);
		// }
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

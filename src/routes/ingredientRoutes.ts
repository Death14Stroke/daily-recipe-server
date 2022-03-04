import express from 'express';
import _ from 'lodash';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import ingredients from '../data/ingredients.json';
import {
	fetchParams,
	FetchParamsSchema
} from '@validators/ingredientValidators';
import {
	trendingParams,
	TrendingParamsSchema
} from '@validators/commonValidators';
import { Ingredient } from '@models';

const router = express.Router();
const validator = createValidator();

// new api
router.get(
	'/ingredients/trending',
	validator.query(trendingParams),
	async (req: ValidatedRequest<TrendingParamsSchema>, res) => {
		const { count } = req.query;

		try {
			const ingredients = await Ingredient.aggregate([
				{ $sample: { size: Number(count) } },
				{ $project: { id: '$_id', name: 1, image: 1, _id: 0 } }
			]);
			return res.send(ingredients);
		} catch (err) {
			console.error(err);
			return res.status(422).send('Could not fetch ingredients');
		}
	}
);

router.get(
	'/ingredients',
	validator.query(fetchParams),
	(req: ValidatedRequest<FetchParamsSchema>, res) => {
		const { page, pageSize } = req.query;

		const start = page * pageSize;
		const end = start + pageSize;
		const results = ingredients.slice(start, end);

		res.send(results);
	}
);

export default router;

import express from 'express';
import _ from 'lodash';
import { ValidatedRequest, createValidator } from 'express-joi-validation';
import ingredients from '../data/ingredients.json';
import {
	fetchParams,
	FetchParamsSchema
} from '../validators/ingredientValidators';

const router = express.Router();
const validator = createValidator();

router.get('/ingredients/trending', (_req, res) => {
	const trending = _.sampleSize(ingredients, 20);
	res.send(trending);
});

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

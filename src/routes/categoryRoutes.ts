import express from 'express';
import categories from '../data/categories.json';

const router = express.Router();

router.get('/categories', (_req, res) => {
	res.send(categories);
});

export default router;

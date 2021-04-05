import express from 'express';
import categoryRoutes from './routes/categoryRoutes';
import recipeRoutes from './routes/recipeRoutes';
import ingredientRoutes from './routes/ingredientRoutes';
import requireAuth from './middlewares/requireAuth';

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requireAuth);
app.use(categoryRoutes);
app.use(recipeRoutes);
app.use(ingredientRoutes);

// for debugging only
app.disable('etag');

app.listen(3000, () => {
	console.log('Listening on port 3000');
});

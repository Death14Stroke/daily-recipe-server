import express from 'express';
import admin from 'firebase-admin';
import categoryRoutes from './routes/categoryRoutes';
import recipeRoutes from './routes/recipeRoutes';
import ingredientRoutes from './routes/ingredientRoutes';
import requireAuth from './middlewares/requireAuth';

admin.initializeApp({
	credential: admin.credential.cert(require('../serviceAccountKey.json'))
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requireAuth);
app.use(categoryRoutes);
app.use(recipeRoutes);
app.use(ingredientRoutes);

app.listen(3000, () => {
	console.log('Listening on port 3000');
});

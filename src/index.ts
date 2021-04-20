import express from 'express';
import admin from 'firebase-admin';
import categoryRoutes from './routes/categoryRoutes';
import recipeRoutes from './routes/recipeRoutes';
import ingredientRoutes from './routes/ingredientRoutes';
import requireAuth from './middlewares/requireAuth';

const dbUid = require('../firebase.config.json')['adminDatabaseUid'];

admin.initializeApp({
	credential: admin.credential.cert(require('../serviceAccountKey.json')),
	databaseURL: 'https://daily-recipe-360b0-default-rtdb.firebaseio.com/',
	databaseAuthVariableOverride: {
		uid: dbUid
	}
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

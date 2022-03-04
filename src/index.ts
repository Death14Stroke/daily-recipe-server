import express from 'express';
import admin from 'firebase-admin';
import mongoose from 'mongoose';
import 'module-alias/register';
import { categoryRoutes, ingredientRoutes, recipeRoutes } from '@routes';
import { requireAuth } from '@middlewares';

require('dotenv').config();

admin.initializeApp({
	credential: admin.credential.cert(require('../serviceAccountKey.json'))
});

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zh6fp.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
mongoose.connect(mongoUri);
mongoose.connection.on('connected', () => {
	console.log('Connected to Mongo instance');
});

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(requireAuth);
app.use(categoryRoutes);
app.use(recipeRoutes);
app.use(ingredientRoutes);

//const port = process.env.PORT || 3003;

app.listen(3003, () => {
	console.log('Listening on port 3003');
});

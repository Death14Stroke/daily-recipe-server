import { model, Model, Schema, Document } from 'mongoose';

export interface IIngredient extends Document {
	_id: number;
	name: string;
	image: string;
}

const ingredientSchema = new Schema({
	_id: { type: Number, required: true },
	name: { type: String, required: true },
	image: { type: String, required: true }
});

export const Ingredient: Model<IIngredient> = model(
	'Ingredient',
	ingredientSchema
);

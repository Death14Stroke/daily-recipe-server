import Joi from 'joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

export const searchParams = Joi.object({
	cookTime: Joi.number().integer().min(1),
	query: Joi.string(),
	dishTypes: Joi.array(),
	ingredients: Joi.array()
});

export interface SearchParamsSchema extends ValidatedRequestSchema {
	[ContainerTypes.Body]: {
		cookTime: number | undefined;
		query: string | undefined;
		dishTypes: number[] | undefined;
		ingredients: number[] | undefined;
	};
}

import Joi from 'joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

export const trendingParams = Joi.object({
	count: Joi.number().integer().min(1).max(100)
});

export interface TrendingParamsSchema extends ValidatedRequestSchema {
	[ContainerTypes.Query]: {
		count: number;
	};
}

export const idFieldParams = Joi.object({
	id: Joi.string().required()
});

export interface IdFieldParamsSchema extends ValidatedRequestSchema {
	[ContainerTypes.Params]: {
		id: string;
	};
}

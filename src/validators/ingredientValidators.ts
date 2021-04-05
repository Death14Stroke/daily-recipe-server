import Joi from 'joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

export const fetchParams = Joi.object({
	page: Joi.number().integer().min(0),
	pageSize: Joi.number().integer().min(0).max(50)
});

export interface FetchParamsSchema extends ValidatedRequestSchema {
	[ContainerTypes.Query]: {
		page: number;
		pageSize: number;
	};
}

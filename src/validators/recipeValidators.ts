import Joi from 'joi';
import { ContainerTypes, ValidatedRequestSchema } from 'express-joi-validation';

export const searchParams = Joi.object({
	//cookTime: Joi.number().integer().min(1),
	query: Joi.string().required(),
	//dishTypes: Joi.array(),
	//ingredients: Joi.array(),
	page: Joi.number().required(),
	pageSize: Joi.number().required()
});

export interface SearchParamsSchema extends ValidatedRequestSchema {
	[ContainerTypes.Query]: {
		//cookTime: number | undefined;
		query: string;
		//dishTypes: number[] | undefined;
		//ingredients: number[] | undefined;
		page: number;
		pageSize: number;
	};
}

export const bookmarkParams = Joi.object({
	bookmarks: Joi.array()
});

export interface BookmarkParamsSchema extends ValidatedRequestSchema {
	[ContainerTypes.Body]: {
		bookmarks: number[];
	};
}

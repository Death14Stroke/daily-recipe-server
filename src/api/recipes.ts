import client from './client';

type SearchParams = { query: string; offset: number; page: number };

export const apiTrendingRecipes = async (count: number) => {
	const { data } = await client.get('/recipes/random', {
		params: { number: count }
	});

	return data.recipes;
};

export const apiRecipeDetails = async (id: string) => {
	const { data } = await client.get(`/recipes/${id}/information`);
	return data;
};

export const apiRecipeSteps = async (id: string) => {
	const { data } = await client.get(`/recipes/${id}/analyzedInstructions`);
	return data[0].steps;
};

export const apiSearchRecipes = async ({
	query,
	offset,
	page
}: SearchParams) => {
	const { data } = await client.get('/recipes/complexSearch', {
		params: {
			query,
			offset,
			page,
			addRecipeInformation: true,
			fillIngredients: true
		}
	});
	return data;
};

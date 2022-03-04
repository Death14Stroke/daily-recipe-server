import client from './client';

export const apiTrendingRecipes = async (count: number) => {
	const { data } = await client.get('/recipes/random', {
		params: {
			number: count
		}
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

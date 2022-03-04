import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://api.spoonacular.com'
});

instance.interceptors.request.use(config => {
	config.params = {
		apiKey: process.env.API_KEY,
		...config.params
	};

	return config;
});

export default instance;

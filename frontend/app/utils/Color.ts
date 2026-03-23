import colors from 'tailwindcss/colors';

export const lorcanaColors = {
	'Amber': colors.amber[400],
	'Amethyst': colors.violet[700],
	'Emerald': colors.green[600],
	'Ruby': colors.red[700],
	'Sapphire': colors.blue[500],
	'Steel': colors.gray[400]
};

export const getColors = (colorString) => {
	if (!colorString || !colorString.includes('/')) return { color1: '#4b5563', color2: '#4b5563' };
	const parts = colorString.split('/');
	const color1 = lorcanaColors[parts[0]] || '#4b5563';
	const color2 = lorcanaColors[parts[1]] || color1;
	return { color1, color2 };
};
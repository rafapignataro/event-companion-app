export const nameSwitch = (categoryId: number) => {
	switch (categoryId) {
	case 1:
		return 'Music';
	case 2:
		return 'Geek';
	case 3:
		return 'Games';
	default:
		return 'Unknown';
	}
};

export const colorSwitch = (categoryId: number) => {
	switch (categoryId) {
	case 1:
		return '#FF9E59';
	case 2:
		return '#FFE459';
	case 3:
		return '#59FF7D';
	default:
		return '#C7C7C7';
	}
};
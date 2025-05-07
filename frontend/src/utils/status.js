export const statusTransitions = {
	"en attente": ["Inscrit", "Refusé"],
	"inscrit": ["En Attente", "Refusé"],
	"refusé": ["En Attente", "Inscrit"]
};

export function getStatusOptions(current) {
	return statusTransitions[current.toLowerCase()] || [];
}

export const getStatusColor = (status) => {
	const normalized = status.toLowerCase();
	switch (normalized) {
		case 'inscrit':
			return 'text-green-600';
		case 'en attente':
			return 'text-orange-500';
		case 'refusé':
			return 'text-red-500';
		default:
			return 'text-gray-600';
	}
};
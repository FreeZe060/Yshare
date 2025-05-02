import { useState, useMemo } from 'react';

export default function useSortableData(items = [], defaultField = null, defaultDirection = 'asc') {
	const [sortField, setSortField] = useState(defaultField);
	const [sortDirection, setSortDirection] = useState(defaultDirection);

	const sortedItems = useMemo(() => {
		if (!sortField) return items;

		const sorted = [...items].sort((a, b) => {
			let valA = a[sortField]?.toString().toLowerCase() || '';
			let valB = b[sortField]?.toString().toLowerCase() || '';
			return sortDirection === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
		});
		return sorted;
	}, [items, sortField, sortDirection]);

	const toggleSort = (field) => {
		if (sortField === field) {
			setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
		} else {
			setSortField(field);
			setSortDirection('asc');
		}
	};

	return {
		sortedItems,
		sortField,
		sortDirection,
		toggleSort,
		setSortField,
		setSortDirection,
	};
}
import { useState, useMemo } from "react";

export default function usePagination(items = [], itemsPerPage = 10) {
	const [page, setPage] = useState(1);

	const totalPages = Math.ceil(items.length / itemsPerPage);

	const paginatedItems = useMemo(() => {
		const start = (page - 1) * itemsPerPage;
		return items.slice(start, start + itemsPerPage);
	}, [items, page, itemsPerPage]);

	const goToPage = (newPage) => {
		if (newPage < 1 || newPage > totalPages) return;
		setPage(newPage);
	};

	return {
		page,
		totalPages,
		goToPage,
		paginatedItems,
		setPage,
	};
}
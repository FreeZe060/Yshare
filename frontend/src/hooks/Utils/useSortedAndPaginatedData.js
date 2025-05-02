import usePagination from "./usePagination";
import useSortableData from "./useSortableData";
import { useMemo } from "react";

export default function useSortedAndPaginatedData(data, filterFn = null, itemsPerPage = 10) {
	const filteredData = useMemo(() => {
		return typeof filterFn === 'function' ? data.filter(filterFn) : data;
	}, [data, filterFn]);

	const { sortedItems, ...sortHandlers } = useSortableData(filteredData);
	const pagination = usePagination(sortedItems, itemsPerPage);

	return {
		paginatedItems: pagination.paginatedItems,
		sort: sortHandlers,
		pagination,
	};
}
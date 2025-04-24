const RowSkeletonReport = () => {
	return (
		<tr className="animate-pulse border-b border-gray-200">
			<td className="py-3 px-2">
				<div className="flex items-center space-x-3">
					<div className="w-8 h-8 bg-gray-300 rounded-full" />
					<div className="w-24 h-4 bg-gray-300 rounded" />
				</div>
			</td>
			<td className="py-3 px-2">
				<div className="w-32 h-4 bg-gray-300 rounded" />
			</td>
			<td className="py-3 px-2">
				<div className="w-20 h-4 bg-gray-300 rounded" />
			</td>
			<td className="py-3 px-2">
				<div className="w-20 h-4 bg-gray-300 rounded" />
			</td>
            <td className="py-3 px-2">
				<div className="w-20 h-4 bg-gray-300 rounded" />
			</td>
			<td className="py-3 px-2">
				<div className="w-20 h-4 bg-gray-300 rounded" />
			</td>
			<td className="py-3 px-2">
				<div className="flex space-x-3">
					<div className="w-5 h-5 bg-gray-300 rounded" />
					<div className="w-5 h-5 bg-gray-300 rounded" />
					<div className="w-5 h-5 bg-gray-300 rounded" />
				</div>
			</td>
		</tr>
	);
};

export default RowSkeletonReport;
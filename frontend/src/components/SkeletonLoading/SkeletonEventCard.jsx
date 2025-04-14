const SkeletonEventCard = () => {
    return (
        <div className="animate-pulse flex flex-nowrap lg:flex-wrap items-center gap-[40px] py-[30px] border-b border-[#8E8E93]/25">
            <div className="w-[120px] h-[80px] bg-gray-200 rounded"></div>
            <div className="w-[300px] h-[128px] bg-gray-200 rounded-xl shrink-0"></div>
            <div className="flex items-center gap-[78px] lg:gap-[38px] grow min-w-0">
                <div className="space-y-3 w-full">
                    <div className="h-[30px] bg-gray-200 rounded w-3/4"></div>
                    <div className="h-[20px] bg-gray-200 rounded w-1/2"></div>
                </div>
                <div className="h-[30px] bg-gray-200 rounded w-[100px] ml-auto"></div>
            </div>
            <div className="pl-[40px] border-l border-[#8E8E93]/25 shrink-0">
                <div className="h-[40px] w-[100px] bg-gray-200 rounded mb-2"></div>
                <div className="h-[36px] w-[100px] bg-gray-300 rounded"></div>
            </div>
        </div>
    );
};

export default SkeletonEventCard;

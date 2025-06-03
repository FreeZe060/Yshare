import React from 'react';

const SkeletonProfileCard = () => {
    return (
        <div className="animate-pulse bg-white shadow-xl rounded-lg p-6 max-w-5xl mx-auto -mt-32">
            <div className="flex flex-col items-center space-y-6">
                <div className="w-40 h-40 rounded-full bg-gray-300"></div>

                <div className="h-6 bg-gray-300 rounded w-1/3"></div>

                <div className="flex gap-10 mt-4">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="text-center">
                            <div className="h-6 w-10 bg-gray-300 rounded mx-auto mb-2"></div>
                            <div className="h-4 w-24 bg-gray-200 rounded mx-auto"></div>
                        </div>
                    ))}
                </div>

                <div className="space-y-3 w-full max-w-md mt-6">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3 mx-auto"></div>
                    <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                </div>

                <div className="w-full max-w-2xl mt-8">
                    <div className="h-5 bg-gray-300 rounded w-1/4 mb-3"></div>
                    <div className="space-y-2">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-4 bg-gray-200 rounded w-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SkeletonProfileCard;
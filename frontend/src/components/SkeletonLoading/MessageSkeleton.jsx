import React from 'react';

const MessageSkeleton = ({ align = 'left' }) => {
    const alignmentClass = align === 'right' ? 'ml-auto bg-indigo-200' : 'mr-auto bg-gray-200';

    return (
        <div className={`flex items-end ${align === 'right' ? 'justify-end' : 'justify-start'} animate-pulse`}>
            {align === 'left' && (
                <div className="w-8 h-8 bg-gray-300 rounded-full mr-2" />
            )}

            <div className={`w-3/4 h-16 rounded-xl ${alignmentClass}`} />

            {align === 'right' && (
                <div className="w-8 h-8 bg-gray-300 rounded-full ml-2" />
            )}
        </div>
    );
};

export default MessageSkeleton;
import React from "react";
import { X } from "lucide-react";

const formatValue = (key, value) => {
    if (Array.isArray(value)) {
        return value.join(", ");
    }
    if (typeof value === "object" && value !== null) {
        return "[objet]";
    }
    return value;
};

const EventStepThree = ({ data, images, onFieldClick, onRemoveImage }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Récapitulatif :</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(data).map(([key, value]) => {
                    if (!value || (Array.isArray(value) && value.length === 0) || key === "images") return null;
                    return (
                        <div
                            key={key}
                            onClick={() => onFieldClick?.(key)}
                            className="bg-gray-100 p-4 rounded-lg shadow-sm cursor-pointer hover:bg-gray-200 transition"
                        >
                            <strong className="capitalize inline-block mr-1">
                                {key.replace(/_/g, " ")}:
                            </strong>
                            {formatValue(key, value)}
                        </div>
                    );
                })}
            </div>

            {images?.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Vos images :</h3>
                    <div className="flex flex-wrap gap-4">
                        {images.map((img, index) => (
                            <div key={index} className="relative">
                                <img
                                    src={img.preview}
                                    alt={`img-${index}`}
                                    className="h-32 w-48 object-cover rounded-lg shadow"
                                />
                                {images.length > 1 && (
                                    <button
                                        onClick={() => onRemoveImage?.(index)}
                                        className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 transition-colors"
                                    >
                                        <X className="w-4 h-4 text-red-600" />
                                    </button>
                                )}
                            </div>
                        ))}

                    </div>
                </div>
            )}
        </div>
    );
};

export default EventStepThree;
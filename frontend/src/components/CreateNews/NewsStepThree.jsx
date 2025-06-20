import React from "react";
import { X } from "lucide-react";

const formatValue = (key, value) => {
    if (Array.isArray(value)) {
        return value.join(", ");
    }
    if (typeof value === "object" && value !== null) {
        if (value.name) return value.name; 
        return "[objet]";
    }
    return value;
};

const NewsStepThree = ({ data, image, onFieldClick, onRemoveImage }) => {
    return (
        <div className="space-y-4">
            <h2 className="text-xl font-semibold">Récapitulatif :</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(data).map(([key, value]) => {
                    if (!value || (Array.isArray(value) && value.length === 0) || key === "image") return null;

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

            {image?.preview && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-4">Image sélectionnée :</h3>
                    <div className="relative inline-block">
                        <img
                            src={image.preview}
                            alt="preview"
                            className="h-32 w-48 object-cover rounded-lg shadow"
                        />
                        <button
                            onClick={onRemoveImage}
                            className="absolute top-1 right-1 bg-white rounded-full p-1 shadow hover:bg-red-500 transition-colors"
                        >
                            <X className="w-4 h-4 text-red-600" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NewsStepThree;
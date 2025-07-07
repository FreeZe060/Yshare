import React, { useEffect, useState } from "react";
import SelectCategories from "../CreateEvent/SelectCategories";

const Input = ({ label, name, value, onChange, required, type = "text", error }) => (
    <div className="w-full mb-6">
        <label className="block text-gray-700 font-medium mb-2">
            {label}
            {!required && <span className="text-sm text-gray-400 ml-1">(facultatif)</span>}
        </label>
        <input
            type={type}
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            className={`w-full border rounded-lg p-3 focus:outline-none ${error ? 'border-red-500' : 'border-gray-300'} focus:ring-2 ${error ? 'focus:ring-red-400' : 'focus:ring-[#DE35BC]'}`}
        />
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
);

const Textarea = ({ label, name, value, onChange, required }) => (
    <div className="w-full mb-6">
        <label className="block text-gray-700 font-medium mb-2">
            {label}
            {!required && <span className="text-sm text-gray-400 ml-1">(facultatif)</span>}
        </label>
        <textarea
            name={name}
            required={required}
            value={value}
            onChange={onChange}
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-[#DE35BC]"
            rows={5}
        ></textarea>
    </div>
);

const NewsStepOne = ({ formData, onChange, events = [], loadingEvents = false }) => {

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            const file = files[0];
            const preview = URL.createObjectURL(file);
            onChange('image', { file, preview });
        } else {
            onChange(name, value);
        }
    };

    return (
        <div className="grid grid-cols-1 gap-6">
            <Input
                label="Titre de la news"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
            />

            <Textarea
                label="Contenu"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
            />

            <div className="w-full mb-6">
                <label className="block text-gray-700 font-medium mb-2">Image (facultative)</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg p-3"
                />
                {formData.image?.preview && (
                    <img
                        src={formData.image.preview}
                        alt="preview"
                        className="mt-4 h-32 object-cover rounded"
                    />
                )}
            </div>

            <SelectCategories
                selected={formData.categories[0] || ''}
                onChange={(value) => onChange('categories', [value])}
            />

            {events.length > 0 && (
                <div className="w-full mb-6">
                    <label className="block text-gray-700 font-medium mb-2">
                        Associer à un événement (facultatif)
                    </label>
                    <select
                        name="event_id"
                        value={formData.event_id || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-lg p-3"
                    >
                        <option value="">-- Aucun événement associé --</option>
                        {events.map((event) => (
                            <option key={event.id} value={event.id}>
                                {event.title}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
};

export default NewsStepOne;
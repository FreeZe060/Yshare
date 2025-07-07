import React, { useState, useEffect } from "react";
import SelectCategories from "./SelectCategories";

const Input = ({ label, name, value, onChange, required, type = "text", error }) => (
    <div className="w-full mb-6">
        <label className="block text-gray-700 font-medium mb-2">
            {label}
            {required !== false && <span className="text-sm text-red-500 ml-1">*</span>}
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

const AutocompleteCityInput = ({ label, name, value, onChange, required, setCitySelected }) => {
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleInputChange = async (e) => {
        const val = e.target.value;
        onChange(e);
        setCitySelected(false); // reset à false tant qu'une ville n'est pas re-sélectionnée

        if (val.length < 2) {
            setSuggestions([]);
            return;
        }

        try {
            const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&city=${val}&addressdetails=1&limit=5`);
            const data = await res.json();
            setSuggestions(data);
            setShowSuggestions(true);
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelect = (item) => {
        const selectedCity = item.address.city || item.address.town || item.address.village || item.display_name;
        onChange({ target: { name, value: selectedCity } });
        setCitySelected(true);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    return (
        <div className="relative w-full mb-6">
            <label className="block text-gray-700 font-medium mb-2">
                {label}
                {required !== false && <span className="text-sm text-red-500 ml-1">*</span>}
            </label>
            <input
                type="text"
                name={name}
                required={required}
                value={value}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-3 focus:outline-none border-gray-300 focus:ring-2 focus:ring-[#DE35BC]"
                autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-y-auto">
                    {suggestions.map((item, idx) => (
                        <li
                            key={idx}
                            className="p-2 hover:bg-gray-200 cursor-pointer"
                            onClick={() => handleSelect(item)}
                        >
                            {item.display_name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

const EventStepOne = ({ formData, onChange, setCitySelected }) => {
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(name, value);
        validateDates({ ...formData, [name]: value });
    };

    const validateDates = (data) => {
        const now = new Date();
        const start = new Date(`${data.date}T${data.start_time}`);
        const end = new Date(`${data.end_date}T${data.end_time}`);

        const newErrors = {};
        if (data.date && data.start_time && start < now) {
            newErrors.date = "La date de début ne peut pas être dans le passé.";
        }
        if (data.date && data.start_time && data.end_date && data.end_time && end <= start) {
            newErrors.end_date = "La date de fin doit être après la date de début.";
        }
        setErrors(newErrors);
    };

    useEffect(() => {
        validateDates(formData);
    }, [formData]);

    return (
        <div className="grid grid-cols-1 gap-6">
            <Input label="Titre" name="title" value={formData.title} onChange={handleChange} required />
            <Input label="Description" name="description" value={formData.description} onChange={handleChange} />

            <div className="grid sm:grid-cols-1 md:grid-cols-2 grid-cols-4 gap-6">
                <Input label="Date de début" name="date" value={formData.date} onChange={handleChange} type="date" required error={errors.date} />
                <Input label="Heure de début" name="start_time" value={formData.start_time} onChange={handleChange} type="time" required />
                <Input label="Date de fin" name="end_date" value={formData.end_date} onChange={handleChange} type="date" required error={errors.end_date} />
                <Input label="Heure de fin" name="end_time" value={formData.end_time} onChange={handleChange} type="time" required />
            </div>

            <div className="grid sm:grid-cols-1 grid-cols-2 gap-6">
                <Input label="Participants maximum" name="max_participants" value={formData.max_participants} onChange={handleChange} type="number" />
                <Input label="Prix" name="price" value={formData.price} onChange={handleChange} type="number" />
            </div>

            <div className="grid sm:grid-cols-1 md:grid-cols-2 grid-cols-4 gap-6">
                <AutocompleteCityInput label="Ville" name="city" value={formData.city} onChange={handleChange} required setCitySelected={setCitySelected} />
                <Input label="Code Postal" name="postal_code" value={formData.postal_code} onChange={handleChange} required />
                <Input label="Rue" name="street" value={formData.street} onChange={handleChange} />
                <Input label="Numéro de rue" name="street_number" value={formData.street_number} onChange={handleChange} />
            </div>

            <SelectCategories
                selected={formData.categories[0] || ''}
                onChange={(value) => onChange('categories', [value])}
            />
        </div>
    );
};

export default EventStepOne;
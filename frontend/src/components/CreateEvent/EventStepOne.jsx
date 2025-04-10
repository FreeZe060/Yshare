import React from "react";
import SelectCategories from "./SelectCategories";

const Input = ({ label, name, value, onChange, required, type = "text" }) => (
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
        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
);

const EventStepOne = ({ formData, onChange }) => {
  const handleChange = (e) => onChange(e.target.name, e.target.value);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input label="Titre" name="title" value={formData.title} onChange={handleChange} required />
        <div className="md:col-span-2">
            <Input label="Description" name="description" value={formData.description} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Date de début" name="date" value={formData.date} onChange={handleChange} type="date" required />
            <Input label="Heure de début" name="start_time" value={formData.start_time} onChange={handleChange} type="time" required />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input label="Date de fin" name="end_date" value={formData.end_date} onChange={handleChange} type="date" required />
            <Input label="Heure de fin" name="end_time" value={formData.end_time} onChange={handleChange} type="time" required />
        </div>
        <Input label="Participants maximum" name="max_participants" value={formData.max_participants} onChange={handleChange} type="number"/>
        <Input label="Prix" name="price" value={formData.price} onChange={handleChange} type="number" />
        <Input label="Ville" name="city" value={formData.city} onChange={handleChange} required />
        <Input label="Code Postal" name="postal_code" value={formData.postal_code} onChange={handleChange} required />
        <Input label="Rue" name="street" value={formData.street} onChange={handleChange} />
        <Input label="Numéro de rue" name="street_number" value={formData.street_number} onChange={handleChange} />
        <SelectCategories
            selected={formData.categories[0] || ''}
            onChange={(value) => onChange('categories', [value])}
        />
    </div>
  );
};

export default EventStepOne;
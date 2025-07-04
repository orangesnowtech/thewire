import React, { useState, useEffect } from 'react';


interface NigeriaStateSelectProps {
  value: string;
  onChange: (value: string) => void;
  name?: string;
  required?: boolean;
  placeholder?: string;
  label?: string;
}

const NigeriaStateSelect: React.FC<NigeriaStateSelectProps> = ({
  label = '',
  value,
  onChange,
  name = '',
  required = false,
  placeholder = 'Select State',

}) => {
  const [internalValue, setInternalValue] = useState(value);

  const nigeriaStateOptions = [
    "Abia",
    "Abuja",
    "Adamawa",
    "Akwa Ibom",
    "Anambra",
    "Bauchi",
    "Bayelsa",
    "Benue",
    "Borno",
    "Cross River",
    "Delta",
    "Ebonyi",
    "Edo",
    "Ekiti",
    "Enugu",
    "Gombe",
    "Imo",
    "Jigawa",
    "Kaduna",
    "Kano",
    "Katsina",
    "Kebbi",
    "Kogi",
    "Kwara",
    "Lagos",
    "Nasarawa",
    "Niger",
    "Ogun",
    "Ondo",
    "Osun",
    "Oyo",
    "Plateau",
    "Rivers",
    "Sokoto",
    "Taraba",
    "Yobe",
    "Zamfara"
  ];

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const handleChange = (val: string) => {
    setInternalValue(val);
    onChange(val);
  };

  return (
    <div >
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <select
        id={name}
        name={name}
        value={internalValue}
        onChange={(e) => handleChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm text-base focus:outline-none focus:ring-cfgblue focus:border-cfgblue"
      >
        <option value="">{placeholder}</option>
        {nigeriaStateOptions.map((state) => (
          <option key={state} value={state}>
            {state}
          </option>
        ))}
      </select>
    </div>
  );
};

export default NigeriaStateSelect;

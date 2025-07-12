import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const DateAvailabilityPicker = ({ availability, onChange }) => {
  const [selected, setSelected] = useState([]);

  const handleSelect = (dates) => {
    setSelected(dates);
    const formatted = dates.map(date => date.toISOString().split('T')[0]);
    onChange(formatted);
  };

  return (
    <div>
      <label className="block font-semibold mb-2">Доступные даты:</label>
      <DayPicker
        mode="multiple"
        selected={selected}
        onSelect={handleSelect}
        numberOfMonths={2}
        modifiersClassNames={{
          selected: 'bg-primary text-white',
        }}
        className="rounded-xl border p-4 bg-white"
      />
    </div>
  );
};

export default DateAvailabilityPicker;

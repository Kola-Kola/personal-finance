import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface MonthSelectorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

export default function MonthSelector({ currentDate, onDateChange }: MonthSelectorProps) {
  const monthOptions = Array.from({ length: 25 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - 12 + i);
    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    };
  });

  const handleMonthChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const [year, month] = event.target.value.split('-').map(Number);
    onDateChange(new Date(year, month - 1));
  };

  const previousMonth = () => {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  return (
    <div className="flex items-center gap-4">
      <button
        onClick={previousMonth}
        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      
      <select
        value={`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`}
        onChange={handleMonthChange}
        className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
      >
        {monthOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <button
        onClick={nextMonth}
        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
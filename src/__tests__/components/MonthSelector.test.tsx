import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MonthSelector from '../../components/shared/MonthSelector';

describe('MonthSelector', () => {
  const mockOnDateChange = vi.fn();
  const currentDate = new Date(2024, 2, 15); // March 15, 2024

  beforeEach(() => {
    mockOnDateChange.mockClear();
  });

  it('renders current month and year', () => {
    render(
      <MonthSelector
        currentDate={currentDate}
        onDateChange={mockOnDateChange}
      />
    );

    expect(screen.getByText(/mars 2024/i)).toBeInTheDocument();
  });

  it('handles previous month navigation', () => {
    render(
      <MonthSelector
        currentDate={currentDate}
        onDateChange={mockOnDateChange}
      />
    );

    const prevButton = screen.getByLabelText(/mois précédent/i);
    fireEvent.click(prevButton);

    expect(mockOnDateChange).toHaveBeenCalledWith(new Date(2024, 1, 15)); // February
  });

  it('handles next month navigation', () => {
    render(
      <MonthSelector
        currentDate={currentDate}
        onDateChange={mockOnDateChange}
      />
    );

    const nextButton = screen.getByLabelText(/mois suivant/i);
    fireEvent.click(nextButton);

    expect(mockOnDateChange).toHaveBeenCalledWith(new Date(2024, 3, 15)); // April
  });

  it('handles month selection from dropdown', () => {
    render(
      <MonthSelector
        currentDate={currentDate}
        onDateChange={mockOnDateChange}
      />
    );

    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: '2024-01' } });

    expect(mockOnDateChange).toHaveBeenCalledWith(new Date(2024, 0, 1)); // January
  });
});
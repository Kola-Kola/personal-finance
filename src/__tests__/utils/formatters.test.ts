import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate } from '../../utils/formatters';

describe('formatCurrency', () => {
  it('formats currency correctly', () => {
    expect(formatCurrency(1234)).toBe('1 234 €');
    expect(formatCurrency(1234.56)).toBe('1 235 €');
    expect(formatCurrency(0)).toBe('0 €');
    expect(formatCurrency(-1234)).toBe('-1 234 €');
  });

  it('handles undefined and NaN', () => {
    expect(formatCurrency(NaN)).toBe('0 €');
    // @ts-ignore - Testing invalid input
    expect(formatCurrency(undefined)).toBe('0 €');
    expect(formatCurrency(0)).toBe('0 €');
  });
});

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date(2024, 2, 15); // March 15, 2024
    expect(formatDate(date)).toBe('mars 2024');
  });

  it('handles custom format options', () => {
    const date = new Date(2024, 2, 15);
    expect(formatDate(date, { 
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })).toBe('15 mars 2024');
  });
});
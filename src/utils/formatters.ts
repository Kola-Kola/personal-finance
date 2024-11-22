import { CURRENCY_FORMAT_OPTIONS, DATE_FORMAT_OPTIONS } from '../constants';

export const formatCurrency = (amount: number): string => {
  if (amount === undefined || isNaN(amount)) {
    amount = 0;
  }
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
    useGrouping: true
  }).format(amount);
};

export const formatDate = (date: Date, options: Intl.DateTimeFormatOptions = DATE_FORMAT_OPTIONS): string => {
  return date.toLocaleDateString('fr-FR', options);
};

export const getMonthOptions = (length: number = 25) => {
  return Array.from({ length }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - 12 + i);
    return {
      value: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`,
      label: formatDate(date)
    };
  });
};
// Currency formatting options
export const CURRENCY_FORMAT_OPTIONS = {
  style: 'currency',
  currency: 'EUR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0
} as const;

// Date formatting options
export const DATE_FORMAT_OPTIONS = {
  month: 'long',
  year: 'numeric'
} as const;

// Category colors
export const CATEGORY_COLORS = {
  revenu: '#10B981',    // emerald-500
  factures: '#3B82F6',  // blue-500
  impots: '#EF4444',    // red-500
  loisirs: '#8B5CF6',   // purple-500
  transport: '#0EA5E9', // sky-500
  essence: '#F97316',   // orange-500
  credit: '#6366F1',    // indigo-500
  assurance: '#14B8A6'  // teal-500
} as const;

// Chart colors
export const CHART_COLORS = {
  revenus: '#10B981',      // emerald-500
  ponctuel: '#3B82F6',     // blue-500
  recurrent: '#8B5CF6'     // purple-500
} as const;

// CSS color classes
export const CSS_COLORS = {
  revenu: {
    text: 'text-emerald-500',
    bg: 'bg-emerald-500',
    border: 'border-l-emerald-500',
    hover: 'hover:bg-emerald-50'
  },
  expense: {
    text: 'text-red-500',
    bg: 'bg-red-500',
    border: 'border-l-red-500',
    hover: 'hover:bg-red-50'
  },
  neutral: {
    text: 'text-blue-500',
    bg: 'bg-blue-500',
    border: 'border-l-blue-500',
    hover: 'hover:bg-blue-50'
  }
} as const;

// Common text
export const TEXT = {
  noTransactions: 'Aucune transaction pour cette période',
  loading: 'Chargement...',
  error: 'Une erreur est survenue. Actualisation en cours...'
} as const;

// Chart dimensions
export const CHART_DIMENSIONS = {
  pieChart: {
    height: 400,
    outerRadius: 150
  },
  legend: {
    height: 36
  }
} as const;

// Time constants
export const TIME = {
  monthsToShow: 6,
  monthOptionsLength: 25,
  maxDayOfMonth: 28,
  monthsLookback: 12
} as const;
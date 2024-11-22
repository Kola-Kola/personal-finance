import React from 'react';
import { Transaction } from '../types';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { db } from '../db/instance';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface MonthlyOverviewProps {
  transactions: Transaction[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const COLORS = {
  revenus: '#10B981',      // emerald-500
  ponctuel: '#3B82F6',     // blue-500
  recurrent: '#8B5CF6'     // purple-500
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-100">
        <p className="font-semibold text-gray-800">{payload[0].name}</p>
        <p className="text-lg font-bold text-blue-600">
          {payload[0].value.toLocaleString('fr-FR', {
            style: 'currency',
            currency: 'EUR'
          })}
        </p>
      </div>
    );
  }
  return null;
};

export default function MonthlyOverview({ transactions, currentDate, onDateChange }: MonthlyOverviewProps) {
  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const previousMonth = () => {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  // Calcul des revenus pour le mois sélectionné
  const revenus = transactions
    .filter(t => {
      if (t.isRecurrent && t.categorie === 'revenu') {
        return true;
      }
      if (!t.isRecurrent && t.categorie === 'revenu') {
        const date = new Date(t.date);
        return date.getMonth() === currentDate.getMonth() &&
               date.getFullYear() === currentDate.getFullYear();
      }
      return false;
    })
    .reduce((sum, t) => {
      if (t.isRecurrent) {
        return sum + db.getMontantForDate(t, currentDate);
      }
      return sum + (isNaN(t.montant) ? 0 : t.montant);
    }, 0);

  // Calcul des dépenses ponctuelles
  const depensesPonctuelles = transactions
    .filter(t => {
      if (t.isRecurrent) return false;
      if (t.categorie === 'revenu') return false;
      const date = new Date(t.date);
      return date.getMonth() === currentDate.getMonth() &&
             date.getFullYear() === currentDate.getFullYear();
    })
    .reduce((sum, t) => sum + (isNaN(t.montant) ? 0 : t.montant), 0);

  // Calcul des dépenses récurrentes
  const depensesRecurrentes = transactions
    .filter(t => t.isRecurrent && t.categorie !== 'revenu')
    .reduce((sum, t) => sum + db.getMontantForDate(t, currentDate), 0);

  const data = [
    { name: 'Revenus', value: revenus, color: COLORS.revenus },
    { name: 'Dépenses ponctuelles', value: depensesPonctuelles, color: COLORS.ponctuel },
    { name: 'Dépenses récurrentes', value: depensesRecurrentes, color: COLORS.recurrent }
  ];

  // Générer les options pour les 12 derniers mois et les 12 prochains mois
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Calendar className="w-6 h-6 text-blue-600" />
          Aperçu Mensuel
        </h2>
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
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={120}
              label={({ name, value }) => 
                `${name} (${value.toLocaleString('fr-FR', {
                  style: 'currency',
                  currency: 'EUR'
                })})`
              }
              labelLine={true}
            >
              {data.map((entry, index) => (
                <Cell 
                  key={index} 
                  fill={entry.color}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value) => <span className="text-sm font-medium">{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
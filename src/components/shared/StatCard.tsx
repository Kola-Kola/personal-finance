import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  amount: number;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export default function StatCard({ title, amount, icon: Icon, color, bgColor }: StatCardProps) {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${color} transition-transform duration-200 hover:scale-105`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className={`text-2xl font-semibold mt-1 ${color.replace('border-l', 'text')}`}>
            {(amount || 0).toLocaleString('fr-FR', {
              style: 'currency',
              currency: 'EUR'
            })}
          </p>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}
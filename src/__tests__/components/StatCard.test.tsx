import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import StatCard from '../../components/shared/StatCard';
import { Euro } from 'lucide-react';

describe('StatCard', () => {
  it('renders correctly with all props', () => {
    render(
      <StatCard
        title="Test Title"
        amount={1234}
        icon={Euro}
        color="border-l-blue-500"
        bgColor="bg-blue-500"
      />
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
    expect(screen.getByText('1 234 €')).toBeInTheDocument();
  });

  it('handles zero amount', () => {
    render(
      <StatCard
        title="Zero Amount"
        amount={0}
        icon={Euro}
        color="border-l-blue-500"
        bgColor="bg-blue-500"
      />
    );

    expect(screen.getByText('0 €')).toBeInTheDocument();
  });

  it('handles negative amount', () => {
    render(
      <StatCard
        title="Negative Amount"
        amount={-1234}
        icon={Euro}
        color="border-l-red-500"
        bgColor="bg-red-500"
      />
    );

    expect(screen.getByText('-1 234 €')).toBeInTheDocument();
  });
});
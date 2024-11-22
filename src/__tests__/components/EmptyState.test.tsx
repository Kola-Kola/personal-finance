import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import EmptyState from '../../components/shared/EmptyState';

describe('EmptyState', () => {
  it('renders message correctly', () => {
    const message = 'No data available';
    render(<EmptyState message={message} />);
    expect(screen.getByText(message)).toBeInTheDocument();
  });

  it('renders with icon', () => {
    render(<EmptyState message="Test message" />);
    // Check if the container with the icon class exists
    const iconContainer = screen.getByTestId('empty-state-icon');
    expect(iconContainer).toBeInTheDocument();
  });
});
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state correctly', () => {
    render(<Button loading>Loading...</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
    // Check for loading spinner
    expect(document.querySelector('[data-testid="loading-spinner"]')).toBeTruthy();
  });

  it('applies correct variant styles', () => {
    const { rerender } = render(<Button variant="primary">Primary</Button>);
    expect(screen.getByRole('button')).toHaveStyle({ backgroundColor: '#3182ce' });

    rerender(<Button variant="danger">Danger</Button>);
    expect(screen.getByRole('button')).toHaveStyle({ backgroundColor: '#e53e3e' });
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('applies correct size styles', () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole('button')).toHaveStyle({ padding: '6px 12px' });

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole('button')).toHaveStyle({ padding: '12px 24px' });
  });
});
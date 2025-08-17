import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App', () => {
  it('renders welcome message', () => {
    render(<App />);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it('renders hello world message', () => {
    render(<App />);
    expect(screen.getByText(/hello world/i)).toBeInTheDocument();
  });
});
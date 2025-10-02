import { render, screen } from '@testing-library/react';
import HeroSearch from '@/components/hero/HeroSearch';

describe('HeroSearch', () => {
  it('renders headline and filters', () => {
    render(<HeroSearch />);
    expect(screen.getByText(/Plan your Moroccan/i)).toBeInTheDocument();
    expect(screen.getByText(/Explore vendors/i)).toBeInTheDocument();
  });
});

import { render, screen } from '@testing-library/react';
import App from '@/App';

describe('App.tsx', () => {
  it('renders hello world', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Vite + React'
    );
  });
});

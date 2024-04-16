import { render, screen } from '@testing-library/react';
import { HashRouter, MemoryRouter } from 'react-router-dom';
import App from '@/App';

describe('App.tsx', () => {
  it('renders hello world', () => {
    render(
      <HashRouter>
        <App />
      </HashRouter>
    );

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Hello World'
    );
  });

  it('renders not found if invalid path', () => {
    render(
      <MemoryRouter initialEntries={['/bananas']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Not Found'
    );
  });
});

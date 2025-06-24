import { render, screen } from '@testing-library/react';
import App from './App';

test('renders app without crashing', () => {
  render(<App />);
  // Test basique pour vérifier que l'app se charge
  expect(document.body).toBeInTheDocument();
});

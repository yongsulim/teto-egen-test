
import { render, screen } from '@testing-library/react';
import Start from './Start';

test('renders the start screen correctly', () => {
  render(<Start />);
  
  // Check for the main title
  const titleElement = screen.getByText(/나는 테토형일까, 에겐형일까?/i);
  expect(titleElement).toBeInTheDocument();

  // Check for the start button
  const buttonElement = screen.getByRole('button', { name: /시작하기/i });
  expect(buttonElement).toBeInTheDocument();
});

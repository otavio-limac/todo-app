import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from './Home'
import { vi } from 'vitest'

// Mock do Modal (se necessário)
vi.mock('@/components/Modal.tsx', () => {
  return {
    default: ({ open }: { open: boolean }) => (
      <div data-testid="modal">{open ? 'Modal open' : 'Modal closed'}</div>
    ),
  }
})

describe('Home page', () => {
  it('renders the title and description', () => {
    render(<Home />)
    expect(screen.getByText('My tasks')).toBeInTheDocument()
    expect(screen.getByText(/Get started/)).toBeInTheDocument()
  })

  it('renders the Add task button', () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /Add task/i })
    expect(button).toBeInTheDocument()
  })

  it('opens modal when clicking Add task', async () => {
    render(<Home />)
    const button = screen.getByRole('button', { name: /Add task/i })
    await userEvent.click(button)
    expect(screen.getByTestId('modal')).toHaveTextContent('Modal open')
  })
})

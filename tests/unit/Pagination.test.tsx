import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@solidjs/testing-library';
import { Pagination } from '../../src/components/navigation/Pagination';

describe('Pagination', () => {
  it('renders with page numbers', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination page={1} totalPages={5} onPageChange={handlePageChange} />
    ));

    // Should show pages 1-5
    expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 4')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 5')).toBeInTheDocument();
  });

  it('marks current page as active', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination page={3} totalPages={5} onPageChange={handlePageChange} />
    ));

    const page3Button = screen.getByLabelText('Go to page 3');
    expect(page3Button).toHaveClass('pagination__button--active');
    expect(page3Button).toHaveAttribute('aria-current', 'page');
  });

  it('calls onPageChange when page button is clicked', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination page={1} totalPages={5} onPageChange={handlePageChange} />
    ));

    const page3Button = screen.getByLabelText('Go to page 3');
    fireEvent.click(page3Button);

    expect(handlePageChange).toHaveBeenCalledTimes(1);
    expect(handlePageChange).toHaveBeenCalledWith(3);
  });

  it('shows ellipsis for large page ranges', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination page={5} totalPages={10} onPageChange={handlePageChange} />
    ));

    // Should show: 1 ... 4 5 6 ... 10
    expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 4')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 5')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 6')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 10')).toBeInTheDocument();

    // Check for ellipsis
    const ellipses = screen.getAllByText('…');
    expect(ellipses).toHaveLength(2);
  });

  it('shows first and last page buttons by default', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination page={5} totalPages={10} onPageChange={handlePageChange} />
    ));

    expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();
  });

  it('hides first and last buttons when showFirstLast is false', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination
        page={5}
        totalPages={10}
        onPageChange={handlePageChange}
        showFirstLast={false}
      />
    ));

    expect(screen.queryByLabelText('Go to first page')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Go to last page')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Go to previous page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to next page')).toBeInTheDocument();
  });

  it('navigates to previous page', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination page={3} totalPages={5} onPageChange={handlePageChange} />
    ));

    const prevButton = screen.getByLabelText('Go to previous page');
    fireEvent.click(prevButton);

    expect(handlePageChange).toHaveBeenCalledWith(2);
  });

  it('navigates to next page', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination page={3} totalPages={5} onPageChange={handlePageChange} />
    ));

    const nextButton = screen.getByLabelText('Go to next page');
    fireEvent.click(nextButton);

    expect(handlePageChange).toHaveBeenCalledWith(4);
  });

  it('navigates to first page', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination page={5} totalPages={10} onPageChange={handlePageChange} />
    ));

    const firstButton = screen.getByLabelText('Go to first page');
    fireEvent.click(firstButton);

    expect(handlePageChange).toHaveBeenCalledWith(1);
  });

  it('navigates to last page', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination page={5} totalPages={10} onPageChange={handlePageChange} />
    ));

    const lastButton = screen.getByLabelText('Go to last page');
    fireEvent.click(lastButton);

    expect(handlePageChange).toHaveBeenCalledWith(10);
  });

  it('disables prev and first buttons on first page', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination page={1} totalPages={5} onPageChange={handlePageChange} />
    ));

    const prevButton = screen.getByLabelText('Go to previous page');
    const firstButton = screen.getByLabelText('Go to first page');

    expect(prevButton).toBeDisabled();
    expect(firstButton).toBeDisabled();
  });

  it('disables next and last buttons on last page', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination page={5} totalPages={5} onPageChange={handlePageChange} />
    ));

    const nextButton = screen.getByLabelText('Go to next page');
    const lastButton = screen.getByLabelText('Go to last page');

    expect(nextButton).toBeDisabled();
    expect(lastButton).toBeDisabled();
  });

  it('disables all buttons when disabled prop is true', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination
        page={3}
        totalPages={5}
        onPageChange={handlePageChange}
        disabled={true}
      />
    ));

    const allButtons = screen.getAllByRole('button');
    allButtons.forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  it('does not call onPageChange when disabled', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination
        page={3}
        totalPages={5}
        onPageChange={handlePageChange}
        disabled={true}
      />
    ));

    const page4Button = screen.getByLabelText('Go to page 4');
    fireEvent.click(page4Button);

    expect(handlePageChange).not.toHaveBeenCalled();
  });

  it('applies variant classes', () => {
    const handlePageChange = vi.fn();

    const { unmount } = render(() => (
      <Pagination
        page={1}
        totalPages={5}
        onPageChange={handlePageChange}
        variant="primary"
      />
    ));

    expect(document.querySelector('.pagination--primary')).toBeInTheDocument();

    unmount();

    render(() => (
      <Pagination
        page={1}
        totalPages={5}
        onPageChange={handlePageChange}
        variant="subtle"
      />
    ));

    expect(document.querySelector('.pagination--subtle')).toBeInTheDocument();
  });

  it('applies size classes', () => {
    const handlePageChange = vi.fn();

    const { unmount } = render(() => (
      <Pagination
        page={1}
        totalPages={5}
        onPageChange={handlePageChange}
        size="compact"
      />
    ));

    expect(document.querySelector('.pagination--compact')).toBeInTheDocument();

    unmount();

    render(() => (
      <Pagination
        page={1}
        totalPages={5}
        onPageChange={handlePageChange}
        size="normal"
      />
    ));

    expect(document.querySelector('.pagination')).toBeInTheDocument();
    expect(document.querySelector('.pagination--compact')).not.toBeInTheDocument();
  });

  it('applies custom class name', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination
        page={1}
        totalPages={5}
        onPageChange={handlePageChange}
        class="custom-pagination"
      />
    ));

    expect(document.querySelector('.custom-pagination')).toBeInTheDocument();
  });

  it('handles custom siblingCount', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination
        page={5}
        totalPages={10}
        onPageChange={handlePageChange}
        siblingCount={2}
      />
    ));

    // With siblingCount=2, should show: 1 ... 3 4 5 6 7 ... 10
    expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 3')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 4')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 5')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 6')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 7')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 10')).toBeInTheDocument();
  });

  it('shows all pages when totalPages is 7 or less', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination page={4} totalPages={7} onPageChange={handlePageChange} />
    ));

    // Should show all pages 1-7 with no ellipsis
    for (let i = 1; i <= 7; i++) {
      expect(screen.getByLabelText(`Go to page ${i}`)).toBeInTheDocument();
    }

    expect(screen.queryByText('…')).not.toBeInTheDocument();
  });

  it('does not call onPageChange when clicking current page', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination page={3} totalPages={5} onPageChange={handlePageChange} />
    ));

    const page3Button = screen.getByLabelText('Go to page 3');
    fireEvent.click(page3Button);

    expect(handlePageChange).not.toHaveBeenCalled();
  });

  it('hides prev/next buttons when showPrevNext is false', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination
        page={5}
        totalPages={10}
        onPageChange={handlePageChange}
        showPrevNext={false}
      />
    ));

    expect(screen.queryByLabelText('Go to previous page')).not.toBeInTheDocument();
    expect(screen.queryByLabelText('Go to next page')).not.toBeInTheDocument();

    // First and last should still be visible
    expect(screen.getByLabelText('Go to first page')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to last page')).toBeInTheDocument();
  });

  it('applies spacious size class', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination
        page={1}
        totalPages={5}
        onPageChange={handlePageChange}
        size="spacious"
      />
    ));

    expect(document.querySelector('.pagination--spacious')).toBeInTheDocument();
  });

  it('fixes duplicate page bug when on page 3', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination page={3} totalPages={10} onPageChange={handlePageChange} />
    ));

    // Should have exactly one "Go to page 2" button
    const page2Buttons = screen.getAllByLabelText('Go to page 2');
    expect(page2Buttons).toHaveLength(1);
  });

  it('fixes duplicate page bug when on 3rd-to-last page', () => {
    const handlePageChange = vi.fn();

    render(() => (
      <Pagination page={8} totalPages={10} onPageChange={handlePageChange} />
    ));

    // Should have exactly one "Go to page 9" button
    const page9Buttons = screen.getAllByLabelText('Go to page 9');
    expect(page9Buttons).toHaveLength(1);
  });
});

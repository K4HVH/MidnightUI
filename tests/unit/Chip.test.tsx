import { render, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { Chip } from '../../src/components/display/Chip';
import { BsTag } from 'solid-icons/bs';

describe('Chip', () => {
  it('renders with children text', () => {
    const { getByText } = render(() => <Chip>Test Label</Chip>);
    expect(getByText('Test Label')).toBeInTheDocument();
  });

  it('applies neutral variant by default', () => {
    const { container } = render(() => <Chip>Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).toHaveClass('chip--neutral');
  });

  it('applies primary variant', () => {
    const { container } = render(() => <Chip variant="primary">Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).toHaveClass('chip--primary');
  });

  it('applies success variant', () => {
    const { container } = render(() => <Chip variant="success">Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).toHaveClass('chip--success');
  });

  it('applies warning variant', () => {
    const { container } = render(() => <Chip variant="warning">Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).toHaveClass('chip--warning');
  });

  it('applies error variant', () => {
    const { container } = render(() => <Chip variant="error">Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).toHaveClass('chip--error');
  });

  it('applies info variant', () => {
    const { container } = render(() => <Chip variant="info">Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).toHaveClass('chip--info');
  });

  it('applies normal size by default', () => {
    const { container } = render(() => <Chip>Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).not.toHaveClass('chip--compact');
    expect(chip).not.toHaveClass('chip--spacious');
  });

  it('applies compact size', () => {
    const { container } = render(() => <Chip size="compact">Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).toHaveClass('chip--compact');
  });

  it('applies spacious size', () => {
    const { container } = render(() => <Chip size="spacious">Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).toHaveClass('chip--spacious');
  });

  it('renders with icon', () => {
    const { container } = render(() => <Chip icon={BsTag}>Label</Chip>);
    const icon = container.querySelector('.chip__icon');
    expect(icon).toBeInTheDocument();
  });

  it('does not render remove button when no onRemove provided', () => {
    const { container } = render(() => <Chip>Label</Chip>);
    const removeButton = container.querySelector('.chip__remove');
    expect(removeButton).not.toBeInTheDocument();
  });

  it('renders remove button when onRemove provided', () => {
    const handleRemove = vi.fn();
    const { container } = render(() => <Chip onRemove={handleRemove}>Label</Chip>);
    const removeButton = container.querySelector('.chip__remove');
    expect(removeButton).toBeInTheDocument();
  });

  it('calls onRemove when remove button clicked', () => {
    const handleRemove = vi.fn();
    const { container } = render(() => <Chip onRemove={handleRemove}>Label</Chip>);
    const removeButton = container.querySelector('.chip__remove') as HTMLButtonElement;
    fireEvent.click(removeButton);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('does not call onRemove when disabled', () => {
    const handleRemove = vi.fn();
    const { container } = render(() => (
      <Chip onRemove={handleRemove} disabled>
        Label
      </Chip>
    ));
    const removeButton = container.querySelector('.chip__remove') as HTMLButtonElement;
    fireEvent.click(removeButton);
    expect(handleRemove).not.toHaveBeenCalled();
  });

  it('applies clickable class when onClick provided', () => {
    const handleClick = vi.fn();
    const { container } = render(() => <Chip onClick={handleClick}>Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).toHaveClass('chip--clickable');
  });

  it('does not apply clickable class when no onClick', () => {
    const { container } = render(() => <Chip>Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).not.toHaveClass('chip--clickable');
  });

  it('calls onClick when chip clicked', () => {
    const handleClick = vi.fn();
    const { container } = render(() => <Chip onClick={handleClick}>Label</Chip>);
    const chip = container.querySelector('.chip') as HTMLElement;
    fireEvent.click(chip);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', () => {
    const handleClick = vi.fn();
    const { container } = render(() => (
      <Chip onClick={handleClick} disabled>
        Label
      </Chip>
    ));
    const chip = container.querySelector('.chip') as HTMLElement;
    fireEvent.click(chip);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('handles Enter key for clickable chip', () => {
    const handleClick = vi.fn();
    const { container } = render(() => <Chip onClick={handleClick}>Label</Chip>);
    const chip = container.querySelector('.chip') as HTMLElement;
    fireEvent.keyDown(chip, { key: 'Enter' });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles Space key for clickable chip', () => {
    const handleClick = vi.fn();
    const { container } = render(() => <Chip onClick={handleClick}>Label</Chip>);
    const chip = container.querySelector('.chip') as HTMLElement;
    fireEvent.keyDown(chip, { key: ' ' });
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('handles Backspace key for removable chip', () => {
    const handleRemove = vi.fn();
    const { container } = render(() => <Chip onRemove={handleRemove}>Label</Chip>);
    const chip = container.querySelector('.chip') as HTMLElement;
    fireEvent.keyDown(chip, { key: 'Backspace' });
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('handles Delete key for removable chip', () => {
    const handleRemove = vi.fn();
    const { container } = render(() => <Chip onRemove={handleRemove}>Label</Chip>);
    const chip = container.querySelector('.chip') as HTMLElement;
    fireEvent.keyDown(chip, { key: 'Delete' });
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  it('applies disabled class when disabled', () => {
    const { container } = render(() => <Chip disabled>Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).toHaveClass('chip--disabled');
  });

  it('sets aria-disabled when disabled', () => {
    const handleClick = vi.fn();
    const { container } = render(() => (
      <Chip onClick={handleClick} disabled>
        Label
      </Chip>
    ));
    const chip = container.querySelector('.chip');
    expect(chip).toHaveAttribute('aria-disabled', 'true');
  });

  it('sets role="button" when clickable', () => {
    const handleClick = vi.fn();
    const { container } = render(() => <Chip onClick={handleClick}>Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).toHaveAttribute('role', 'button');
  });

  it('does not set role when not clickable', () => {
    const { container } = render(() => <Chip>Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).not.toHaveAttribute('role');
  });

  it('is focusable when clickable', () => {
    const handleClick = vi.fn();
    const { container } = render(() => <Chip onClick={handleClick}>Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).toHaveAttribute('tabIndex', '0');
  });

  it('is focusable when removable', () => {
    const handleRemove = vi.fn();
    const { container } = render(() => <Chip onRemove={handleRemove}>Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).toHaveAttribute('tabIndex', '0');
  });

  it('is not focusable when disabled and clickable', () => {
    const handleClick = vi.fn();
    const { container } = render(() => (
      <Chip onClick={handleClick} disabled>
        Label
      </Chip>
    ));
    const chip = container.querySelector('.chip');
    expect(chip).toHaveAttribute('tabIndex', '-1');
  });

  it('is not focusable when static (no onClick or onRemove)', () => {
    const { container } = render(() => <Chip>Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).not.toHaveAttribute('tabIndex');
  });

  it('applies custom class', () => {
    const { container } = render(() => <Chip class="custom-chip">Label</Chip>);
    const chip = container.querySelector('.chip');
    expect(chip).toHaveClass('custom-chip');
  });

  it('supports both onClick and onRemove', () => {
    const handleClick = vi.fn();
    const handleRemove = vi.fn();
    const { container } = render(() => (
      <Chip onClick={handleClick} onRemove={handleRemove}>
        Label
      </Chip>
    ));

    const chip = container.querySelector('.chip') as HTMLElement;
    const removeButton = container.querySelector('.chip__remove') as HTMLButtonElement;

    // Click chip
    fireEvent.click(chip);
    expect(handleClick).toHaveBeenCalledTimes(1);
    expect(handleRemove).not.toHaveBeenCalled();

    // Click remove button
    fireEvent.click(removeButton);
    expect(handleRemove).toHaveBeenCalledTimes(1);
    // Click count should not increase (event stopped propagation)
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('stops propagation when remove button clicked', () => {
    const handleClick = vi.fn();
    const handleRemove = vi.fn();
    const { container } = render(() => (
      <Chip onClick={handleClick} onRemove={handleRemove}>
        Label
      </Chip>
    ));

    const removeButton = container.querySelector('.chip__remove') as HTMLButtonElement;
    fireEvent.click(removeButton);

    expect(handleRemove).toHaveBeenCalledTimes(1);
    expect(handleClick).not.toHaveBeenCalled();
  });
});

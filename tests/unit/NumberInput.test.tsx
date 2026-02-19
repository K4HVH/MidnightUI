import { render, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { createSignal } from 'solid-js';
import { NumberInput } from '../../src/components/inputs/NumberInput';

describe('NumberInput', () => {
  it('renders with a value', () => {
    const { container } = render(() => <NumberInput value={42} />);
    const input = container.querySelector('.number-input__input') as HTMLInputElement;
    expect(input.value).toBe('42');
  });

  it('renders with a label', () => {
    const { getByText } = render(() => <NumberInput label="Quantity" />);
    expect(getByText('Quantity')).toBeInTheDocument();
  });

  it('renders with placeholder', () => {
    const { container } = render(() => <NumberInput placeholder="0" />);
    const input = container.querySelector('.number-input__input') as HTMLInputElement;
    expect(input.placeholder).toBe('0');
  });

  it('renders decrement and increment buttons', () => {
    const { container } = render(() => <NumberInput value={5} />);
    expect(container.querySelector('.number-input__stepper--decrement')).toBeInTheDocument();
    expect(container.querySelector('.number-input__stepper--increment')).toBeInTheDocument();
  });

  it('calls onChange with incremented value when + button is clicked', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <NumberInput value={5} onChange={handleChange} />);
    const increment = container.querySelector('.number-input__stepper--increment') as HTMLButtonElement;
    fireEvent.pointerDown(increment);
    expect(handleChange).toHaveBeenCalledWith(6);
  });

  it('calls onChange with decremented value when − button is clicked', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <NumberInput value={5} onChange={handleChange} />);
    const decrement = container.querySelector('.number-input__stepper--decrement') as HTMLButtonElement;
    fireEvent.pointerDown(decrement);
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it('respects custom step', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <NumberInput value={10} step={5} onChange={handleChange} />);
    const increment = container.querySelector('.number-input__stepper--increment') as HTMLButtonElement;
    fireEvent.pointerDown(increment);
    expect(handleChange).toHaveBeenCalledWith(15);
  });

  it('clamps to min on blur', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <NumberInput value={5} min={0} max={10} onChange={handleChange} />);
    const input = container.querySelector('.number-input__input') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: '-5' } });
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenCalledWith(0);
  });

  it('clamps to max on blur', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <NumberInput value={5} min={0} max={10} onChange={handleChange} />);
    const input = container.querySelector('.number-input__input') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: '99' } });
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenCalledWith(10);
  });

  it('calls onChange with undefined when input is cleared on blur', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <NumberInput value={5} onChange={handleChange} />);
    const input = container.querySelector('.number-input__input') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: '' } });
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenCalledWith(undefined);
  });

  it('resets display on blur when invalid text is typed', () => {
    const { container } = render(() => <NumberInput value={42} />);
    const input = container.querySelector('.number-input__input') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: 'abc' } });
    fireEvent.blur(input);
    expect(input.value).toBe('42');
  });

  it('applies precision rounding', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <NumberInput value={1.005} precision={2} step={0.01} onChange={handleChange} />
    ));
    const input = container.querySelector('.number-input__input') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: '1.555' } });
    fireEvent.blur(input);
    expect(handleChange).toHaveBeenCalledWith(1.56);
  });

  it('disables decrement button at min value', () => {
    const { container } = render(() => <NumberInput value={0} min={0} max={10} />);
    const decrement = container.querySelector('.number-input__stepper--decrement') as HTMLButtonElement;
    expect(decrement.disabled).toBe(true);
  });

  it('disables increment button at max value', () => {
    const { container } = render(() => <NumberInput value={10} min={0} max={10} />);
    const increment = container.querySelector('.number-input__stepper--increment') as HTMLButtonElement;
    expect(increment.disabled).toBe(true);
  });

  it('does not disable stepper buttons when no min/max set', () => {
    const { container } = render(() => <NumberInput value={42} />);
    const decrement = container.querySelector('.number-input__stepper--decrement') as HTMLButtonElement;
    const increment = container.querySelector('.number-input__stepper--increment') as HTMLButtonElement;
    expect(decrement.disabled).toBe(false);
    expect(increment.disabled).toBe(false);
  });

  it('is disabled when disabled prop is true', () => {
    const { container } = render(() => <NumberInput value={5} disabled />);
    const input = container.querySelector('.number-input__input') as HTMLInputElement;
    const decrement = container.querySelector('.number-input__stepper--decrement') as HTMLButtonElement;
    const increment = container.querySelector('.number-input__stepper--increment') as HTMLButtonElement;
    expect(input.disabled).toBe(true);
    expect(decrement.disabled).toBe(true);
    expect(increment.disabled).toBe(true);
    expect(container.querySelector('.number-input--disabled')).toBeInTheDocument();
  });

  it('applies compact size class', () => {
    const { container } = render(() => <NumberInput size="compact" />);
    expect(container.querySelector('.number-input--compact')).toBeInTheDocument();
  });

  it('applies invalid class when invalid prop is true', () => {
    const { container } = render(() => <NumberInput invalid />);
    expect(container.querySelector('.number-input--invalid')).toBeInTheDocument();
  });

  it('applies invalid class when error prop is set', () => {
    const { container } = render(() => <NumberInput error="Value is required" />);
    expect(container.querySelector('.number-input--invalid')).toBeInTheDocument();
  });

  it('renders prefix', () => {
    const { container } = render(() => <NumberInput prefix="$" />);
    const prefix = container.querySelector('.number-input__prefix');
    expect(prefix).toBeInTheDocument();
    expect(prefix?.textContent).toBe('$');
  });

  it('renders suffix', () => {
    const { container } = render(() => <NumberInput suffix="kg" />);
    const suffix = container.querySelector('.number-input__suffix');
    expect(suffix).toBeInTheDocument();
    expect(suffix?.textContent).toBe('kg');
  });

  it('applies custom class', () => {
    const { container } = render(() => <NumberInput class="my-custom" />);
    expect(container.querySelector('.my-custom')).toBeInTheDocument();
  });

  it('links label to input with id', () => {
    const { container } = render(() => <NumberInput label="Amount" id="amount" />);
    const label = container.querySelector('label') as HTMLLabelElement;
    const input = container.querySelector('.number-input__input') as HTMLInputElement;
    expect(label.htmlFor).toBe('amount');
    expect(input.id).toBe('amount');
  });

  it('links label to input with name when no id', () => {
    const { container } = render(() => <NumberInput label="Quantity" name="qty" />);
    const label = container.querySelector('label') as HTMLLabelElement;
    const input = container.querySelector('.number-input__input') as HTMLInputElement;
    expect(label.htmlFor).toBe('qty');
    expect(input.id).toBe('qty');
  });

  it('increments value with ArrowUp key', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <NumberInput value={5} onChange={handleChange} />);
    const input = container.querySelector('.number-input__input') as HTMLInputElement;
    fireEvent.keyDown(input, { key: 'ArrowUp' });
    expect(handleChange).toHaveBeenCalledWith(6);
  });

  it('decrements value with ArrowDown key', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <NumberInput value={5} onChange={handleChange} />);
    const input = container.querySelector('.number-input__input') as HTMLInputElement;
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(handleChange).toHaveBeenCalledWith(4);
  });

  it('calls onBlur when input loses focus', () => {
    const handleBlur = vi.fn();
    const { container } = render(() => <NumberInput value={5} onBlur={handleBlur} />);
    const input = container.querySelector('.number-input__input') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.blur(input);
    expect(handleBlur).toHaveBeenCalledTimes(1);
  });

  it('updates display value when controlled value changes externally', () => {
    const TestComponent = () => {
      const [value, setValue] = createSignal(10);
      return (
        <div>
          <NumberInput value={value()} onChange={setValue} />
          <button onClick={() => setValue(99)}>Set 99</button>
        </div>
      );
    };

    const { container, getByText } = render(() => <TestComponent />);
    const input = container.querySelector('.number-input__input') as HTMLInputElement;

    expect(input.value).toBe('10');
    fireEvent.click(getByText('Set 99'));
    expect(input.value).toBe('99');
  });

  it('does not fire onChange when stepper is disabled', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <NumberInput value={0} min={0} onChange={handleChange} />
    ));
    const decrement = container.querySelector('.number-input__stepper--decrement') as HTMLButtonElement;
    fireEvent.pointerDown(decrement);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('has role spinbutton on input', () => {
    const { container } = render(() => <NumberInput value={5} />);
    const input = container.querySelector('.number-input__input');
    expect(input?.getAttribute('role')).toBe('spinbutton');
  });
});

import { Component, JSX, Show, splitProps, createSignal, createEffect, onCleanup } from 'solid-js';
import { BsDash, BsPlus } from 'solid-icons/bs';
import '../../styles/components/inputs/NumberInput.css';

interface NumberInputProps {
  value?: number;
  onChange?: (value: number | undefined) => void;
  onBlur?: () => void;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
  size?: 'normal' | 'compact';
  label?: string;
  error?: string;
  invalid?: boolean;
  placeholder?: string;
  prefix?: JSX.Element | string;
  suffix?: JSX.Element | string;
  class?: string;
  name?: string;
  id?: string;
  'aria-describedby'?: string;
  'aria-required'?: boolean;
  'aria-labelledby'?: string;
}

export const NumberInput: Component<NumberInputProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'value',
    'onChange',
    'onBlur',
    'min',
    'max',
    'step',
    'precision',
    'disabled',
    'size',
    'label',
    'error',
    'invalid',
    'placeholder',
    'prefix',
    'suffix',
    'class',
    'name',
    'id',
    'aria-describedby',
    'aria-required',
    'aria-labelledby',
  ]);

  const step = () => local.step ?? 1;
  const size = () => local.size ?? 'normal';

  const [isFocused, setIsFocused] = createSignal(false);
  const [inputValue, setInputValue] = createSignal(
    local.value !== undefined ? String(local.value) : ''
  );

  // Sync display when controlled value changes externally (only while not focused)
  createEffect(() => {
    const v = local.value;
    if (!isFocused()) {
      setInputValue(v !== undefined ? String(v) : '');
    }
  });

  const applyPrecision = (value: number): number => {
    if (local.precision !== undefined) {
      const factor = Math.pow(10, local.precision);
      return Math.round(value * factor) / factor;
    }
    return value;
  };

  const clamp = (value: number): number => {
    let result = value;
    if (local.min !== undefined) result = Math.max(local.min, result);
    if (local.max !== undefined) result = Math.min(local.max, result);
    return result;
  };

  const handleInput = (e: InputEvent) => {
    setInputValue((e.target as HTMLInputElement).value);
  };

  const handleFocus = () => {
    setIsFocused(true);
    setInputValue(local.value !== undefined ? String(local.value) : '');
  };

  const commitValue = (rawStr: string) => {
    const trimmed = rawStr.trim();
    if (trimmed === '' || trimmed === '-') {
      local.onChange?.(undefined);
      return;
    }
    const parsed = parseFloat(trimmed);
    if (isNaN(parsed)) {
      setInputValue(local.value !== undefined ? String(local.value) : '');
      return;
    }
    const result = clamp(applyPrecision(parsed));
    setInputValue(String(result));
    local.onChange?.(result);
  };

  const handleBlur = () => {
    commitValue(inputValue());
    setIsFocused(false);
    local.onBlur?.();
  };

  const applyStep = (direction: 1 | -1) => {
    const base = local.value ?? 0;
    const result = clamp(applyPrecision(base + direction * step()));
    local.onChange?.(result);
    setInputValue(String(result));
  };

  let repeatTimer: ReturnType<typeof setTimeout> | undefined;
  let repeatInterval: ReturnType<typeof setInterval> | undefined;

  const startRepeat = (direction: 1 | -1) => {
    applyStep(direction);
    repeatTimer = setTimeout(() => {
      repeatInterval = setInterval(() => applyStep(direction), 80);
    }, 400);
  };

  const stopRepeat = () => {
    clearTimeout(repeatTimer);
    clearInterval(repeatInterval);
    repeatTimer = undefined;
    repeatInterval = undefined;
  };

  onCleanup(stopRepeat);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      applyStep(1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      applyStep(-1);
    }
  };

  const canDecrement = () => {
    if (local.disabled) return false;
    if (local.min === undefined) return true;
    return (local.value ?? 0) > local.min;
  };

  const canIncrement = () => {
    if (local.disabled) return false;
    if (local.max === undefined) return true;
    return (local.value ?? 0) < local.max;
  };

  const inputId = () => local.id || local.name;

  const classNames = () => {
    const classes = ['number-input'];
    if (size() === 'compact') classes.push('number-input--compact');
    if (local.disabled) classes.push('number-input--disabled');
    if (local.invalid || local.error) classes.push('number-input--invalid');
    if (local.class) classes.push(local.class);
    return classes.join(' ');
  };

  return (
    <div class={classNames()} {...rest}>
      <Show when={local.label}>
        <label class="number-input__label" for={inputId()}>
          {local.label}
        </label>
      </Show>

      <div class="number-input__wrapper">
        <Show when={local.prefix}>
          <span class="number-input__prefix">{local.prefix}</span>
        </Show>

        <button
          type="button"
          class="number-input__stepper number-input__stepper--decrement"
          disabled={local.disabled || !canDecrement()}
          tabIndex={-1}
          aria-label="Decrease value"
          onMouseDown={(e) => e.preventDefault()}
          onPointerDown={(e) => {
            if (!local.disabled && canDecrement()) startRepeat(-1);
          }}
          onPointerUp={stopRepeat}
          onPointerLeave={stopRepeat}
        >
          <BsDash />
        </button>

        <input
          id={inputId()}
          name={local.name}
          type="text"
          inputmode="numeric"
          class="number-input__input"
          value={inputValue()}
          placeholder={local.placeholder}
          disabled={local.disabled}
          onInput={handleInput}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          aria-invalid={local.invalid || !!local.error}
          aria-describedby={local['aria-describedby']}
          aria-required={local['aria-required']}
          aria-labelledby={local['aria-labelledby']}
          aria-valuemin={local.min}
          aria-valuemax={local.max}
          aria-valuenow={local.value}
          role="spinbutton"
        />

        <button
          type="button"
          class="number-input__stepper number-input__stepper--increment"
          disabled={local.disabled || !canIncrement()}
          tabIndex={-1}
          aria-label="Increase value"
          onMouseDown={(e) => e.preventDefault()}
          onPointerDown={(e) => {
            if (!local.disabled && canIncrement()) startRepeat(1);
          }}
          onPointerUp={stopRepeat}
          onPointerLeave={stopRepeat}
        >
          <BsPlus />
        </button>

        <Show when={local.suffix}>
          <span class="number-input__suffix">{local.suffix}</span>
        </Show>
      </div>
    </div>
  );
};

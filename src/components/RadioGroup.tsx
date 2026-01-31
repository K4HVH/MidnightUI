import { Component, JSX, For, splitProps, Show } from 'solid-js';
import '../styles/components/Radio.css';

interface RadioOption {
  value: string;
  label: string;
  disabled?: boolean;
  iconUnchecked?: Component;
  iconChecked?: Component;
}

interface RadioGroupProps {
  name: string;
  value?: string;
  onChange?: (value: string) => void;
  options: RadioOption[];
  size?: 'normal' | 'compact';
  orientation?: 'horizontal' | 'vertical';
  disabled?: boolean;
  class?: string;
}

const Radio: Component<{
  name: string;
  value: string;
  label: string;
  checked: boolean;
  disabled?: boolean;
  size?: 'normal' | 'compact';
  iconUnchecked?: Component;
  iconChecked?: Component;
  onChange: () => void;
}> = (props) => {
  const size = () => props.size ?? 'normal';
  const hasIcon = () => props.iconUnchecked || props.iconChecked;

  const classNames = () => {
    const classes = ['radio'];

    if (props.disabled) {
      classes.push('radio--disabled');
    }

    if (size() === 'compact') {
      classes.push('radio--compact');
    }

    if (hasIcon()) {
      classes.push('radio--icon');
    }

    return classes.join(' ');
  };

  return (
    <label class={classNames()}>
      <input
        type="radio"
        class="radio__input"
        name={props.name}
        value={props.value}
        checked={props.checked}
        disabled={props.disabled}
        onChange={props.onChange}
      />
      <Show
        when={hasIcon()}
        fallback={<span class="radio__circle" />}
      >
        <span class="radio__icon-wrapper">
          <Show when={props.iconUnchecked}>
            <span class="radio__icon radio__icon--unchecked">
              {props.iconUnchecked && <props.iconUnchecked />}
            </span>
          </Show>
          <Show when={props.iconChecked}>
            <span class="radio__icon radio__icon--checked">
              {props.iconChecked && <props.iconChecked />}
            </span>
          </Show>
        </span>
      </Show>
      <span class="radio__label">{props.label}</span>
    </label>
  );
};

export const RadioGroup: Component<RadioGroupProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'name',
    'value',
    'onChange',
    'options',
    'size',
    'orientation',
    'disabled',
    'class',
  ]);

  const orientation = () => local.orientation ?? 'vertical';

  const handleChange = (optionValue: string) => {
    if (local.onChange) {
      local.onChange(optionValue);
    }
  };

  const classNames = () => {
    const classes = ['radio-group'];

    if (orientation() === 'horizontal') {
      classes.push('radio-group--horizontal');
    }

    if (local.class) {
      classes.push(local.class);
    }

    return classes.join(' ');
  };

  return (
    <div class={classNames()} {...rest}>
      <For each={local.options}>
        {(option) => (
          <Radio
            name={local.name}
            value={option.value}
            label={option.label}
            checked={local.value === option.value}
            disabled={local.disabled || option.disabled}
            size={local.size}
            iconUnchecked={option.iconUnchecked}
            iconChecked={option.iconChecked}
            onChange={() => handleChange(option.value)}
          />
        )}
      </For>
    </div>
  );
};

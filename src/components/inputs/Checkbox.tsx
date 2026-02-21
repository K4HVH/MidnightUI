import { Component, JSX, createEffect, splitProps, Show } from 'solid-js';
import { useFormField } from '../../contexts/FormFieldContext';
import '../../styles/components/inputs/Checkbox.css';

interface CheckboxProps extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'size' | 'type' | 'onChange'> {
  onChange?: (checked: boolean) => void;
  label?: string;
  size?: 'normal' | 'compact';
  indeterminate?: boolean;
  iconUnchecked?: Component;
  iconChecked?: Component;
  error?: string;
  invalid?: boolean;
}

export const Checkbox: Component<CheckboxProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'label',
    'size',
    'disabled',
    'indeterminate',
    'iconUnchecked',
    'iconChecked',
    'error',
    'invalid',
    'class',
    'onChange',
    'id',
    'required',
    'aria-describedby',
    'aria-required',
  ]);

  const fieldCtx = useFormField();
  const inputId = () => local.id ?? fieldCtx?.fieldId;
  const ariaDescribedBy = () => local['aria-describedby'] ?? fieldCtx?.ariaDescribedBy?.();
  const ariaRequired = () => local['aria-required'] ?? local.required ?? fieldCtx?.required;

  let inputRef: HTMLInputElement | undefined;

  const size = () => local.size ?? 'normal';
  const hasIcon = () => local.iconUnchecked || local.iconChecked;

  createEffect(() => {
    if (inputRef) {
      inputRef.indeterminate = local.indeterminate ?? false;
    }
  });

  const classNames = () => {
    const classes = ['checkbox'];

    if (local.disabled) {
      classes.push('checkbox--disabled');
    }

    if (size() === 'compact') {
      classes.push('checkbox--compact');
    }

    if (hasIcon()) {
      classes.push('checkbox--icon');
    }

    if (local.invalid || local.error) {
      classes.push('checkbox--invalid');
    }

    if (local.class) {
      classes.push(local.class);
    }

    return classes.join(' ');
  };

  return (
    <label class={classNames()}>
      <input
        ref={inputRef}
        id={inputId()}
        type="checkbox"
        class="checkbox__input"
        disabled={local.disabled}
        required={local.required}
        aria-invalid={local.invalid || !!local.error}
        aria-describedby={ariaDescribedBy()}
        aria-required={ariaRequired()}
        onChange={(e) => local.onChange?.(e.currentTarget.checked)}
        {...rest}
      />
      <Show
        when={hasIcon()}
        fallback={<span class="checkbox__box" />}
      >
        <span class="checkbox__icon-wrapper">
          <Show when={local.iconUnchecked}>
            <span class="checkbox__icon checkbox__icon--unchecked">
              {local.iconUnchecked && <local.iconUnchecked />}
            </span>
          </Show>
          <Show when={local.iconChecked}>
            <span class="checkbox__icon checkbox__icon--checked">
              {local.iconChecked && <local.iconChecked />}
            </span>
          </Show>
        </span>
      </Show>
      {local.label && <span class="checkbox__label">{local.label}</span>}
    </label>
  );
};

import { Component, For, Show, splitProps, createSignal } from 'solid-js';
import { Dynamic } from 'solid-js/web';
import '../../styles/components/navigation/Tabs.css';

export interface TabOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: Component;
}

interface TabsProps {
  options: TabOption[];
  value?: string;
  onChange?: (value: string) => void;
  defaultValue?: string;
  variant?: 'primary' | 'secondary' | 'subtle';
  orientation?: 'horizontal' | 'vertical';
  size?: 'compact' | 'normal' | 'spacious';
  iconOnly?: boolean;
  disabled?: boolean;
  class?: string;
}

export const Tabs: Component<TabsProps> = (props) => {
  const [local] = splitProps(props, [
    'options',
    'value',
    'onChange',
    'defaultValue',
    'variant',
    'orientation',
    'size',
    'iconOnly',
    'disabled',
    'class',
  ]);

  const variant = () => local.variant ?? 'primary';
  const orientation = () => local.orientation ?? 'horizontal';
  const size = () => local.size ?? 'normal';

  // Controlled / uncontrolled state
  const isControlled = () => local.value !== undefined;
  const [internalValue, setInternalValue] = createSignal(
    local.defaultValue ?? local.options[0]?.value ?? ''
  );

  const currentValue = () => isControlled() ? local.value! : internalValue();

  const setValue = (newValue: string) => {
    if (!isControlled()) {
      setInternalValue(newValue);
    }
    local.onChange?.(newValue);
  };

  const handleClick = (option: TabOption) => {
    if (local.disabled || option.disabled) return;
    setValue(option.value);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    const isHorizontal = orientation() === 'horizontal';
    const nextKey = isHorizontal ? 'ArrowRight' : 'ArrowDown';
    const prevKey = isHorizontal ? 'ArrowLeft' : 'ArrowUp';

    let direction: 1 | -1 | null = null;
    if (e.key === nextKey) direction = 1;
    else if (e.key === prevKey) direction = -1;
    else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      const enabledOptions = local.options.filter(o => !o.disabled && !local.disabled);
      if (enabledOptions.length === 0) return;
      const target = e.key === 'Home' ? enabledOptions[0] : enabledOptions[enabledOptions.length - 1];
      setValue(target.value);
      const container = (e.currentTarget as HTMLElement);
      const buttons = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      const targetIndex = local.options.indexOf(target);
      buttons[targetIndex]?.focus();
      return;
    } else {
      return;
    }

    e.preventDefault();
    const currentIndex = local.options.findIndex(o => o.value === currentValue());
    let nextIndex = currentIndex;
    const len = local.options.length;

    // Find next enabled tab in direction, wrapping around
    for (let i = 1; i <= len; i++) {
      const candidate = (currentIndex + direction * i + len) % len;
      const option = local.options[candidate];
      if (!option.disabled && !local.disabled) {
        nextIndex = candidate;
        break;
      }
    }

    if (nextIndex !== currentIndex) {
      setValue(local.options[nextIndex].value);
      const container = (e.currentTarget as HTMLElement);
      const buttons = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
      buttons[nextIndex]?.focus();
    }
  };

  const classNames = () => {
    const classes = ['tabs'];

    classes.push(`tabs--${variant()}`);

    if (orientation() === 'vertical') {
      classes.push('tabs--vertical');
    }

    if (size() !== 'normal') {
      classes.push(`tabs--${size()}`);
    }

    if (local.iconOnly) {
      classes.push('tabs--icon-only');
    }

    if (local.disabled) {
      classes.push('tabs--disabled');
    }

    if (local.class) {
      classes.push(local.class);
    }

    return classes.join(' ');
  };

  return (
    <div
      class={classNames()}
      role="tablist"
      aria-orientation={orientation()}
      onKeyDown={handleKeyDown}
    >
      <For each={local.options}>
        {(option) => {
          const isActive = () => currentValue() === option.value;
          const isDisabled = () => local.disabled || option.disabled;

          const tabClasses = () => {
            const classes = ['tabs__tab'];
            if (isActive()) classes.push('tabs__tab--active');
            if (isDisabled()) classes.push('tabs__tab--disabled');
            return classes.join(' ');
          };

          return (
            <button
              class={tabClasses()}
              role="tab"
              aria-selected={isActive()}
              aria-label={local.iconOnly ? option.label : undefined}
              tabIndex={isActive() ? 0 : -1}
              disabled={isDisabled()}
              onClick={() => handleClick(option)}
            >
              <Show when={option.icon}>
                <span class="tabs__tab-icon">
                  <Dynamic component={option.icon!} />
                </span>
              </Show>
              <Show when={!local.iconOnly}>
                <span class="tabs__tab-label">{option.label}</span>
              </Show>
            </button>
          );
        }}
      </For>
    </div>
  );
};

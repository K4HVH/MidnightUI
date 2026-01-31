import { Component, createSignal, createEffect, Show, For, splitProps, JSX, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import { BsX } from 'solid-icons/bs';
import { Checkbox } from './Checkbox';
import '../../styles/components/inputs/Combobox.css';

interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  icon?: Component;
  iconUnchecked?: Component;
  iconChecked?: Component;
}

interface ComboboxProps {
  name?: string;
  value?: string | string[];
  onChange?: (value: string | string[]) => void;
  options: ComboboxOption[];
  placeholder?: string;
  size?: 'normal' | 'compact';
  disabled?: boolean;
  multiple?: boolean;
  class?: string;
}

export const Combobox: Component<ComboboxProps> = (props) => {
  const [local, rest] = splitProps(props, [
    'name',
    'value',
    'onChange',
    'options',
    'placeholder',
    'size',
    'disabled',
    'multiple',
    'class',
  ]);

  const [isOpen, setIsOpen] = createSignal(false);
  const [dropdownPosition, setDropdownPosition] = createSignal({ top: 0, left: 0, width: 0 });
  let comboboxRef: HTMLDivElement | undefined;
  let dropdownRef: HTMLDivElement | undefined;

  const size = () => local.size ?? 'normal';

  // Update dropdown position when opened or on scroll/resize
  const updatePosition = () => {
    if (comboboxRef) {
      const rect = comboboxRef.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      });
    }
  };

  createEffect(() => {
    if (isOpen()) {
      updatePosition();
      window.addEventListener('scroll', updatePosition, true);
      window.addEventListener('resize', updatePosition);
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('mousedown', handleClickOutside);
    }
  });

  onCleanup(() => {
    window.removeEventListener('scroll', updatePosition, true);
    window.removeEventListener('resize', updatePosition);
    document.removeEventListener('mousedown', handleClickOutside);
  });

  const selectedValues = (): string[] => {
    if (local.multiple) {
      return Array.isArray(local.value) ? local.value : [];
    }
    return local.value && typeof local.value === 'string' ? [local.value] : [];
  };

  const selectedOptions = () => {
    const values = selectedValues();
    return local.options.filter(opt => values.includes(opt.value));
  };

  const isSelected = (value: string) => {
    return selectedValues().includes(value);
  };

  const handleToggle = () => {
    if (!local.disabled) {
      setIsOpen(!isOpen());
    }
  };

  const handleSelect = (value: string) => {
    if (!local.onChange) return;

    if (local.multiple) {
      const currentValues = selectedValues();
      const newValues = currentValues.includes(value)
        ? currentValues.filter(v => v !== value)
        : [...currentValues, value];
      local.onChange(newValues);
      // Don't close dropdown in multiple mode
    } else {
      local.onChange(value);
      setIsOpen(false);
    }
  };

  const handleRemove = (value: string) => {
    if (!local.onChange || !local.multiple) return;
    const currentValues = selectedValues();
    const newValues = currentValues.filter(v => v !== value);
    local.onChange(newValues);
  };

  const handleClickOutside = (e: MouseEvent) => {
    const target = e.target as HTMLElement;
    // Don't close if clicking inside combobox or dropdown
    if (comboboxRef?.contains(target) || dropdownRef?.contains(target)) {
      return;
    }
    setIsOpen(false);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (local.disabled) return;

    if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsOpen(!isOpen());
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!isOpen()) {
        setIsOpen(true);
      }
    }
  };

  const classNames = () => {
    const classes = ['combobox'];

    if (local.disabled) {
      classes.push('combobox--disabled');
    }

    if (size() === 'compact') {
      classes.push('combobox--compact');
    }

    if (isOpen()) {
      classes.push('combobox--open');
    }

    if (local.class) {
      classes.push(local.class);
    }

    return classes.join(' ');
  };

  return (
    <div
      ref={comboboxRef}
      class={classNames()}
      tabIndex={local.disabled ? -1 : 0}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      <div class="combobox__trigger" onClick={handleToggle}>
        <span class="combobox__value">
          <Show when={selectedOptions().length > 0} fallback={<span class="combobox__placeholder">{local.placeholder || 'Select...'}</span>}>
            {local.multiple ? (
              <div class="combobox__chips">
                <For each={selectedOptions()}>
                  {(option) => {
                    const Icon = option.iconChecked || option.icon;
                    return (
                      <span class="combobox__chip">
                        {Icon && (
                          <span class="combobox__icon">
                            <Icon />
                          </span>
                        )}
                        <span>{option.label}</span>
                        <button
                          type="button"
                          class="combobox__chip-remove"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemove(option.value);
                          }}
                        >
                          <BsX />
                        </button>
                      </span>
                    );
                  }}
                </For>
              </div>
            ) : (
              (() => {
                const option = selectedOptions()[0];
                const Icon = option?.icon;
                return (
                  <>
                    {Icon && (
                      <span class="combobox__icon">
                        <Icon />
                      </span>
                    )}
                    <span>{option?.label}</span>
                  </>
                );
              })()
            )}
          </Show>
        </span>
        <span class="combobox__arrow" />
      </div>

      <Show when={isOpen()}>
        <Portal>
          <div
            ref={dropdownRef}
            class="combobox__dropdown"
            style={{
              position: 'fixed',
              top: `${dropdownPosition().top}px`,
              left: `${dropdownPosition().left}px`,
              width: `${dropdownPosition().width}px`,
            }}
          >
            <For each={local.options}>
              {(option) => (
                <div
                  class={`combobox__option ${option.disabled ? 'combobox__option--disabled' : ''} ${isSelected(option.value) ? 'combobox__option--selected' : ''}`}
                  onMouseDown={(e) => {
                    if (option.disabled) {
                      e.stopPropagation();
                      e.preventDefault();
                    }
                  }}
                  onClick={(e) => {
                    if (option.disabled) {
                      e.stopPropagation();
                      return;
                    }
                    handleSelect(option.value);
                  }}
                >
                  {local.multiple ? (
                    <Checkbox
                      checked={isSelected(option.value)}
                      disabled={option.disabled}
                      iconUnchecked={option.iconUnchecked}
                      iconChecked={option.iconChecked}
                    />
                  ) : (
                    option.icon && (
                      <span class="combobox__icon">
                        <option.icon />
                      </span>
                    )
                  )}
                  <span>{option.label}</span>
                </div>
              )}
            </For>
          </div>
        </Portal>
      </Show>
    </div>
  );
};

import { render, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { createSignal } from 'solid-js';
import { Tabs, type TabOption } from '../../src/components/navigation/Tabs';
import { BsStar, BsHeart, BsGear } from 'solid-icons/bs';

describe('Tabs', () => {
  const mockOptions: TabOption[] = [
    { value: 'tab1', label: 'Tab 1' },
    { value: 'tab2', label: 'Tab 2' },
    { value: 'tab3', label: 'Tab 3' },
  ];

  it('renders all tab options with correct labels', () => {
    const { getByText } = render(() => (
      <Tabs options={mockOptions} />
    ));
    expect(getByText('Tab 1')).toBeInTheDocument();
    expect(getByText('Tab 2')).toBeInTheDocument();
    expect(getByText('Tab 3')).toBeInTheDocument();
  });

  it('renders with role="tablist" on container', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} />
    ));
    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist).toBeInTheDocument();
  });

  it('renders each tab with role="tab"', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} />
    ));
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs.length).toBe(3);
  });

  it('controlled mode: value + onChange work', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <Tabs options={mockOptions} value="tab2" onChange={handleChange} />
    ));

    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');

    fireEvent.click(tabs[0]);
    expect(handleChange).toHaveBeenCalledWith('tab1');
  });

  it('controlled mode: updates when value prop changes', () => {
    const TestComponent = () => {
      const [value, setValue] = createSignal('tab1');
      return (
        <>
          <Tabs options={mockOptions} value={value()} onChange={setValue} />
          <button data-testid="switch" onClick={() => setValue('tab3')}>Switch</button>
        </>
      );
    };

    const { container, getByTestId } = render(() => <TestComponent />);
    const tabs = container.querySelectorAll('[role="tab"]');

    expect(tabs[0].getAttribute('aria-selected')).toBe('true');

    fireEvent.click(getByTestId('switch'));
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
  });

  it('uncontrolled mode: defaultValue sets initial tab', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} defaultValue="tab3" />
    ));
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs[2].getAttribute('aria-selected')).toBe('true');
  });

  it('uncontrolled mode: internal state updates on click', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} defaultValue="tab1" />
    ));
    const tabs = container.querySelectorAll('[role="tab"]');

    expect(tabs[0].getAttribute('aria-selected')).toBe('true');

    fireEvent.click(tabs[1]);
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
  });

  it('defaults to first option when no value or defaultValue', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} />
    ));
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
  });

  it('applies horizontal orientation by default (no modifier class)', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} />
    ));
    const tablist = container.querySelector('.tabs');
    expect(tablist?.classList.contains('tabs--vertical')).toBe(false);
  });

  it('applies vertical orientation class', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} orientation="vertical" />
    ));
    const tablist = container.querySelector('.tabs--vertical');
    expect(tablist).toBeInTheDocument();
  });

  it('applies aria-orientation attribute', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} orientation="vertical" />
    ));
    const tablist = container.querySelector('[role="tablist"]');
    expect(tablist?.getAttribute('aria-orientation')).toBe('vertical');
  });

  it('applies compact size class', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} size="compact" />
    ));
    const tablist = container.querySelector('.tabs--compact');
    expect(tablist).toBeInTheDocument();
  });

  it('applies spacious size class', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} size="spacious" />
    ));
    const tablist = container.querySelector('.tabs--spacious');
    expect(tablist).toBeInTheDocument();
  });

  it('normal size has no modifier class', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} size="normal" />
    ));
    const tablist = container.querySelector('.tabs');
    expect(tablist?.classList.contains('tabs--compact')).toBe(false);
    expect(tablist?.classList.contains('tabs--spacious')).toBe(false);
  });

  it('group disabled disables all tabs', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <Tabs options={mockOptions} disabled onChange={handleChange} />
    ));
    const tablist = container.querySelector('.tabs--disabled');
    expect(tablist).toBeInTheDocument();

    const tabs = container.querySelectorAll('[role="tab"]');
    tabs.forEach(tab => {
      expect((tab as HTMLButtonElement).disabled).toBe(true);
    });

    fireEvent.click(tabs[1]);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('per-tab disabled prevents selection', () => {
    const optionsWithDisabled: TabOption[] = [
      { value: 'tab1', label: 'Tab 1' },
      { value: 'tab2', label: 'Tab 2', disabled: true },
      { value: 'tab3', label: 'Tab 3' },
    ];
    const handleChange = vi.fn();
    const { container } = render(() => (
      <Tabs options={optionsWithDisabled} onChange={handleChange} />
    ));

    const tabs = container.querySelectorAll('[role="tab"]');
    expect((tabs[1] as HTMLButtonElement).disabled).toBe(true);
    expect(tabs[1].classList.contains('tabs__tab--disabled')).toBe(true);

    fireEvent.click(tabs[1]);
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('renders icons when provided', () => {
    const optionsWithIcons: TabOption[] = [
      { value: 'tab1', label: 'Star', icon: BsStar },
      { value: 'tab2', label: 'Heart', icon: BsHeart },
      { value: 'tab3', label: 'Settings', icon: BsGear },
    ];
    const { container } = render(() => (
      <Tabs options={optionsWithIcons} />
    ));
    const icons = container.querySelectorAll('.tabs__tab-icon');
    expect(icons.length).toBe(3);
  });

  it('does not render icon span when no icon provided', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} />
    ));
    const icons = container.querySelectorAll('.tabs__tab-icon');
    expect(icons.length).toBe(0);
  });

  it('aria-selected is correct on active and inactive tabs', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} value="tab2" />
    ));
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs[0].getAttribute('aria-selected')).toBe('false');
    expect(tabs[1].getAttribute('aria-selected')).toBe('true');
    expect(tabs[2].getAttribute('aria-selected')).toBe('false');
  });

  it('active tab has tabIndex 0, others have -1', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} value="tab2" />
    ));
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs[0].getAttribute('tabindex')).toBe('-1');
    expect(tabs[1].getAttribute('tabindex')).toBe('0');
    expect(tabs[2].getAttribute('tabindex')).toBe('-1');
  });

  it('keyboard: arrow right moves to next tab (horizontal)', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <Tabs options={mockOptions} value="tab1" onChange={handleChange} />
    ));
    const tablist = container.querySelector('[role="tablist"]')!;

    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(handleChange).toHaveBeenCalledWith('tab2');
  });

  it('keyboard: arrow left moves to previous tab (horizontal)', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <Tabs options={mockOptions} value="tab2" onChange={handleChange} />
    ));
    const tablist = container.querySelector('[role="tablist"]')!;

    fireEvent.keyDown(tablist, { key: 'ArrowLeft' });
    expect(handleChange).toHaveBeenCalledWith('tab1');
  });

  it('keyboard: arrow wraps around', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <Tabs options={mockOptions} value="tab3" onChange={handleChange} />
    ));
    const tablist = container.querySelector('[role="tablist"]')!;

    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(handleChange).toHaveBeenCalledWith('tab1');
  });

  it('keyboard: skips disabled tabs', () => {
    const optionsWithDisabled: TabOption[] = [
      { value: 'tab1', label: 'Tab 1' },
      { value: 'tab2', label: 'Tab 2', disabled: true },
      { value: 'tab3', label: 'Tab 3' },
    ];
    const handleChange = vi.fn();
    const { container } = render(() => (
      <Tabs options={optionsWithDisabled} value="tab1" onChange={handleChange} />
    ));
    const tablist = container.querySelector('[role="tablist"]')!;

    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(handleChange).toHaveBeenCalledWith('tab3');
  });

  it('keyboard: Home moves to first enabled tab', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <Tabs options={mockOptions} value="tab3" onChange={handleChange} />
    ));
    const tablist = container.querySelector('[role="tablist"]')!;

    fireEvent.keyDown(tablist, { key: 'Home' });
    expect(handleChange).toHaveBeenCalledWith('tab1');
  });

  it('keyboard: End moves to last enabled tab', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <Tabs options={mockOptions} value="tab1" onChange={handleChange} />
    ));
    const tablist = container.querySelector('[role="tablist"]')!;

    fireEvent.keyDown(tablist, { key: 'End' });
    expect(handleChange).toHaveBeenCalledWith('tab3');
  });

  it('keyboard: vertical uses ArrowDown/ArrowUp', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <Tabs options={mockOptions} value="tab1" orientation="vertical" onChange={handleChange} />
    ));
    const tablist = container.querySelector('[role="tablist"]')!;

    fireEvent.keyDown(tablist, { key: 'ArrowDown' });
    expect(handleChange).toHaveBeenCalledWith('tab2');

    handleChange.mockClear();
    fireEvent.keyDown(tablist, { key: 'ArrowUp' });
    // After the first ArrowDown moved to tab2 (in controlled mode, value is still tab1)
    // So ArrowUp from tab1 wraps to tab3
    expect(handleChange).toHaveBeenCalledWith('tab3');
  });

  it('appends custom class', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} class="my-custom-tabs" />
    ));
    const tablist = container.querySelector('.tabs.my-custom-tabs');
    expect(tablist).toBeInTheDocument();
  });

  it('calls onChange in uncontrolled mode', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <Tabs options={mockOptions} defaultValue="tab1" onChange={handleChange} />
    ));
    const tabs = container.querySelectorAll('[role="tab"]');

    fireEvent.click(tabs[2]);
    expect(handleChange).toHaveBeenCalledWith('tab3');
  });

  // Variant tests
  it('applies primary variant class by default', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} />
    ));
    const tablist = container.querySelector('.tabs--primary');
    expect(tablist).toBeInTheDocument();
  });

  it('applies secondary variant class', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} variant="secondary" />
    ));
    const tablist = container.querySelector('.tabs--secondary');
    expect(tablist).toBeInTheDocument();
  });

  it('applies subtle variant class', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} variant="subtle" />
    ));
    const tablist = container.querySelector('.tabs--subtle');
    expect(tablist).toBeInTheDocument();
  });

  // Icon-only tests
  it('icon-only mode hides labels', () => {
    const optionsWithIcons: TabOption[] = [
      { value: 'tab1', label: 'Star', icon: BsStar },
      { value: 'tab2', label: 'Heart', icon: BsHeart },
    ];
    const { container } = render(() => (
      <Tabs options={optionsWithIcons} iconOnly />
    ));
    const labels = container.querySelectorAll('.tabs__tab-label');
    expect(labels.length).toBe(0);
  });

  it('icon-only mode renders icons', () => {
    const optionsWithIcons: TabOption[] = [
      { value: 'tab1', label: 'Star', icon: BsStar },
      { value: 'tab2', label: 'Heart', icon: BsHeart },
    ];
    const { container } = render(() => (
      <Tabs options={optionsWithIcons} iconOnly />
    ));
    const icons = container.querySelectorAll('.tabs__tab-icon');
    expect(icons.length).toBe(2);
  });

  it('icon-only mode applies class', () => {
    const optionsWithIcons: TabOption[] = [
      { value: 'tab1', label: 'Star', icon: BsStar },
      { value: 'tab2', label: 'Heart', icon: BsHeart },
    ];
    const { container } = render(() => (
      <Tabs options={optionsWithIcons} iconOnly />
    ));
    const tablist = container.querySelector('.tabs--icon-only');
    expect(tablist).toBeInTheDocument();
  });

  it('icon-only mode sets aria-label from label text', () => {
    const optionsWithIcons: TabOption[] = [
      { value: 'tab1', label: 'Star', icon: BsStar },
      { value: 'tab2', label: 'Heart', icon: BsHeart },
    ];
    const { container } = render(() => (
      <Tabs options={optionsWithIcons} iconOnly />
    ));
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs[0].getAttribute('aria-label')).toBe('Star');
    expect(tabs[1].getAttribute('aria-label')).toBe('Heart');
  });

  it('non icon-only mode does not set aria-label', () => {
    const { container } = render(() => (
      <Tabs options={mockOptions} />
    ));
    const tabs = container.querySelectorAll('[role="tab"]');
    expect(tabs[0].getAttribute('aria-label')).toBeNull();
  });

  it('icon-only mode still supports keyboard navigation', () => {
    const optionsWithIcons: TabOption[] = [
      { value: 'tab1', label: 'Star', icon: BsStar },
      { value: 'tab2', label: 'Heart', icon: BsHeart },
      { value: 'tab3', label: 'Gear', icon: BsGear },
    ];
    const handleChange = vi.fn();
    const { container } = render(() => (
      <Tabs options={optionsWithIcons} iconOnly value="tab1" onChange={handleChange} />
    ));
    const tablist = container.querySelector('[role="tablist"]')!;

    fireEvent.keyDown(tablist, { key: 'ArrowRight' });
    expect(handleChange).toHaveBeenCalledWith('tab2');
  });
});

import { render, fireEvent } from '@solidjs/testing-library';
import { describe, it, expect, vi } from 'vitest';
import { createSignal } from 'solid-js';
import { DatePicker, DatePickerRangeValue } from '../../src/components/inputs/DatePicker';

// Calendar panel is Portal-rendered → query via document, not container
// Trigger is now icon button (.date-picker__icon-btn) + text input (.date-picker__input)

describe('DatePicker', () => {
  // ---- Rendering ----

  it('renders with label', () => {
    const { getByText } = render(() => <DatePicker label="Start date" />);
    expect(getByText('Start date')).toBeInTheDocument();
  });

  it('shows placeholder when no value', () => {
    const { container } = render(() => <DatePicker placeholder="Pick a date" />);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    expect(input.placeholder).toBe('Pick a date');
    expect(input.value).toBe('');
  });

  it('shows default date placeholder', () => {
    const { container } = render(() => <DatePicker />);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    expect(input.placeholder).toBe('Select date');
  });

  it('shows default time placeholder for time mode', () => {
    const { container } = render(() => <DatePicker mode="time" />);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    expect(input.placeholder).toBe('Select time');
  });

  it('shows default datetime placeholder for datetime mode', () => {
    const { container } = render(() => <DatePicker mode="datetime" />);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    expect(input.placeholder).toBe('Select date & time');
  });

  it('shows default range placeholder when range=true', () => {
    const { container } = render(() => <DatePicker range />);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    expect(input.placeholder).toBe('Select date range');
  });

  it('displays formatted date value', () => {
    const { container } = render(() => <DatePicker value="2026-02-19" />);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    expect(input.value).toContain('19 Feb 2026');
  });

  it('displays formatted time value', () => {
    const { container } = render(() => <DatePicker mode="time" value="14:30" />);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    expect(input.value).toContain('14:30');
  });

  it('displays formatted datetime value', () => {
    const { container } = render(() => <DatePicker mode="datetime" value="2026-02-19T09:00" />);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    expect(input.value).toContain('19 Feb 2026');
    expect(input.value).toContain('09:00');
  });

  it('applies compact size class', () => {
    const { container } = render(() => <DatePicker size="compact" />);
    expect(container.querySelector('.date-picker--compact')).toBeInTheDocument();
  });

  it('applies disabled class and attribute', () => {
    const { container } = render(() => <DatePicker disabled />);
    expect(container.querySelector('.date-picker--disabled')).toBeInTheDocument();
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    expect(input.disabled).toBe(true);
    const iconBtn = container.querySelector('.date-picker__icon-btn') as HTMLButtonElement;
    expect(iconBtn.disabled).toBe(true);
  });

  it('applies invalid class when invalid prop is set', () => {
    const { container } = render(() => <DatePicker invalid />);
    expect(container.querySelector('.date-picker--invalid')).toBeInTheDocument();
  });

  it('applies invalid class when error prop is set', () => {
    const { container } = render(() => <DatePicker error="Required" />);
    expect(container.querySelector('.date-picker--invalid')).toBeInTheDocument();
  });

  it('applies custom class', () => {
    const { container } = render(() => <DatePicker class="my-picker" />);
    expect(container.querySelector('.my-picker')).toBeInTheDocument();
  });

  it('links label to input with id', () => {
    const { container } = render(() => <DatePicker label="Date" id="my-date" />);
    const label = container.querySelector('label')!;
    const input = container.querySelector('.date-picker__input')!;
    expect(label.getAttribute('for')).toBe('my-date');
    expect(input.id).toBe('my-date');
  });

  // ---- Dropdown open/close ----

  it('opens calendar on icon button click', () => {
    const { container } = render(() => <DatePicker />);
    const iconBtn = container.querySelector('.date-picker__icon-btn')!;
    fireEvent.click(iconBtn);
    expect(document.querySelector('.date-picker__panel')).toBeInTheDocument();
  });

  it('adds open modifier class when open', () => {
    const { container } = render(() => <DatePicker />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    expect(container.querySelector('.date-picker--open')).toBeInTheDocument();
  });

  it('closes on second icon click (toggle)', () => {
    const { container } = render(() => <DatePicker />);
    const iconBtn = container.querySelector('.date-picker__icon-btn')!;
    fireEvent.click(iconBtn);
    fireEvent.click(iconBtn);
    expect(document.querySelector('.date-picker__panel')).not.toBeInTheDocument();
  });

  it('does not open when disabled', () => {
    const { container } = render(() => <DatePicker disabled />);
    const iconBtn = container.querySelector('.date-picker__icon-btn') as HTMLButtonElement;
    fireEvent.click(iconBtn);
    expect(document.querySelector('.date-picker__panel')).not.toBeInTheDocument();
  });

  it('closes calendar on Escape key', () => {
    const { container } = render(() => <DatePicker />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    expect(document.querySelector('.date-picker__panel')).toBeInTheDocument();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.querySelector('.date-picker__panel')).not.toBeInTheDocument();
  });

  it('has aria-expanded=false on input when closed', () => {
    const { container } = render(() => <DatePicker />);
    const input = container.querySelector('.date-picker__input')!;
    expect(input.getAttribute('aria-expanded')).toBe('false');
  });

  it('has aria-expanded=true on input when open', () => {
    const { container } = render(() => <DatePicker />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const input = container.querySelector('.date-picker__input')!;
    expect(input.getAttribute('aria-expanded')).toBe('true');
  });

  // ---- Calendar contents ----

  it('renders day-of-week headers', () => {
    const { container } = render(() => <DatePicker />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const headers = document.querySelectorAll('.date-picker__day-header');
    expect(headers.length).toBe(7);
    expect(headers[0].textContent).toBe('Mon');
    expect(headers[6].textContent).toBe('Sun');
  });

  it('renders 42 day cells (6 weeks)', () => {
    const { container } = render(() => <DatePicker />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const days = document.querySelectorAll('.date-picker__day');
    expect(days.length).toBe(42);
  });

  it('shows Today button in footer for date mode', () => {
    const { container } = render(() => <DatePicker />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const footerBtns = document.querySelectorAll('.date-picker__footer-btn');
    const todayBtn = Array.from(footerBtns).find(b => b.textContent?.trim() === 'Today');
    expect(todayBtn).toBeInTheDocument();
  });

  it('shows Now button in footer for time mode', () => {
    const { container } = render(() => <DatePicker mode="time" />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const footerBtns = document.querySelectorAll('.date-picker__footer-btn');
    const nowBtn = Array.from(footerBtns).find(b => b.textContent?.trim() === 'Now');
    expect(nowBtn).toBeInTheDocument();
    const todayBtn = Array.from(footerBtns).find(b => b.textContent?.trim() === 'Today');
    expect(todayBtn).toBeUndefined();
  });

  it('shows both Today and Now buttons for datetime mode', () => {
    const { container } = render(() => <DatePicker mode="datetime" />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const footerBtns = document.querySelectorAll('.date-picker__footer-btn');
    const todayBtn = Array.from(footerBtns).find(b => b.textContent?.trim() === 'Today');
    const nowBtn = Array.from(footerBtns).find(b => b.textContent?.trim() === 'Now');
    expect(todayBtn).toBeInTheDocument();
    expect(nowBtn).toBeInTheDocument();
  });

  it('shows time section for time mode', () => {
    const { container } = render(() => <DatePicker mode="time" value="09:30" />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    expect(document.querySelector('.date-picker__time')).toBeInTheDocument();
  });

  it('shows time section for datetime mode', () => {
    const { container } = render(() => <DatePicker mode="datetime" />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    expect(document.querySelector('.date-picker__time')).toBeInTheDocument();
  });

  // ---- Date selection ----

  it('calls onChange when a day is clicked (date mode)', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <DatePicker onChange={handleChange} />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const days = Array.from(document.querySelectorAll('.date-picker__day:not(.date-picker__day--other-month)'));
    fireEvent.click(days[0]);
    expect(handleChange).toHaveBeenCalledTimes(1);
    const val: string = handleChange.mock.calls[0][0];
    expect(val).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('closes calendar after selecting a date in date mode', () => {
    const { container } = render(() => <DatePicker onChange={() => {}} />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const days = Array.from(document.querySelectorAll('.date-picker__day:not(.date-picker__day--other-month)'));
    fireEvent.click(days[0]);
    expect(document.querySelector('.date-picker__panel')).not.toBeInTheDocument();
  });

  it('marks selected day with selected class', () => {
    const { container } = render(() => <DatePicker value="2026-02-19" />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const selected = document.querySelector('.date-picker__day--selected');
    expect(selected).toBeInTheDocument();
    expect(selected?.textContent).toBe('19');
  });

  it('Today button selects today and closes calendar', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <DatePicker onChange={handleChange} />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const footerBtns = document.querySelectorAll('.date-picker__footer-btn');
    const todayBtn = Array.from(footerBtns).find(b => b.textContent?.trim() === 'Today')!;
    fireEvent.click(todayBtn);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.date-picker__panel')).not.toBeInTheDocument();
  });

  // ---- Calendar navigation ----

  it('navigates to previous month', () => {
    const { container } = render(() => <DatePicker value="2026-03-15" />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const headerBefore = document.querySelector('.date-picker__month-year-btn')!.textContent;
    fireEvent.click(document.querySelector('.date-picker__nav-btn')!);
    const headerAfter = document.querySelector('.date-picker__month-year-btn')!.textContent;
    expect(headerBefore).not.toBe(headerAfter);
  });

  it('switches to month picker view when header is clicked', () => {
    const { container } = render(() => <DatePicker />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    fireEvent.click(document.querySelector('.date-picker__month-year-btn')!);
    expect(document.querySelector('.date-picker__month-grid')).toBeInTheDocument();
  });

  it('switches to year picker view from month view', () => {
    const { container } = render(() => <DatePicker />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    fireEvent.click(document.querySelector('.date-picker__month-year-btn')!);
    fireEvent.click(document.querySelector('.date-picker__month-year-btn')!);
    expect(document.querySelector('.date-picker__year-grid')).toBeInTheDocument();
  });

  it('selecting a month goes back to day view', () => {
    const { container } = render(() => <DatePicker />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    fireEvent.click(document.querySelector('.date-picker__month-year-btn')!);
    const months = document.querySelectorAll('.date-picker__month-item');
    fireEvent.click(months[0]);
    expect(document.querySelector('.date-picker__days-grid')).toBeInTheDocument();
  });

  // ---- Constraints ----

  it('disables days before minDate', () => {
    const { container } = render(() => (
      <DatePicker value="2026-02-19" minDate="2026-02-10" />
    ));
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const day5 = Array.from(document.querySelectorAll('.date-picker__day'))
      .find(d => d.textContent === '5' && !d.classList.contains('date-picker__day--other-month'));
    expect(day5?.classList.contains('date-picker__day--disabled')).toBe(true);
    expect((day5 as HTMLButtonElement)?.disabled).toBe(true);
  });

  it('disables days after maxDate', () => {
    const { container } = render(() => (
      <DatePicker value="2026-02-19" maxDate="2026-02-20" />
    ));
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const day28 = Array.from(document.querySelectorAll('.date-picker__day'))
      .find(d => d.textContent === '28' && !d.classList.contains('date-picker__day--other-month'));
    expect(day28?.classList.contains('date-picker__day--disabled')).toBe(true);
  });

  it('respects isDateDisabled callback', () => {
    const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;
    const { container } = render(() => (
      <DatePicker value="2026-02-19" isDateDisabled={isWeekend} />
    ));
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    // Feb 21 2026 is Saturday → should be disabled
    const day21 = Array.from(document.querySelectorAll('.date-picker__day'))
      .find(d => d.textContent === '21' && !d.classList.contains('date-picker__day--other-month'));
    expect(day21?.classList.contains('date-picker__day--disabled')).toBe(true);
  });

  it('does not call onChange when a disabled day is clicked', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <DatePicker onChange={handleChange} minDate="2026-02-15" value="2026-02-19" />
    ));
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const day5 = Array.from(document.querySelectorAll('.date-picker__day'))
      .find(d => d.textContent === '5' && !d.classList.contains('date-picker__day--other-month'));
    if (day5) fireEvent.click(day5);
    expect(handleChange).not.toHaveBeenCalled();
  });

  // ---- Clearable ----

  it('shows clear button when clearable and has value', () => {
    const { container } = render(() => <DatePicker value="2026-02-19" clearable />);
    expect(container.querySelector('.date-picker__clear')).toBeInTheDocument();
  });

  it('does not show clear button when no value', () => {
    const { container } = render(() => <DatePicker clearable />);
    expect(container.querySelector('.date-picker__clear')).not.toBeInTheDocument();
  });

  it('calls onChange with empty string when clear is clicked', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <DatePicker value="2026-02-19" clearable onChange={handleChange} />
    ));
    fireEvent.click(container.querySelector('.date-picker__clear')!);
    expect(handleChange).toHaveBeenCalledWith('');
  });

  // ---- Time mode ----

  it('calls onChange with HH:MM when hour is incremented', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <DatePicker mode="time" value="09:30" onChange={handleChange} />
    ));
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    // First time-btn increments hour
    const timeBtns = document.querySelectorAll('.date-picker__time-btn');
    fireEvent.click(timeBtns[0]);
    expect(handleChange).toHaveBeenCalledWith('10:30');
  });

  it('calls onChange with HH:MM when hour is decremented', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <DatePicker mode="time" value="09:30" onChange={handleChange} />
    ));
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const timeBtns = document.querySelectorAll('.date-picker__time-btn');
    fireEvent.click(timeBtns[1]); // decrement hour
    expect(handleChange).toHaveBeenCalledWith('08:30');
  });

  it('wraps hour from 23 to 00', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <DatePicker mode="time" value="23:00" onChange={handleChange} />
    ));
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const timeBtns = document.querySelectorAll('.date-picker__time-btn');
    fireEvent.click(timeBtns[0]); // increment from 23
    expect(handleChange).toHaveBeenCalledWith('00:00');
  });

  it('wraps minute from 59 to 00', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <DatePicker mode="time" value="12:59" onChange={handleChange} />
    ));
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const timeBtns = document.querySelectorAll('.date-picker__time-btn');
    fireEvent.click(timeBtns[2]); // increment minute
    expect(handleChange).toHaveBeenCalledWith('12:00');
  });

  // ---- Seconds ----

  it('shows seconds column when showSeconds is set', () => {
    const { container } = render(() => <DatePicker mode="time" showSeconds />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const timeBtns = document.querySelectorAll('.date-picker__time-btn');
    // hour up, hour down, min up, min down, sec up, sec down = 6 buttons
    expect(timeBtns.length).toBe(6);
  });

  it('calls onChange with HH:MM:SS when showSeconds and second is incremented', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <DatePicker mode="time" showSeconds value="09:30:00" onChange={handleChange} />
    ));
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const timeBtns = document.querySelectorAll('.date-picker__time-btn');
    fireEvent.click(timeBtns[4]); // increment second
    expect(handleChange).toHaveBeenCalledWith('09:30:01');
  });

  // ---- AM/PM (12-hour) ----

  it('shows AM/PM button when use12Hour is set', () => {
    const { container } = render(() => <DatePicker mode="time" use12Hour />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    expect(document.querySelector('.date-picker__ampm-btn')).toBeInTheDocument();
  });

  it('toggles AM/PM when AM/PM button is clicked', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <DatePicker mode="time" use12Hour value="09:00" onChange={handleChange} />
    ));
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const ampmBtn = document.querySelector('.date-picker__ampm-btn')!;
    expect(ampmBtn.textContent).toBe('AM');
    fireEvent.click(ampmBtn);
    expect(handleChange).toHaveBeenCalledWith('21:00');
    expect(ampmBtn.textContent).toBe('PM');
  });

  it('displays 12h format in time value when use12Hour', () => {
    const { container } = render(() => (
      <DatePicker mode="time" use12Hour value="14:30" />
    ));
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    expect(input.value).toContain('02:30');
    expect(input.value).toContain('PM');
  });

  // ---- Time steps ----

  it('respects timeStep for minute increments', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <DatePicker mode="time" timeStep={15} value="09:00" onChange={handleChange} />
    ));
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const timeBtns = document.querySelectorAll('.date-picker__time-btn');
    fireEvent.click(timeBtns[2]); // increment minute
    expect(handleChange).toHaveBeenCalledWith('09:15');
  });

  // ---- Now button ----

  it('Now button sets time and closes picker in time mode', () => {
    const handleChange = vi.fn();
    const { container } = render(() => (
      <DatePicker mode="time" onChange={handleChange} />
    ));
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const footerBtns = document.querySelectorAll('.date-picker__footer-btn');
    const nowBtn = Array.from(footerBtns).find(b => b.textContent?.trim() === 'Now')!;
    fireEvent.click(nowBtn);
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(document.querySelector('.date-picker__panel')).not.toBeInTheDocument();
  });

  // ---- Manual text input ----

  it('parses YYYY-MM-DD typed in the input', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <DatePicker onChange={handleChange} />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: '2026-03-15' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleChange).toHaveBeenCalledWith('2026-03-15');
    expect(document.querySelector('.date-picker__panel')).not.toBeInTheDocument();
  });

  it('parses D MMM YYYY typed in the input', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <DatePicker onChange={handleChange} />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: '15 Mar 2026' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleChange).toHaveBeenCalledWith('2026-03-15');
  });

  it('parses time typed in the input', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <DatePicker mode="time" onChange={handleChange} />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: '14:30' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleChange).toHaveBeenCalledWith('14:30');
  });

  it('parses time with AM/PM typed in the input', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <DatePicker mode="time" onChange={handleChange} />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: '2:30 PM' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleChange).toHaveBeenCalledWith('14:30');
  });

  it('parses 4-digit military time (HHMM) typed in the input', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <DatePicker mode="time" onChange={handleChange} />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: '2150' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleChange).toHaveBeenCalledWith('21:50');
  });

  it('parses 3-digit military time (HMM) typed in the input', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <DatePicker mode="time" onChange={handleChange} />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: '930' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleChange).toHaveBeenCalledWith('09:30');
  });

  it('parses 6-digit military time with seconds (HHMMSS) typed in the input', () => {
    const handleChange = vi.fn();
    const { container } = render(() => <DatePicker mode="time" showSeconds onChange={handleChange} />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: '215045' } });
    fireEvent.keyDown(input, { key: 'Enter' });
    expect(handleChange).toHaveBeenCalledWith('21:50:45');
  });

  it('Escape in input reverts text and closes picker', () => {
    const { container } = render(() => <DatePicker />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    fireEvent.focus(input);
    fireEvent.input(input, { target: { value: 'garbage' } });
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(document.querySelector('.date-picker__panel')).not.toBeInTheDocument();
    expect(input.value).toBe(''); // reverted to empty (no value set)
  });

  it('range input is read-only', () => {
    const { container } = render(() => <DatePicker range rangeValue={{}} onRangeChange={() => {}} />);
    const input = container.querySelector('.date-picker__input') as HTMLInputElement;
    expect(input.readOnly).toBe(true);
  });

  // ---- Range mode ----

  it('shows range hint when range mode is active', () => {
    const { container } = render(() => <DatePicker range rangeValue={{}} onRangeChange={() => {}} />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    expect(document.querySelector('.date-picker__range-hint')).toBeInTheDocument();
  });

  it('calls onRangeChange with start on first click', () => {
    const handleRangeChange = vi.fn();
    const { container } = render(() => (
      <DatePicker range rangeValue={{}} onRangeChange={handleRangeChange} />
    ));
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const days = Array.from(document.querySelectorAll('.date-picker__day:not(.date-picker__day--other-month)'));
    fireEvent.click(days[4]);
    expect(handleRangeChange).toHaveBeenCalledTimes(1);
    expect(handleRangeChange.mock.calls[0][0]).toMatchObject({
      start: expect.stringMatching(/^\d{4}-\d{2}-\d{2}$/),
      end: undefined,
    });
  });

  it('calls onRangeChange with start and end on second click', () => {
    const handleRangeChange = vi.fn();
    const TestComponent = () => {
      const [rv, setRv] = createSignal<DatePickerRangeValue>({});
      return (
        <DatePicker
          range
          rangeValue={rv()}
          onRangeChange={(v) => { setRv(v); handleRangeChange(v); }}
        />
      );
    };
    const { container } = render(() => <TestComponent />);
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    const days = Array.from(document.querySelectorAll('.date-picker__day:not(.date-picker__day--other-month)'));
    fireEvent.click(days[3]); // start
    fireEvent.click(days[7]); // end (later date)
    expect(handleRangeChange).toHaveBeenCalledTimes(2);
    const lastCall = handleRangeChange.mock.calls[1][0];
    expect(lastCall.start).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(lastCall.end).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('shows range-start class on start date', () => {
    const today = new Date();
    const start = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-10`;
    const end = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-20`;
    const { container } = render(() => (
      <DatePicker range rangeValue={{ start, end }} onRangeChange={() => {}} />
    ));
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    expect(document.querySelector('.date-picker__day--range-start')).toBeInTheDocument();
    expect(document.querySelector('.date-picker__day--range-end')).toBeInTheDocument();
    expect(document.querySelector('.date-picker__day--in-range')).toBeInTheDocument();
  });

  it('clears range value when clear button is clicked', () => {
    const handleRangeChange = vi.fn();
    const start = '2026-02-10';
    const end = '2026-02-20';
    const { container } = render(() => (
      <DatePicker range rangeValue={{ start, end }} onRangeChange={handleRangeChange} clearable />
    ));
    fireEvent.click(container.querySelector('.date-picker__clear')!);
    expect(handleRangeChange).toHaveBeenCalledWith({ start: undefined, end: undefined });
  });

  // ---- Controlled open state ----

  it('respects controlled open prop', () => {
    render(() => <DatePicker open={true} />);
    expect(document.querySelector('.date-picker__panel')).toBeInTheDocument();
  });

  it('calls onOpenChange when icon button is clicked', () => {
    const handleOpenChange = vi.fn();
    const { container } = render(() => (
      <DatePicker open={false} onOpenChange={handleOpenChange} />
    ));
    fireEvent.click(container.querySelector('.date-picker__icon-btn')!);
    expect(handleOpenChange).toHaveBeenCalledWith(true);
  });
});

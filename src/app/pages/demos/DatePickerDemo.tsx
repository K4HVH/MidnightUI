import { createSignal } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { DatePicker, DatePickerRangeValue } from '../../../components/inputs/DatePicker';
import { FormField } from '../../../components/feedback/FormField';

export default function DatePickerDemo() {
  const [date, setDate] = createSignal('');
  const [time, setTime] = createSignal('');
  const [datetime, setDatetime] = createSignal('');
  const [preloaded, setPreloaded] = createSignal('2026-02-19');
  const [clearable, setClearable] = createSignal('');
  const [range, setRange] = createSignal<DatePickerRangeValue>({});
  const [rangeDateTime, setRangeDateTime] = createSignal<DatePickerRangeValue>({});
  const [constrained, setConstrained] = createSignal('');
  const [withDisabled, setWithDisabled] = createSignal('');
  const [compact, setCompact] = createSignal('');
  const [formDate, setFormDate] = createSignal('');
  const [timeWithSeconds, setTimeWithSeconds] = createSignal('');
  const [time12h, setTime12h] = createSignal('');
  const [timeStep, setTimeStep] = createSignal('');

  // Disable weekends
  const isWeekend = (d: Date) => d.getDay() === 0 || d.getDay() === 6;

  return (
    <>
      <h2>DatePicker Component Examples</h2>

      {/* Basic date */}
      <Card>
        <CardHeader
          title="Date Picker"
          subtitle="Basic date selection. Value is an ISO date string (YYYY-MM-DD)."
        />
        <DatePicker
          label="Select date"
          value={date()}
          onChange={setDate}
        />
        <p><small>Value: {date() || 'none'}</small></p>
      </Card>

      {/* Preloaded value */}
      <Card>
        <CardHeader
          title="Preloaded Value"
          subtitle="Controlled with an initial value."
        />
        <DatePicker
          label="Start date"
          value={preloaded()}
          onChange={setPreloaded}
        />
        <p><small>Value: {preloaded() || 'none'}</small></p>
      </Card>

      {/* Time picker */}
      <Card>
        <CardHeader
          title="Time Picker"
          subtitle="mode='time' — shows only the time spinner. Value is HH:MM."
        />
        <DatePicker
          label="Select time"
          mode="time"
          value={time()}
          onChange={setTime}
        />
        <p><small>Value: {time() || 'none'}</small></p>
      </Card>

      {/* Datetime */}
      <Card>
        <CardHeader
          title="Date & Time Picker"
          subtitle="mode='datetime' — calendar plus time spinner. Value is YYYY-MM-DDTHH:MM."
        />
        <DatePicker
          label="Select date & time"
          mode="datetime"
          value={datetime()}
          onChange={setDatetime}
        />
        <p><small>Value: {datetime() || 'none'}</small></p>
      </Card>

      {/* Clearable */}
      <Card>
        <CardHeader
          title="Clearable"
          subtitle="Shows an × button to reset the value."
        />
        <DatePicker
          label="Appointment"
          value={clearable()}
          onChange={setClearable}
          clearable
        />
        <p><small>Value: {clearable() || 'none'}</small></p>
      </Card>

      {/* Date range */}
      <Card>
        <CardHeader
          title="Date Range"
          subtitle="range — selects a start and end date."
        />
        <DatePicker
          label="Date range"
          range
          rangeValue={range()}
          onRangeChange={setRange}
          clearable
        />
        <p>
          <small>
            Start: {range().start || 'none'} &nbsp;|&nbsp; End: {range().end || 'none'}
          </small>
        </p>
      </Card>

      {/* Datetime range */}
      <Card>
        <CardHeader
          title="Datetime Range"
          subtitle="range + mode='datetime' — selects date + time for both endpoints."
        />
        <DatePicker
          label="Event window"
          range
          mode="datetime"
          rangeValue={rangeDateTime()}
          onRangeChange={setRangeDateTime}
          clearable
        />
        <p>
          <small>
            Start: {rangeDateTime().start || 'none'} &nbsp;|&nbsp; End: {rangeDateTime().end || 'none'}
          </small>
        </p>
      </Card>

      {/* Min / Max constraint */}
      <Card>
        <CardHeader
          title="Min / Max Dates"
          subtitle="Only dates between 2026-02-10 and 2026-03-15 are selectable."
        />
        <DatePicker
          label="Constrained date"
          value={constrained()}
          onChange={setConstrained}
          minDate="2026-02-10"
          maxDate="2026-03-15"
        />
        <p><small>Value: {constrained() || 'none'}</small></p>
      </Card>

      {/* isDateDisabled */}
      <Card>
        <CardHeader
          title="Disabled Dates (isDateDisabled)"
          subtitle="Weekends (Saturday & Sunday) are disabled via a callback."
        />
        <DatePicker
          label="Weekdays only"
          value={withDisabled()}
          onChange={setWithDisabled}
          isDateDisabled={isWeekend}
          clearable
        />
        <p><small>Value: {withDisabled() || 'none'}</small></p>
      </Card>

      {/* Compact */}
      <Card>
        <CardHeader
          title="Compact Size"
          subtitle="size='compact' — reduced padding for dense layouts."
        />
        <div style={{ display: 'flex', gap: 'var(--g-spacing)', 'flex-wrap': 'wrap', 'align-items': 'flex-end' }}>
          <DatePicker
            label="Date (compact)"
            size="compact"
            value={compact()}
            onChange={setCompact}
          />
          <DatePicker
            label="Range (compact)"
            size="compact"
            range
            rangeValue={range()}
            onRangeChange={setRange}
          />
          <DatePicker
            label="Time (compact)"
            mode="time"
            size="compact"
            value={time()}
            onChange={setTime}
          />
        </div>
      </Card>

      {/* Disabled */}
      <Card>
        <CardHeader
          title="Disabled"
          subtitle="disabled — the picker cannot be opened."
        />
        <div style={{ display: 'flex', gap: 'var(--g-spacing)', 'flex-wrap': 'wrap', 'align-items': 'flex-end' }}>
          <DatePicker label="Disabled (no value)" disabled />
          <DatePicker label="Disabled (with value)" value="2026-02-19" disabled />
        </div>
      </Card>

      {/* Invalid */}
      <Card>
        <CardHeader
          title="Invalid State"
          subtitle="invalid — shows a danger border for validation feedback."
        />
        <DatePicker
          label="Required date"
          value={date()}
          onChange={setDate}
          invalid={!date()}
          error={!date() ? 'A date is required' : undefined}
        />
        <p><small>Value: {date() || 'none'}</small></p>
      </Card>

      {/* FormField integration */}
      <Card>
        <CardHeader
          title="FormField Integration"
          subtitle="Wrapped in FormField for label, required asterisk, and error display."
        />
        <FormField label="Booking date" required error={!formDate() ? 'Please select a date' : undefined}>
          <DatePicker
            value={formDate()}
            onChange={setFormDate}
            invalid={!formDate()}
          />
        </FormField>
        <p><small>Value: {formDate() || 'none'}</small></p>
      </Card>

      {/* Seconds */}
      <Card>
        <CardHeader
          title="Seconds Support"
          subtitle="showSeconds — adds a seconds column to the time spinner. Value includes HH:MM:SS."
        />
        <DatePicker
          label="Time with seconds"
          mode="time"
          showSeconds
          value={timeWithSeconds()}
          onChange={setTimeWithSeconds}
        />
        <p><small>Value: {timeWithSeconds() || 'none'}</small></p>
      </Card>

      {/* 12-hour clock */}
      <Card>
        <CardHeader
          title="12-Hour Clock (AM/PM)"
          subtitle="use12Hour — shows 1–12 hour format with an AM/PM toggle button."
        />
        <div style={{ display: 'flex', gap: 'var(--g-spacing)', 'flex-wrap': 'wrap', 'align-items': 'flex-end' }}>
          <DatePicker
            label="Time (12h)"
            mode="time"
            use12Hour
            value={time12h()}
            onChange={setTime12h}
          />
          <DatePicker
            label="Date & Time (12h)"
            mode="datetime"
            use12Hour
            value={datetime()}
            onChange={setDatetime}
          />
        </div>
        <p><small>Value: {time12h() || 'none'}</small></p>
      </Card>

      {/* Time steps */}
      <Card>
        <CardHeader
          title="Time Steps"
          subtitle="timeStep=15 — minute spinner advances by 15. secondStep=10 — second spinner advances by 10."
        />
        <DatePicker
          label="Stepped time"
          mode="time"
          showSeconds
          timeStep={15}
          secondStep={10}
          value={timeStep()}
          onChange={setTimeStep}
        />
        <p><small>Value: {timeStep() || 'none'}</small></p>
      </Card>
    </>
  );
}

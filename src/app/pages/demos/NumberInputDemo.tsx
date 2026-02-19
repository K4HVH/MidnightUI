import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { NumberInput } from '../../../components/inputs/NumberInput';
import { FormField } from '../../../components/feedback/FormField';

const NumberInputDemo: Component = () => {
  const [value1, setValue1] = createSignal<number | undefined>(42);
  const [value2, setValue2] = createSignal<number | undefined>(50);
  const [value3, setValue3] = createSignal<number | undefined>(0);
  const [value4, setValue4] = createSignal<number | undefined>(1.00);
  const [value5, setValue5] = createSignal<number | undefined>(25);
  const [value6, setValue6] = createSignal<number | undefined>(undefined);

  return (
    <>
      <h2>NumberInput Component Examples</h2>

      <Card>
        <CardHeader title="Basic" />
        <NumberInput
          value={value1()}
          onChange={setValue1}
        />
        <p><small>Value: {value1() ?? 'undefined'}</small></p>
      </Card>

      <Card>
        <CardHeader title="With Label" />
        <NumberInput
          label="Quantity"
          value={value1()}
          onChange={setValue1}
        />
      </Card>

      <Card>
        <CardHeader title="Min / Max Range" subtitle="Clamped to 0–100 on blur" />
        <NumberInput
          label="Percentage"
          value={value2()}
          onChange={setValue2}
          min={0}
          max={100}
          placeholder="0–100"
        />
        <p><small>Value: {value2() ?? 'undefined'}</small></p>
      </Card>

      <Card>
        <CardHeader title="Custom Step" subtitle="Increments by 5" />
        <NumberInput
          label="Step size"
          value={value3()}
          onChange={setValue3}
          step={5}
          min={0}
          max={100}
        />
        <p><small>Value: {value3() ?? 'undefined'}</small></p>
      </Card>

      <Card>
        <CardHeader title="Decimal Precision" subtitle="precision={2}, step={0.01}" />
        <NumberInput
          label="Price"
          value={value4()}
          onChange={setValue4}
          step={0.01}
          precision={2}
          min={0}
          prefix="$"
        />
        <p><small>Value: {value4() ?? 'undefined'}</small></p>
      </Card>

      <Card>
        <CardHeader title="Prefix and Suffix" />
        <div style={{ display: 'flex', gap: 'var(--g-spacing)', "flex-wrap": 'wrap' }}>
          <div style={{ flex: 1, "min-width": '200px' }}>
            <NumberInput
              label="Currency"
              value={value4()}
              onChange={setValue4}
              step={0.01}
              precision={2}
              min={0}
              prefix="$"
            />
          </div>
          <div style={{ flex: 1, "min-width": '200px' }}>
            <NumberInput
              label="Weight"
              value={value5()}
              onChange={setValue5}
              step={0.5}
              precision={1}
              min={0}
              suffix="kg"
            />
          </div>
        </div>
      </Card>

      <Card>
        <CardHeader title="Compact Size" />
        <NumberInput
          size="compact"
          label="Count"
          value={value6()}
          onChange={setValue6}
          min={0}
          placeholder="–"
        />
        <p><small>Value: {value6() ?? 'undefined'}</small></p>
      </Card>

      <Card>
        <CardHeader title="Disabled State" />
        <NumberInput
          label="Read only"
          value={42}
          disabled
        />
      </Card>

      <Card>
        <CardHeader title="Invalid State" />
        <NumberInput
          label="Quantity"
          value={value3()}
          onChange={setValue3}
          invalid
        />
      </Card>

      <Card>
        <CardHeader title="With FormField" subtitle="Integrated with validation error display" />
        <FormField label="Units" required error={value3() !== undefined && value3()! > 99 ? 'Maximum is 99' : undefined}>
          <NumberInput
            value={value3()}
            onChange={setValue3}
            min={0}
            max={99}
            name="units"
            invalid={value3() !== undefined && value3()! > 99}
          />
        </FormField>
      </Card>

      <Card>
        <CardHeader title="No Bounds" subtitle="Unrestricted — steppers never disable" />
        <NumberInput
          label="Temperature"
          value={value5()}
          onChange={setValue5}
          step={1}
          suffix="°C"
        />
        <p><small>Value: {value5() ?? 'undefined'}</small></p>
      </Card>
    </>
  );
};

export default NumberInputDemo;

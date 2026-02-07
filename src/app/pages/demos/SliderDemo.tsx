import type { Component } from 'solid-js';
import { createSignal } from 'solid-js';
import { Card, CardHeader } from '../../../components/surfaces/Card';
import { Slider } from '../../../components/inputs/Slider';

const SliderDemo: Component = () => {
  const [sliderValue1, setSliderValue1] = createSignal(50);
  const [sliderValue2, setSliderValue2] = createSignal(25);
  const [sliderValue3, setSliderValue3] = createSignal<[number, number]>([25, 75]);
  const [sliderValue4, setSliderValue4] = createSignal<[number, number]>([20, 80]);
  const [sliderValue5, setSliderValue5] = createSignal(50);

  return (
    <>
      <h2>Slider Component Examples</h2>

      <Card>
        <CardHeader title="Basic Slider" />
        <Slider
          value={sliderValue1()}
          onChange={setSliderValue1}
          min={0}
          max={100}
        />
        <p><small>Value: {sliderValue1()}</small></p>
      </Card>

      <Card>
        <CardHeader title="Slider with Step" />
        <Slider
          value={sliderValue2()}
          onChange={setSliderValue2}
          min={0}
          max={100}
          step={10}
        />
        <p><small>Value: {sliderValue2()}</small></p>
      </Card>

      <Card>
        <CardHeader title="Range Slider" />
        <Slider
          range
          value={sliderValue3()}
          onChange={setSliderValue3}
          min={0}
          max={100}
        />
        <p><small>Range: {sliderValue3()[0]} - {sliderValue3()[1]}</small></p>
      </Card>

      <Card>
        <CardHeader title="Compact Size" />
        <Slider
          size="compact"
          range
          value={sliderValue4()}
          onChange={setSliderValue4}
          min={0}
          max={100}
        />
        <p><small>Range: {sliderValue4()[0]} - {sliderValue4()[1]}</small></p>
      </Card>

      <Card>
        <CardHeader title="Disabled State" />
        <Slider
          disabled
          value={sliderValue5()}
          min={0}
          max={100}
        />
        <p><small>Value: {sliderValue5()}</small></p>
      </Card>

      <Card>
        <CardHeader title="Vertical Orientation" />
        <Slider
          orientation="vertical"
          value={sliderValue1()}
          onChange={setSliderValue1}
          min={0}
          max={100}
        />
        <p><small>Value: {sliderValue1()}</small></p>
      </Card>

      <Card>
        <CardHeader title="With Marks" />
        <Slider
          value={sliderValue1()}
          onChange={setSliderValue1}
          min={0}
          max={100}
          step={25}
          marks={[
            { value: 0, label: '0%' },
            { value: 25, label: '25%' },
            { value: 50, label: '50%' },
            { value: 75, label: '75%' },
            { value: 100, label: '100%' },
          ]}
        />
        <p><small>Value: {sliderValue1()}</small></p>
      </Card>

      <Card>
        <CardHeader title="With Tooltip (drag to see)" />
        <Slider
          value={sliderValue2()}
          onChange={setSliderValue2}
          min={0}
          max={100}
          showTooltip
        />
        <p><small>Value: {sliderValue2()}</small></p>
      </Card>

      <Card>
        <CardHeader title="Restricted to Marks" subtitle="step={null} - only snaps to marked values" />
        <Slider
          value={sliderValue2()}
          onChange={setSliderValue2}
          min={0}
          max={100}
          step={null}
          marks={[
            { value: 0, label: 'Low' },
            { value: 33, label: 'Medium' },
            { value: 66, label: 'High' },
            { value: 100, label: 'Max' },
          ]}
          showTooltip
        />
        <p><small>Value: {sliderValue2()}</small></p>
      </Card>
    </>
  );
};

export default SliderDemo;
